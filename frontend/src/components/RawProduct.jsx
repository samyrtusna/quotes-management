import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Title from "./communs/Title";
import CustomTable from "./communs/CostumTable";
import RawService from "../service/RawService";
import { setRawProducts } from "../features/rawSlices";
import FormatMoney from "../utils/MoneyFormat";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function RawProduct() {
  const { rawProducts } = useSelector((state) => state.RawProducts);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const fetchRawProducts = async () => {
    try {
      const { data } = await RawService.getAll();
      dispatch(setRawProducts(data));
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchRawProducts();
  }, []);

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

  if (!rawProducts && !error) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }

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
