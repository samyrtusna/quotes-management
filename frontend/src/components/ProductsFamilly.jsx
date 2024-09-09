import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProductFamilly } from "../features/famillySlices";
import Title from "./communs/Title";
import CustomTable from "./communs/CostumTable";

function ProductsFamilly() {
  const {
    loading = false,
    ProductsFamilly = [],
    error = "",
  } = useSelector((state) => state.ProductsFamilly);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProductFamilly());
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const columns = [
    { field: "code", headerName: "Code", align: "left" },
    { field: "label", headerName: "Label", align: "left" },
  ];

  return (
    <>
      <Title
        title="Products Familly"
        customForm="productsFamillyForm"
        addButton="yes"
      >
        Add Product
      </Title>

      <CustomTable
        columns={columns}
        data={ProductsFamilly}
        customForm="productsFamillyForm"
        pointerField="label"
      />
    </>
  );
}

export default ProductsFamilly;
