import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import RawProduct from "./components/RawProduct";
import RawProductForm from "./components/RawProductForm";
import ProductForm from "./components/ProductsForm";
import Products from "./components/Products";
import ProductsFamilly from "./components/ProductsFamilly";
import ProductsFamillyForm from "./components/ProductsFamillyForm";
import Quotes from "./components/Quotes";
import QuoteDetails from "./components/QuoteDetails";
import QuoteForm from "./components/QuoteForm";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { useMemo, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Scraps from "./components/Scraps";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
          <Routes>
            <Route
              path="/"
              element={<HomePage />}
            />
            <Route
              path="/productsFamilly"
              element={
                <ProtectedRoutes>
                  <ProductsFamilly />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/productsFamillyform/:id"
              element={
                <ProtectedRoutes>
                  <ProductsFamillyForm />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/rawProducts"
              element={
                <ProtectedRoutes>
                  <RawProduct />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/RawProductForm/:id"
              element={
                <ProtectedRoutes>
                  <RawProductForm />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoutes>
                  <Products />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/productsform/:id"
              element={
                <ProtectedRoutes>
                  <ProductForm />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/quotes"
              element={
                <ProtectedRoutes>
                  <Quotes />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/quoteDetails/:id"
              element={
                <ProtectedRoutes>
                  <QuoteDetails />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/quoteForm/:id"
              element={
                <ProtectedRoutes>
                  <QuoteForm />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/signup"
              element={<Signup />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/scraps"
              element={
                <ProtectedRoutes>
                  <Scraps />
                </ProtectedRoutes>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
