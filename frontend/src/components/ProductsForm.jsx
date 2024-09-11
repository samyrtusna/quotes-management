import React, { useEffect, useRef, useState } from "react";
import ProductService from "../service/ProductService";
import FamillyService from "../service/FamillyService";
import ProductDetailsService from "../service/ProductDetailsService";
import RawService from "../service/RawService";
import { setProductsFamilly } from "../features/famillySlices";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
} from "@mui/material";

const allowedCharacters = "0123456789().+-*/HW".split("");

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const inputRef = useRef();
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [familly, setFamilly] = useState("");
  const [color, setColor] = useState("");
  const [type, setType] = useState("");
  const [rawProduct, setRawProduct] = useState("");
  const [formula, setFormula] = useState("");
  const [rawList, setRawList] = useState([]);
  const [famillyList, setFamillyList] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const { ProductsFamilly } = useSelector((state) => state.ProductsFamilly);
  const { rawProducts } = useSelector((state) => state.RawProducts);
  const dispatch = useDispatch();

  const getProduct = async (id) => {
    try {
      const { data } = await ProductService.detail(id);
      setCode(data.code);
      setLabel(data.label);
      setFamilly(
        data.familly
          ? ProductsFamilly.find((f) => f.id === data.familly)?.label
          : ""
      );
      setColor(data.color);
      setType(data.type);
      const updatedTableRows = data.details.map((detail) => {
        const rawProduct = rawProducts.find(
          (raw) => raw.id === detail.raw_product
        );
        return {
          rawProduct: rawProduct || { label: "" },
          formula: detail.formula,
        };
      });

      setTableRows(updatedTableRows);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchProductFamilly = async () => {
    try {
      const { data } = await FamillyService.getAll();
      dispatch(setProductsFamilly(data));
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchProductFamilly();
    setFamillyList(ProductsFamilly);
    setRawList(rawProducts);
  }, []);

  useEffect(() => {
    if (id !== "new") {
      getProduct(id);
    }
  }, [id]);

  const handleAddOrUpdateTableRow = () => {
    if (editIndex !== null) {
      const updatedRows = tableRows.map((row, index) =>
        index === editIndex ? { rawProduct, formula } : row
      );

      setTableRows(updatedRows);
      setEditIndex(null);
    } else {
      setTableRows([...tableRows, { rawProduct, formula }]);
    }
    setRawProduct("");
    setFormula("");
  };

  const handleCharacterClick = (char) => {
    setFormula((prevFormula) => prevFormula + char);
  };

  const handleRowClick = (index) => {
    const row = tableRows[index];
    setRawProduct(row.rawProduct);
    setFormula(row.formula);
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
      type,
    };
    try {
      const response = await ProductService.create(newProduct);
      const productId = response.data.id;

      await Promise.all(
        tableRows.map(async (row) => {
          const productDetail = {
            formula: row.formula,
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
    const newProduct = {
      code,
      label,
      familly: familly?.id,
      color,
      type,
    };
    try {
      const response = await ProductService.update(id, newProduct);
      const productId = response.data.id;

      await Promise.all(
        tableRows.map(async (row) => {
          const productDetail = {
            formula: row.formula,
            product: productId,
            raw_product: row.rawProduct?.id,
          };
          await ProductDetailsService.update(id, productDetail);
        })
      );
      navigate("/products/");
    } catch (error) {
      console.error("Create Error:", error.message);
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

  const fields = [
    { name: "code", label: "Code", value: code, type: "text" },
    { name: "label", label: "Label", value: label, type: "text" },
    {
      name: "familly",
      label: "Familly",
      value: familly || "",
      type: "select",
      options: famillyList.map((f) => ({ value: f.label, label: f.label })),
    },
    { name: "color", label: "Color", value: color, type: "text" },
    { name: "type", label: "Type", value: type, type: "text" },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
      >
        Add new Product
      </Typography>
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          xs={6}
        >
          <Autocomplete
            options={famillyList}
            getOptionLabel={(option) => option?.label || ""}
            value={familly || null}
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
            label="Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
          />
        </Grid>
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
            label="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid
          item
          xs={6}
        >
          <TextField
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
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
            options={rawList}
            getOptionLabel={(option) => option?.label || ""}
            value={rawProduct || null}
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
          xs={6}
        >
          <TextField
            label="Formula"
            value={formula}
            inputProps={{ readOnly: true }}
            fullWidth
          />
          <Grid
            item
            xs={12}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                marginTop: 1,
              }}
            >
              {allowedCharacters.map((char, index) => (
                <Button
                  key={index}
                  variant="text"
                  size="small"
                  onClick={() => handleCharacterClick(char)}
                  sx={{ minWidth: 30 }}
                >
                  {char}
                </Button>
              ))}
              <Button
                variant="text"
                size="small"
                sx={{ minWidth: 64 }}
                onClick={() => setFormula((prev) => prev.slice(0, -1))}
              >
                Backspace
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{ textAlign: "right" }}
        >
          <Button
            variant="contained"
            disabled={!rawProduct || !formula}
            color="primary"
            onClick={handleAddOrUpdateTableRow}
            sx={{ marginTop: 2 }}
          >
            {editIndex !== null ? "Update" : "Add"}
          </Button>
        </Grid>
      </Grid>

      <TableContainer
        component={Paper}
        sx={{ marginTop: 2 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Raw Product</TableCell>
              <TableCell>Formula</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((row, index) => (
              <TableRow
                key={index}
                onClick={() => handleRowClick(index)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{row.rawProduct?.label || ""}</TableCell>
                <TableCell>{row.formula}</TableCell>
                <TableCell
                  colSpan={2}
                  sx={{ textAlign: "right" }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRow(index);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ marginTop: 2 }}
      >
        Submit
      </Button>
    </Box>
  );
}

export default ProductForm;
