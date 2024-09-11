import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import CustomTable from "./communs/CostumTable";
import QuoteService from "../service/QuoteService";
import { setQuotes } from "../features/quoteSlices";
import RawProductsDrawer from "./RawProductsDrawer";
import FormatMoney from "../utils/MoneyFormat";

function QuoteDetails() {
  const { quotes } = useSelector((state) => state.Quotes);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRawProducts, setSelectedRawProducts] = useState([]);
  const [error, setError] = useState("");

  const label = false;

  const FetchSingleQuote = async (id) => {
    try {
      const { data } = await QuoteService.detail(id);
      dispatch(setQuotes(data));
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  useEffect(() => {
    FetchSingleQuote(id);
  }, [dispatch, id]);

  if (!quotes && !error) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography>Quote Details Error: {error}</Typography>;
  }

  const columns = [
    { field: "product", headerName: "Product", align: "left" },
    { field: "height", headerName: "Height", align: "right" },
    { field: "width", headerName: "Width", align: "right" },
    { field: "quantity", headerName: "Quantity", align: "right" },
    {
      field: "amount",
      headerName: "Amount",
      align: "right",
      renderCell: (params) => FormatMoney(params.value),
    },
  ];

  const { reference, client_name, date, amount, details } = quotes || {};

  const handleRowClick = (row) => {
    setSelectedRawProducts(row.raws_consumed || []);
    setDrawerOpen(true);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h6">Quote: {reference}</Typography>
          <Typography variant="h6">Client: {client_name}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6">Date: {date}</Typography>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
        <Paper sx={{ width: "80%", padding: 2 }}>
          <CustomTable
            columns={columns}
            data={details || []}
            customForm="no"
            label={label}
            pointerField="product"
            onRowClick={handleRowClick}
            superuser="yes"
            sortData="no"
          />
          <Grid
            container
            justifyContent="flex-end"
            sx={{ marginTop: 2 }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              Total Amount : {FormatMoney(amount)}
            </Typography>
          </Grid>
        </Paper>
      </Box>
      <RawProductsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        rawProducts={selectedRawProducts}
      />
    </Box>
  );
}

export default QuoteDetails;
