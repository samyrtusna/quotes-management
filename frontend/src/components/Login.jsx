import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../service/authService";
import CustomForm from "./communs/CustomForm";
import { setLogin } from "../features/authSlices";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
      setError(error.message);
    }
  };

  if (!user && !error) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }

  const fields = [
    { name: "username", label: "Username", value: username, type: "text" },
    {
      name: "password",
      label: "Password",
      value: password,
      type: "password",
    },
  ];

  return (
    <CustomForm
      title="Log in"
      fields={fields}
      handleChange={handleChange}
      handleSubmit={handleLogin}
      errorMessage={error}
    >
      Log in
    </CustomForm>
  );
};

export default Login;
