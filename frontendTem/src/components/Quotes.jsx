import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchQuotes } from "../features/quoteSlices";
import Title from "./communs/Title";
import CustomTable from "./communs/CostumTable";
import { Link } from "react-router-dom";
import FormatMoney from "../utils/MoneyFormat";

function Quotes() {
  const { loading, quotes, error } = useSelector((state) => state.Quotes);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FetchQuotes());
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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
  ];

  return (
    <>
      <Title
        title="Quotes"
        customForm="QuoteForm"
        addButton="yes"
      >
        Add Quote
      </Title>

      <CustomTable
        columns={columns}
        data={Array.isArray(quotes) ? quotes : []}
        customForm="QuoteDetails"
        pointerField="client_name"
        superuser="yes"
      />
    </>
  );
}

export default Quotes;
