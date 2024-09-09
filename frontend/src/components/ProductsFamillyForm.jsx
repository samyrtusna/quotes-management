import React, { useEffect, useRef, useState } from "react";
import FamillyService from "../service/FamillyService";
import { useNavigate, useParams } from "react-router-dom";
import CustomForm from "./communs/CustomForm";

function ProductsFamillyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const inputRef = useRef();
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");

  const handleChange = (name, value) => {
    switch (name) {
      case "code":
        setCode(value);
        break;
      case "label":
        setLabel(value);
        break;
      default:
        break;
    }
  };

  const getProductsFamilly = async (id) => {
    try {
      const { data } = await FamillyService.detail(id);
      setCode(data.code);
      setLabel(data.label);
      console.log("Label data : ", data.label);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (id !== "new") {
      getProductsFamilly(id);
    }
    inputRef.current.focus();
  }, [id]);

  const addProductsFamilly = async () => {
    const newProduct = { code, label };
    try {
      await FamillyService.create(newProduct);
      navigate("/productsFamilly/");
    } catch (error) {
      console.error("Create Error:", error.message);
    }
  };

  const updateProductsFamilly = async (id) => {
    const updatedProduct = { code, label };
    try {
      await FamillyService.update(id, updatedProduct);
      navigate("/productsFamilly/");
    } catch (error) {
      console.log("Update Error:", error.message);
    }
  };

  const handleProductFamillyForm = async (event) => {
    event.preventDefault();
    if (id === "new") {
      addProductsFamilly();
    } else {
      updateProductsFamilly(id);
    }
  };

  const handleDelete = async () => {
    try {
      await FamillyService.delete(id);
      navigate("/productsFamilly/");
    } catch (error) {
      console.log("Delete Error:", error.message);
    }
  };

  const fields = [
    { name: "code", label: "Code", value: code, type: "text" },
    { name: "label", label: "Label", value: label, type: "text" },
  ];

  return (
    <CustomForm
      title={
        id === "new" ? "Add a New Products Familly" : "Edit Products Familly"
      }
      fields={fields}
      handleChange={handleChange}
      handleSubmit={handleProductFamillyForm}
      handleDelete={handleDelete}
      isEditMode={id !== "new"}
      inputRef={inputRef}
    >
      Add
    </CustomForm>
  );
}

export default ProductsFamillyForm;
