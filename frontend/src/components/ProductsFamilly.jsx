import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProductsFamilly } from "../features/famillySlices";
import FamillyService from "../service/FamillyService";
import Title from "./communs/Title";
import CustomTable from "./communs/CostumTable";

function ProductsFamilly(props) {
  const { darkMode } = props;
  const { ProductsFamilly } = useSelector((state) => state.ProductsFamilly);
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductsFamilly = async () => {
      try {
        const { data } = await FamillyService.getAll();
        dispatch(setProductsFamilly(data));
      } catch (error) {
        setError(error.message);
      }
    };
    fetchProductsFamilly();
  }, []);

  if (!ProductsFamilly && !error) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }
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
        darkMode={darkMode}
      >
        Add Product
      </Title>

      <CustomTable
        columns={columns}
        data={ProductsFamilly}
        customForm="productsFamillyForm"
        pointerField="label"
        darkMode={darkMode}
      />
    </>
  );
}

export default ProductsFamilly;
