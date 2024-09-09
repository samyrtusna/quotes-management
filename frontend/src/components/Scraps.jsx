import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchScraps } from "../features/scrapSlices";
import Title from "./communs/Title";
import CustomTable from "./communs/CostumTable";

function Scraps() {
  const {
    loading = false,
    Scraps = [],
    error = "",
  } = useSelector((state) => state.Scraps);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchScraps());
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const sortedScraps = [...Scraps].sort((a, b) => {
    const codeA = String(a.code);
    const codeB = String(b.code);
    return codeA.localeCompare(codeB);
  });

  const columns = [
    { field: "code", headerName: "Code", align: "left" },
    { field: "label", headerName: "Label", align: "left" },
    { field: "length", headerName: "Length", align: "right" },
    { field: "mesure", headerName: "Mesure", align: "right" },
  ];

  return (
    <>
      <Title title="Scraps" />
      <CustomTable
        columns={columns}
        data={sortedScraps}
        pointerField="label"
      />
    </>
  );
}

export default Scraps;
