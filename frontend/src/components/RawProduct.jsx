import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Title from "./communs/Title";
import CustomTable from "./communs/CostumTable";
import { fetchRawProduct } from "../features/rawSlices";
import FormatMoney from "../utils/MoneyFormat";

function RawProduct() {
  const {
    loading = false,
    rawProducts = [],
    error = "",
  } = useSelector((state) => state.RawProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRawProduct());
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const columns = [
    { field: "code", headerName: "Code", align: "left" },
    { field: "label", headerName: "Label", align: "left" },
    {
      field: "price",
      headerName: "Price",
      align: "right",
      renderCell: (params) => FormatMoney(params.value),
    },
    { field: "length", headerName: "Length", align: "right" },
    { field: "mesure", headerName: "Mesure", align: "right" },
  ];
  return (
    <>
      <Title
        title="Raw Products"
        customForm="RawProductForm"
        addButton="yes"
      >
        Add Product
      </Title>

      <CustomTable
        columns={columns}
        data={rawProducts}
        customForm="RawProductForm"
        pointerField="label"
      />
    </>
  );
}

export default RawProduct;
