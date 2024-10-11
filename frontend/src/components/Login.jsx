import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../service/authService";
import CustomForm from "./communs/CustomForm";
import { setLogin } from "../features/authSlices";
import { Box, CircularProgress } from "@mui/material";

const Login = (props) => {
  const { darkMode } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isEmpty, setIsEmpty] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.Auth);

  const handleChange = (name, value) => {
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login({ username, password });
      dispatch(setLogin(response.data));
      navigate("/");
    } catch (error) {
      console.log(error.message);
      setErrorMessage("Invalid Credentials");
    }
  };

  const fields = [
    { name: "username", label: "Username", value: username, type: "text" },
    {
      name: "password",
      label: "Password",
      value: password,
      type: "password",
    },
  ];

  useEffect(() => {
    if (username && password) {
      setIsEmpty(false);
    } else {
      setIsEmpty(true);
    }
  }, [username, password]);

  return (
    <CustomForm
      title="Log in"
      fields={fields}
      handleChange={handleChange}
      handleSubmit={handleLogin}
      errorMessage={errorMessage}
      darkMode={darkMode}
      isEmpty={isEmpty}
    >
      Sign In
    </CustomForm>
  );
};

export default Login;
