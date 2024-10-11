import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductService from "../service/ProductService";
import RawService from "../service/RawService";
import FamillyService from "../service/FamillyService";
import Title from "./communs/Title";
import CustomTable from "./communs/CostumTable";
import { setProducts } from "../features/productSlices";
import { setRawProducts } from "../features/rawSlices";
import { setProductsFamilly } from "../features/famillySlices";

function Products(props) {
  const { darkMode } = props;
  const { Products } = useSelector((state) => state.Products);
  const dispatch = useDispatch();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState("");

  const fetchRawProducts = async () => {
    try {
      const { data } = await RawService.getAll();
      dispatch(setRawProducts(data));
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchProductsFamilly = async () => {
    try {
      const { data } = await FamillyService.getAll();
      dispatch(setProductsFamilly(data));
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await ProductService.getAll();
      dispatch(setProducts(data));
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchRawProducts();
    fetchProductsFamilly();
  }, []);

  const handleRowClick = (product) => {
    setSelectedProduct(product);
  };

  if (!Products && !error) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) return <p>Error: {error}</p>;

  const columns = [
    { field: "code", headerName: "Code", align: "left" },
    { field: "label", headerName: "Label", align: "left" },
    { field: "familly", headerName: "Familly", align: "right" },
    { field: "color", headerName: "Color", align: "right" },
  ];

  return (
    <>
      <Title
        title="Products"
        customForm="productsForm"
        addButton="yes"
        darkMode={darkMode}
      >
        Add Product
      </Title>
      <CustomTable
        columns={columns}
        data={Products}
        customForm="productsForm"
        pointerField="label"
        darkMode={darkMode}
      />
    </>
  );
}

export default Products;
