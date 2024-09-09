import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/authSlices";
import { useNavigate } from "react-router-dom";
import CustomForm from "./communs/CustomForm";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.Auth);

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

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ username, password })).then((response) => {
      if (!response.error) {
        navigate("/");
      } else {
        setErrorMessage(
          "Failed to log in , either username or password is incorrect!"
        );
      }
    });
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

  return (
    <CustomForm
      title="Log in"
      fields={fields}
      handleChange={handleChange}
      handleSubmit={handleLogin}
      errorMessage={errorMessage}
    >
      Log in
    </CustomForm>
  );
};

export default Login;
