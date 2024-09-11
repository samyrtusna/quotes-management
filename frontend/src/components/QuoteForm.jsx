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
} from "@mui/material";
import axios from "axios";
import ProductService from "../service/ProductService";
import FormatMoney from "../utils/MoneyFormat";

function QuoteForm() {
  const [clientName, setClientName] = useState("");
  const [productsList, setProductsList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [quantity, setQuantity] = useState("");
  const [products, setProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [rawProductsConsumed, setRawProductsConsumed] = useState([]);
  const [productScraps, setProductScraps] = useState([]);
  const [successMessage, setSuccessMessage] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await ProductService.getAll();
      setProductsList(response.data);
      console.log("products list : ", response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductSubmit = async () => {
    const productData = {
      index: products.length + 1,
      product: selectedProduct.label,
      code: selectedProduct.code,
      height,
      width,
      quantity,
    };

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/quotes/quotes/calculate_product_amount/`,
        productData
      );
      console.log("calculate product amount response : ", response.data);
      const newProduct = {
        ...productData,
        amount: response.data.amount,
      };

      setProducts([...products, newProduct]);
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
    //   try {
    //     const scrapsResponse = await axios.post(
    //       `http://127.0.0.1:8000/scraps/scraps/calculate_scraps_bars/`,
    //       productData
    //     );
    //     console.log("scraps bars response : ", scrapsResponse.data);
    //     setProductScraps([...productScraps, ...scrapsResponse.data]);
    //   } catch (error) {
    //     console.error("Error calculating scraps bars", error);
    //   }
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
        products.map(async (product) => {
          const productData = {
            ...product,
            product: productsList.find((p) => p.label === product.product).id,
            quote: quoteId,
          };
          const productResponse = await axios.post(
            `http://127.0.0.1:8000/quotes/quote_details/`,
            productData
          );
          console.log("save quote details response : ", productResponse.data);

          const quoteDetailId = productResponse.data.id;

          const relatedRawProducts = rawProductsConsumed
            .filter((raw) => raw.index === product.index)
            .map(({ index, ...rest }) => ({
              ...rest,
            }));

          console.log("related raw products : ", relatedRawProducts);

          await Promise.all(
            relatedRawProducts.map(async (raw) => {
              const rawProductsConsumedObject = {
                ...raw,
                quote_details: quoteDetailId,
              };
              console.log(
                "raw product consumed object : ",
                rawProductsConsumedObject
              );
              await axios.post(
                `http://127.0.0.1:8000/raw_products/raws_consumed/`,
                rawProductsConsumedObject
              );
            })
          );
        })
      );
      // await Promise.all(
      //   productScraps.map(async (obj) => {
      //     await axios.post(`http://127.0.0.1:8000/scraps/scraps/`, obj);
      //   })
      // );

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
        <Paper sx={{ width: "80%", padding: 2 }}>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="custom table"
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.field}
                      align={column.align}
                      sx={{
                        fontSize: 20,
                        fontWeight: "bold",
                        width: column.field === "product" ? "50%" : "10%",
                      }}
                    >
                      {column.headerName}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.field}
                        align={column.align}
                      >
                        {FormatMoney(product[column.field])}
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
                          productsList.find(
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
                      {productsList.map((product) => (
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
                      onChange={(e) => setHeight(e.target.value)}
                      InputProps={{ disableUnderline: true }}
                      placeholder="Height"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      InputProps={{ disableUnderline: true }}
                      placeholder="Width"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      InputProps={{ disableUnderline: true }}
                      placeholder="Quantity"
                    />
                  </TableCell>
                  <TableCell>
                    <Button onClick={handleProductSubmit}>Add</Button>
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
            sx={{ marginTop: 2 }}
          >
            Save
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}

export default QuoteForm;
