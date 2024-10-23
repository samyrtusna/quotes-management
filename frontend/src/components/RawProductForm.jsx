import React, { useEffect, useRef, useState } from "react";
import RawService from "../service/RawService";
import { useNavigate, useParams } from "react-router-dom";
import CustomForm from "./communs/CustomForm";
import { Box } from "@mui/material";

function RawProductForm(props) {
  const { darkMode } = props;
  const navigate = useNavigate();
  const { id } = useParams();
  const inputRef = useRef();
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState("");
  const [length, setLength] = useState("");
  const [mesure, setMesure] = useState("");
  const [isEmpty, setIsEmpty] = useState(true);

  const handleChange = (name, value) => {
    switch (name) {
      case "code":
        if (!isNaN(value)) {
          setCode(value);
        }
        break;
      case "label":
        setLabel(value);
        break;
      case "price":
        if (!isNaN(value)) {
          setPrice(value);
        }
        break;
      case "length":
        if (!isNaN(value)) {
          setLength(value);
        }
        break;
      case "mesure":
        setMesure(value);
        break;
      default:
        break;
    }
  };

  const getRawProduct = async (id) => {
    try {
      const { data } = await RawService.detail(id);
      setCode(data.code);
      setLabel(data.label);
      setPrice(data.price);
      setLength(data.length);
      setMesure(data.mesure);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (id !== "new") {
      getRawProduct(id);
    }
    inputRef.current.focus();
  }, [id]);

  useEffect(() => {
    if (code && label && price && length && mesure) {
      setIsEmpty(false);
    } else {
      setIsEmpty(true);
    }
  }, [code, label, price, length, mesure]);

  const addRawProduct = async () => {
    const newRawProduct = { code, label, price, length, mesure };
    try {
      await RawService.create(newRawProduct);
      navigate("/rawProducts");
    } catch (error) {
      console.error("Create Error:", error.message);
    }
  };

  const updateRawProduct = async (id) => {
    const updatedRawProduct = { code, label, price, length, mesure };
    try {
      await RawService.update(id, updatedRawProduct);
      navigate("/rawProducts");
    } catch (error) {
      console.log("Update Error:", error.message);
    }
  };

  const handleRawProductForm = async (event) => {
    event.preventDefault();
    if (id === "new") {
      addRawProduct();
    } else {
      updateRawProduct(id);
    }
  };

  const handleDelete = async () => {
    try {
      await RawService.delete(id);
      navigate("/rawProducts");
    } catch (error) {
      console.log("Delete Error:", error.message);
    }
  };

  const fields = [
    { name: "code", label: "Code", value: code, type: "text" },
    { name: "label", label: "Label", value: label, type: "text" },
    { name: "price", label: "Price", value: price, type: "text" },
    {
      name: "length",
      label: "Length",
      value: length,
      type: "text",
    },
    {
      name: "mesure",
      label: "Mesure",
      value: mesure,
      type: "select",
      options: [
        { value: "m", label: "m" },
        { value: "m²", label: "m²" },
        { value: "unit", label: "unit" },
      ],
    },
  ];

  return (
    <Box>
      <CustomForm
        title={id === "new" ? "Add a New Raw Product" : "Edit Raw Product"}
        fields={fields}
        handleChange={handleChange}
        handleSubmit={handleRawProductForm}
        handleDelete={handleDelete}
        isEditMode={id !== "new"}
        inputRef={inputRef}
        addButton="yes"
        elementToDelete="Raw Product"
        darkMode={darkMode}
        isEmpty={isEmpty}
      >
        {" "}
        Add{" "}
      </CustomForm>
      <br />
      <br />
    </Box>
  );
}

export default RawProductForm;
