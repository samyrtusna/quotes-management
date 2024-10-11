import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import scrapsService from "../service/ScrapsService";
import { setScraps } from "../features/scrapSlices";
import Title from "./communs/Title";
import CustomTable from "./communs/CostumTable";

function Scraps(props) {
  const { darkMode } = props;
  const { Scraps } = useSelector((state) => state.Scraps);
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const fetchScraps = async () => {
    try {
      const { data } = await scrapsService.getAll();
      dispatch(setScraps(data));
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchScraps();
  }, []);

  if (!Scraps && !error) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }
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
        darkMode={darkMode}
      />
    </>
  );
}

export default Scraps;
