import React, { useEffect, useRef, useState } from "react";
import ProductService from "../service/ProductService";
import ProductDetailsService from "../service/ProductDetailsService";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
  CircularProgress,
  Stack,
  Popper,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const allowedCharacters = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "(",
  ")",
  "+",
  "-",
  "*",
  "/",
  "H",
  "W",
  ".",
  "Backspace",
];

function ProductForm(props) {
  const { darkMode } = props;
  const navigate = useNavigate();
  const { id } = useParams();
  const inputRef = useRef();
  const dispatch = useDispatch();

  // Form States
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [familly, setFamilly] = useState(null);
  const [color, setColor] = useState("");
  const [rawProduct, setRawProduct] = useState(null);
  const [formula, setFormula] = useState("");
  const [quantity, setQuantity] = useState("");

  // Table Rows
  const [tableRows, setTableRows] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Loading State
  const [isLoading, setIsLoading] = useState(true);

  // Redux State
  const { ProductsFamilly } = useSelector((state) => state.ProductsFamilly);
  const { rawProducts } = useSelector((state) => state.RawProducts);

  // Floating Calculator State
  const [showCalculator, setShowCalculator] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Dialog state
  const [open, setOpen] = useState(false);

  const fetchProductData = async () => {
    if (id !== "new" && rawProducts.length > 0 && ProductsFamilly.length > 0) {
      await getProduct(id);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProductData();
  }, [id, rawProducts, ProductsFamilly]);

  const getProduct = async (id) => {
    try {
      const { data } = await ProductService.detail(id);
      setCode(data.code);
      setLabel(data.label);
      setFamilly(
        data.familly ? ProductsFamilly.find((f) => f.id === data.familly) : null
      );
      setColor(data.color);

      const updatedTableRows = data.details.map((detail) => {
        const rawProduct = rawProducts.find(
          (raw) => raw.id === detail.raw_product
        );
        return {
          id: detail.id,
          rawProduct: rawProduct || { label: "" },
          formula: detail.formula,
          quantity: detail.slices_quantity,
        };
      });

      setTableRows(updatedTableRows);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleAddOrUpdateTableRow = () => {
    if (editIndex !== null) {
      const updatedRows = tableRows.map((row, index) =>
        index === editIndex ? { ...row, rawProduct, formula, quantity } : row
      );
      setTableRows(updatedRows);
      setEditIndex(null);
    } else {
      setTableRows([...tableRows, { rawProduct, formula, quantity }]);
    }

    setFormula("");
    setQuantity("");
  };

  const handleRowClick = (index) => {
    const row = tableRows[index];
    setRawProduct(row.rawProduct);
    setFormula(row.formula);
    setQuantity(row.quantity);
    setEditIndex(index);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = tableRows.filter((_, i) => i !== index);
    setTableRows(updatedRows);
    setEditIndex(null);
  };

  const saveProduct = async () => {
    const newProduct = {
      code,
      label,
      familly: familly?.id,
      color,
    };
    try {
      const response = await ProductService.create(newProduct);
      const productId = response.data.id;

      await Promise.all(
        tableRows.map(async (row) => {
          const productDetail = {
            formula: row.formula,
            slices_quantity: row.quantity,
            product: productId,
            raw_product: row.rawProduct?.id,
          };
          await ProductDetailsService.create(productDetail);
        })
      );
      navigate("/products/");
    } catch (error) {
      console.error("Create Error:", error.message);
    }
  };

  const updateProduct = async (id) => {
    const updatedProduct = {
      code,
      label,
      familly: familly?.id,
      color,
    };
    try {
      const response = await ProductService.update(id, updatedProduct);
      const productId = response.data.id;

      await Promise.all(
        tableRows.map(async (row) => {
          if (row.id) {
            const productDetail = {
              formula: row.formula,
              slices_quantity: row.quantity,
              product: productId,
              raw_product: row.rawProduct?.id,
            };
            await ProductDetailsService.update(row.id, productDetail);
          } else {
            const productDetail = {
              formula: row.formula,
              slices_quantity: row.quantity,
              product: productId,
              raw_product: row.rawProduct?.id,
            };
            await ProductDetailsService.create(productDetail);
          }
        })
      );
      navigate("/products/");
    } catch (error) {
      console.error("Update Error:", error.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (id !== "new") {
      updateProduct(id);
    } else {
      saveProduct();
    }
  };

  const handleProductDelete = async () => {
    try {
      await ProductService.delete(id);
      navigate("/products/");
    } catch (error) {
      console.error("Delete Error:", error.message);
    }
  };

  const handleFormulaFieldClick = (event) => {
    setAnchorEl(event.currentTarget);
    setShowCalculator(true);
  };

  const handleOutsideClick = (event) => {
    if (anchorEl && !anchorEl.contains(event.target)) {
      if (!event.target.closest(".calculator-popper")) {
        setShowCalculator(false);
      }
    }
  };

  const handleCharacterClick = (char) => {
    if (char === "Backspace") {
      setFormula((prevFormula) => prevFormula.slice(0, -1));
    } else {
      setFormula((prevFormula) => prevFormula + char);
    }
  };

  useEffect(() => {
    if (showCalculator) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showCalculator]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Stack
        sx={{ marginTop: 5, marginBottom: 10, marginLeft: 5 }}
        direction="row"
        justifyContent="space-between"
      >
        <Typography
          variant="h2"
          sx={{ marginLeft: 3 }}
          gutterBottom
        >
          {id !== "new" ? "Update Product" : "Add New Product"}
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit}>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={6}
          >
            <Autocomplete
              options={ProductsFamilly}
              getOptionLabel={(option) => option?.label || ""}
              value={familly}
              onChange={(event, newValue) => setFamilly(newValue)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Product Familly"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid
            item
            xs={6}
          >
            <TextField
              label="Code"
              value={code}
              onChange={(e) =>
                !isNaN(e.target.value) && setCode(e.target.value)
              }
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          sx={{ marginTop: 2 }}
        >
          <Grid
            item
            xs={6}
          >
            <TextField
              label="Label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid
            item
            xs={6}
          >
            <TextField
              label="Color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          sx={{ marginTop: 2 }}
        >
          <Grid
            item
            xs={6}
          >
            <Autocomplete
              options={rawProducts}
              getOptionLabel={(option) => option?.label || ""}
              value={rawProduct}
              onChange={(event, newValue) => setRawProduct(newValue)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Raw Products"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid
            item
            xs={4}
          >
            <TextField
              label="Formula"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              onClick={handleFormulaFieldClick}
              fullWidth
            />
            {showCalculator && (
              <Popper
                open={showCalculator}
                anchorEl={anchorEl}
                placement="bottom-start"
                className="calculator-popper"
                modifiers={{
                  preventOverflow: {
                    enabled: true,
                    boundariesElement: "viewport",
                  },
                }}
                sx={{ zIndex: 1300 }}
              >
                <Paper
                  sx={{
                    padding: 1,
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 1,
                    zIndex: 1300,
                  }}
                >
                  {allowedCharacters.map((char) => (
                    <Button
                      key={char}
                      onClick={() => handleCharacterClick(char)}
                      sx={{
                        padding: "10px",
                        minWidth: "40px",
                        fontSize: "16px",
                        gridColumn: char === "Backspace" ? "span 4" : "auto",
                      }}
                    >
                      {char}
                    </Button>
                  ))}
                </Paper>
              </Popper>
            )}
          </Grid>
          <Grid
            item
            xs={2}
          >
            <TextField
              label="Quantity"
              value={quantity}
              onChange={(e) =>
                !isNaN(e.target.value) && setQuantity(e.target.value)
              }
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
        >
          <Button
            onClick={handleAddOrUpdateTableRow}
            variant="contained"
            sx={{
              marginTop: 2,
              bgcolor: darkMode ? "#5e6b6b" : "#26b7f0",
              color: darkMode ? "#ffffff" : "#000000",
              "&:hover": { bgcolor: darkMode && "#3a4242" },
            }}
            disabled={!rawProduct || !formula}
          >
            {editIndex !== null ? "Update Row" : "Add Row"}
          </Button>
        </Grid>
      </form>

      <TableContainer
        component={Paper}
        sx={{ marginTop: 3, maxHeight: "500px", backgroundColor: "inherit" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontSize: 20,
                  fontWeight: "bold",
                  width: "50%",
                  bgcolor: !darkMode && "#acd0dc",
                }}
              >
                Raw Product
              </TableCell>
              <TableCell
                sx={{
                  fontSize: 20,
                  fontWeight: "bold",
                  width: "25%",
                  bgcolor: !darkMode && "#acd0dc",
                }}
              >
                Formula
              </TableCell>
              <TableCell
                sx={{
                  fontSize: 20,
                  fontWeight: "bold",
                  width: "15%",
                  bgcolor: !darkMode && "#acd0dc",
                }}
              >
                Quantity
              </TableCell>
              <TableCell
                sx={{
                  fontSize: 20,
                  fontWeight: "bold",
                  width: "10%",
                  bgcolor: !darkMode && "#acd0dc",
                }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((row, index) => (
              <TableRow
                key={index}
                onClick={() => handleRowClick(index)}
              >
                <TableCell sx={{ cursor: "pointer" }}>
                  {row.rawProduct?.label}
                </TableCell>
                <TableCell>{row.formula}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDeleteRow(index)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        display="flex"
        justifyContent="space-between"
      >
        <Button
          type="submit"
          variant="contained"
          sx={{
            marginTop: 3,
            bgcolor: darkMode ? "#5e6b6b" : "#26b7f0",
            color: darkMode ? "#ffffff" : "#000000",
            "&:hover": { bgcolor: darkMode && "#3a4242" },
          }}
          onClick={handleSubmit}
          disabled={
            !(familly && code && label && color && tableRows.length !== 0)
          }
        >
          {id !== "new" ? "Update Product" : "Add Product"}
        </Button>
        {id !== "new" && (
          <Box>
            <Button
              variant="contained"
              color="secondary"
              sx={{ marginTop: 3 }}
              onClick={() => setOpen(true)}
            >
              Delete
            </Button>
            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="dialog-title"
            >
              <DialogContent>
                <DialogContentText id="dialog-description">
                  Are you sure you want to delete this product ?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setOpen(false);
                    navigate("/products");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleProductDelete();
                    setOpen(false);
                  }}
                  autoFocus
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ProductForm;
