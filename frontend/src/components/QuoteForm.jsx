import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  InputBase,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import axios from "axios";
import ProductService from "../service/ProductService";
import { setProducts } from "../features/productSlices";
import FormatMoney from "../utils/MoneyFormat";
import { useDispatch, useSelector } from "react-redux";

function QuoteForm(props) {
  const { darkMode } = props;
  const [clientName, setClientName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quoteItems, setQuoteItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [rawProductsConsumed, setRawProductsConsumed] = useState([]);
  const [successMessage, setSuccessMessage] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { Products } = useSelector((state) => state.Products);

  const fetchProducts = async () => {
    try {
      const response = await ProductService.getAll();
      dispatch(setProducts(response.data));
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleItemSubmit = async () => {
    const itemData = {
      index: quoteItems.length + 1,
      product: selectedProduct.label,
      code: selectedProduct.code,
      height,
      width,
      quantity,
    };

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/quotes/quotes/calculate_product_amount/`,
        itemData
      );
      const newItem = {
        ...itemData,
        amount: response.data.amount,
      };

      setQuoteItems([...quoteItems, newItem]);
      setTotalAmount(totalAmount + response.data.amount);

      setRawProductsConsumed([
        ...rawProductsConsumed,
        ...response.data.raw_product_consumed,
      ]);
      setSelectedProduct(null);
      setHeight("");
      setWidth("");
      setQuantity("");
    } catch (error) {
      console.error("Error calculating product amount", error);
    }
  };

  const handleQuoteSubmit = async () => {
    const quoteData = {
      client_name: clientName,
      amount: totalAmount,
    };

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/quotes/quotes/save_quote/`,
        quoteData
      );
      console.log("save quote response: ", response.data);

      const quoteId = response.data.id;

      await Promise.all(
        quoteItems.map(async (item) => {
          const itemData = {
            ...item,
            product: Products.find((p) => p.label === item.product).id,
            quote: quoteId,
          };
          const itemResponse = await axios.post(
            `http://127.0.0.1:8000/quotes/quote_details/`,
            itemData
          );
          const quoteDetailId = itemResponse.data.id;

          const relatedRawProducts = rawProductsConsumed
            .filter((raw) => raw.index === item.index)
            .map(({ index, ...rest }) => ({
              ...rest,
            }));

          await Promise.all(
            relatedRawProducts.map(async (raw) => {
              const rawProductsConsumedObject = {
                ...raw,
                quote_details: quoteDetailId,
              };
              await axios.post(
                `http://127.0.0.1:8000/raw_products/raws_consumed/`,
                rawProductsConsumedObject
              );
            })
          );
        })
      );
      try {
        const scrapsResponse = await axios.post(
          `http://127.0.0.1:8000/scraps/scraps/calculate_scraps_bars/`,
          quoteItems
        );
        console.log("scraps bars response : ", scrapsResponse.data);
        await Promise.all(
          scrapsResponse.data.map(async (obj) => {
            await axios.post(`http://127.0.0.1:8000/scraps/scraps/`, obj);
          })
        );
      } catch (error) {
        console.error("Error calculating scraps bars", error);
      }

      setSuccessMessage(true);
      setTimeout(() => {
        navigate("/quotes/");
      }, 3000);
    } catch (error) {
      console.error("Error saving quote", error);
    }
  };

  const columns = [
    { field: "product", headerName: "Product", align: "left" },
    { field: "height", headerName: "Height", align: "left" },
    { field: "width", headerName: "Width", align: "left" },
    { field: "quantity", headerName: "Quantity", align: "left" },
    { field: "amount", headerName: "Amount", align: "left" },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Snackbar
        open={successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(false)}
      >
        <Alert
          onClose={() => setSuccessMessage(false)}
          severity="success"
        >
          Quote saved successfully!
        </Alert>
      </Snackbar>
      <Grid
        container
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h6">Client:</Typography>
        </Grid>
        <Grid item>
          <TextField
            value={clientName}
            onChange={(event) => setClientName(event.target.value)}
            sx={{ fontSize: "h6.fontSize", paddingLeft: 1 }}
            size="small"
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
        <Paper
          sx={{ width: "80%", padding: 2, bgcolor: !darkMode && "inherit" }}
        >
          <TableContainer
            component={Paper}
            sx={{ backgroundColor: "inherit" }}
            elevation={3}
          >
            <Table
              sx={{ minWidth: 650 }}
              aria-label="custom table"
            >
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.field}
                      align={column.align}
                      sx={{
                        fontSize: 20,
                        fontWeight: "bold",
                        width: column.field === "product" ? "50%" : "10%",
                        color: theme.palette.text.primary,
                        bgcolor: !darkMode && "#acd0dc",
                      }}
                    >
                      {column.headerName}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {quoteItems.map((item, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.field}
                        align={column.align}
                      >
                        {column.field === "amount"
                          ? FormatMoney(item[column.field])
                          : item[column.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>
                    <Select
                      value={selectedProduct ? selectedProduct.label : ""}
                      onChange={(e) =>
                        setSelectedProduct(
                          Products.find(
                            (product) => product.label === e.target.value
                          )
                        )
                      }
                      displayEmpty
                      fullWidth
                      input={<InputBase />}
                    >
                      <MenuItem value="">
                        <em>Select Product</em>
                      </MenuItem>
                      {Products.map((product) => (
                        <MenuItem
                          key={product.id}
                          value={product.label}
                        >
                          {product.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      value={height}
                      onChange={(e) =>
                        !isNaN(e.target.value) && setHeight(e.target.value)
                      }
                      InputProps={{ disableUnderline: true }}
                      placeholder="Height"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      value={width}
                      onChange={(e) =>
                        !isNaN(e.target.value) && setWidth(e.target.value)
                      }
                      InputProps={{ disableUnderline: true }}
                      placeholder="Width"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      value={quantity}
                      onChange={(e) =>
                        !isNaN(e.target.value) && setQuantity(e.target.value)
                      }
                      InputProps={{ disableUnderline: true }}
                      placeholder="Quantity"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={handleItemSubmit}
                      disabled={
                        !(selectedProduct && height && width && quantity)
                      }
                    >
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Grid
            container
            justifyContent="flex-end"
            alignItems="center"
            sx={{ marginTop: 2 }}
          >
            <Grid item>
              <Typography sx={{ fontWeight: "bold" }}>Total Amount:</Typography>
            </Grid>
            <Grid item>
              <Box sx={{ width: "150px", textAlign: "right" }}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {FormatMoney(totalAmount)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            onClick={handleQuoteSubmit}
            sx={{
              marginTop: 2,
              bgcolor: darkMode ? "#5e6b6b" : "#26b7f0",
              color: darkMode ? "#ffffff" : "#000000",
              "&:hover": { bgcolor: darkMode && "#3a4242" },
            }}
            disabled={!(clientName && quoteItems.length !== 0)}
          >
            Save
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}

export default QuoteForm;
