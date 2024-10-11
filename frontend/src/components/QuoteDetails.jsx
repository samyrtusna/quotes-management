import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import CustomTable from "./communs/CostumTable";
import QuoteService from "../service/QuoteService";
import { setQuotes } from "../features/quoteSlices";
import RawProductsDrawer from "./RawProductsDrawer";
import FormatMoney from "../utils/MoneyFormat";

function QuoteDetails(props) {
  const { drawerOpen, setDrawerOpen, darkMode } = props;
  const { quotes } = useSelector((state) => state.Quotes);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [selectedRawProducts, setSelectedRawProducts] = useState([]);
  const [error, setError] = useState("");
  const [alignment, setAlignment] = useState("pending");
  const tableRef = useRef(null);

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

  const handleClickOutside = (event) => {
    if (tableRef.current && !tableRef.current.contains(event.target)) {
      setDrawerOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  const handleToggleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const getButtonColor = (status) => {
    switch (status) {
      case "rejected":
        return "error";
      case "approved":
        return "success";
      default:
        return "primary";
    }
  };

  const handleStatusChange = async (id, value) => {
    const newStatus = { status: value };
    try {
      const response = await QuoteService.patch(id, newStatus);
      console.log(response);
    } catch (error) {
      console.log("new status error : ", error);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          width: drawerOpen ? `calc(100% - 300px)` : "100%",
          marginLeft: drawerOpen ? "300px" : 0,
          transition: "width 0.3s, margin 0.3s",
        }}
      >
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
        <Box
          ref={tableRef}
          sx={{ display: "flex", justifyContent: "center", marginTop: 8 }}
        >
          <Paper
            sx={{ width: "80%", padding: 2, bgcolor: !darkMode && "inherit" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                mr: 2,
              }}
            >
              <Typography
                variant="h6"
                mr={1}
              >
                Status{" "}
              </Typography>
              <ToggleButtonGroup
                color={getButtonColor(alignment)}
                value={alignment}
                exclusive
                onChange={handleToggleChange}
                aria-label="Status"
                sx={{ height: "30px", border: "none", boxShadow: "none" }}
              >
                <ToggleButton
                  value="rejected"
                  onClick={() => handleStatusChange(id, "rejected")}
                  sx={{
                    borderRadius: 2,
                    borderColor: "error.main",
                    border: "none",
                    variant: alignment === "rejected" ? "contained" : "text",
                    "&.Mui-selected": {
                      backgroundColor: "error.main",
                      color: "white",
                      borderRadius: 5,
                    },
                  }}
                >
                  Rejected
                </ToggleButton>
                <ToggleButton
                  value="pending"
                  onClick={() => handleStatusChange(id, "pending")}
                  sx={{
                    borderRadius: 2,
                    borderColor: "primary.main",
                    border: "none",
                    variant: alignment === "pending" ? "contained" : "text",
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "white",
                      borderRadius: 5,
                    },
                  }}
                >
                  Pending
                </ToggleButton>
                <ToggleButton
                  value="approved"
                  onClick={() => handleStatusChange(id, "approved")}
                  sx={{
                    borderRadius: 2,
                    borderColor: "success.main",
                    border: "none",
                    variant: alignment === "approved" ? "contained" : "text",
                    "&.Mui-selected": {
                      backgroundColor: "success.main",
                      color: "white",
                      borderRadius: 5,
                    },
                  }}
                >
                  Approuved
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <CustomTable
              columns={columns}
              data={details || []}
              customForm="no"
              label={label}
              pointerField="product"
              onRowClick={handleRowClick}
              superuser="yes"
              sortData="no"
              darkMode={darkMode}
            />
            <Grid
              container
              justifyContent="flex-end"
              sx={{ marginTop: 2 }}
            >
              <Typography sx={{ fontWeight: "bold", mr: 2 }}>
                Total Amount : {FormatMoney(amount)}
              </Typography>
            </Grid>
          </Paper>
        </Box>
      </Box>
      <RawProductsDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        rawProducts={selectedRawProducts}
        darkMode={darkMode}
      />
    </Box>
  );
}

export default QuoteDetails;
