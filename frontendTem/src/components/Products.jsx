import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProduct } from "../features/productSlices";
import Title from "./communs/Title";
import CustomTable from "./communs/CostumTable";
import ProductForm from "./ProductsForm";

function Products() {
  const {
    loading = false,
    Products = [],
    error = "",
  } = useSelector((state) => state.Products);
  const dispatch = useDispatch();

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProduct());
  }, []);

  const handleRowClick = (product) => {
    setSelectedProduct(product);
  };

  if (loading) return <p>Loading...</p>;
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
