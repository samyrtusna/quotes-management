import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signup } from "../features/authSlices";
import { useNavigate } from "react-router-dom";
import CustomForm from "./communs/CustomForm";

const Signup = () => {
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (name, value) => {
    switch (name) {
      case "first_name":
        setFirst_name(value);
        break;
      case "last_name":
        setLast_name(value);
        break;
      case "email":
        setEmail(value);
        break;
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
  const handleSignup = (e) => {
    e.preventDefault();
    if (!first_name) {
      setErrorMessage("Please enter your first name");
    } else if (!last_name) {
      setErrorMessage("Please enter your last name");
    } else if (!email) {
      setErrorMessage("Please enter your email");
    } else if (!username) {
      setErrorMessage("Please enter your username");
    } else if (!password) {
      setErrorMessage("Please enter your password");
    } else {
      dispatch(signup({ first_name, last_name, email, username, password }));
      navigate("/login");
    }
  };

  const fields = [
    {
      name: "first_name",
      label: "First Name",
      value: first_name,
      type: "text",
    },
    { name: "last_name", label: "Last Name", value: last_name, type: "text" },
    { name: "email", label: "Email", value: email, type: "email" },
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
      title="Sign Up"
      fields={fields}
      handleChange={handleChange}
      handleSubmit={handleSignup}
      errorMessage={errorMessage}
    >
      Sign Up
    </CustomForm>
  );
};

export default Signup;