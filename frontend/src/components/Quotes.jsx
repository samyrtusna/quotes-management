import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QuoteService from "../service/QuoteService";
import { setQuotes } from "../features/quoteSlices";
import Title from "./communs/Title";
import CustomTable from "./communs/CostumTable";
import { Link } from "react-router-dom";
import FormatMoney from "../utils/MoneyFormat";
import { Typography } from "@mui/material";

function Quotes(props) {
  const { darkMode } = props;
  const { quotes } = useSelector((state) => state.Quotes);
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const fetchQuotes = async () => {
    try {
      const { data } = await QuoteService.getAll();
      dispatch(setQuotes(data));
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  if (!quotes && !error) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) return <p>Error: {error}</p>;

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "primary.main";
      case "approved":
        return "success.main";
      case "rejected":
        return "error.main";
      default:
        return "text.primary";
    }
  };

  const columns = [
    { field: "reference", headerName: "Reference", align: "left" },
    {
      field: "client_name",
      headerName: "Client Name",
      align: "left",
      renderCell: (params) => (
        <Link
          to={`/quote-details/${params.row.reference}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {params.value}
        </Link>
      ),
    },
    { field: "date", headerName: "Date", align: "right" },
    {
      field: "amount",
      headerName: "Amount",
      align: "right",
      renderCell: (params) => FormatMoney(params.value),
    },
    {
      field: "status",
      headerName: "Status",
      align: "right",
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            color: getStatusColor(params.value),
          }}
        >
          {params.value}
        </Typography>
      ),
    },
  ];

  return (
    <>
      <Title
        title="Quotes"
        customForm="QuoteForm"
        addButton="yes"
        darkMode={darkMode}
      >
        Add Quote
      </Title>

      <CustomTable
        columns={columns}
        data={Array.isArray(quotes) ? quotes : []}
        customForm="QuoteDetails"
        pointerField="client_name"
        darkMode={darkMode}
      />
    </>
  );
}

export default Quotes;
