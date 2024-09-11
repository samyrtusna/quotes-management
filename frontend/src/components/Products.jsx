import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductService from "../service/ProductService";
import Title from "./communs/Title";
import CustomTable from "./communs/CostumTable";
import ProductForm from "./ProductsForm";
import { setProducts } from "../features/productSlices";

function Products() {
  const { Products } = useSelector((state) => state.Products);
  const dispatch = useDispatch();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await ProductService.getAll();
        dispatch(setProducts(data));
      } catch (error) {
        setError(error.message);
      }
    };
    fetchProducts();
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
    { field: "type", headerName: "Type", align: "right" },
  ];

  return (
    <>
      <Title
        title="Products"
        customForm="productsForm"
        addButton="yes"
      >
        Add Product
      </Title>
      <CustomTable
        columns={columns}
        data={Products}
        customForm="productsForm"
        pointerField="label"
      />
    </>
  );
}

export default Products;
