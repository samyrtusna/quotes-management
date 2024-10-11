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
  const [drawerOpen, setDrawerOpen] = useState(false);
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
            drawerOpen={drawerOpen}
          />
          <Routes>
            <Route
              path="/"
              element={<HomePage darkMode={darkMode} />}
            />
            <Route
              path="/productsFamilly"
              element={
                <ProtectedRoutes>
                  <ProductsFamilly darkMode={darkMode} />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/productsFamillyform/:id"
              element={
                <ProtectedRoutes>
                  <ProductsFamillyForm darkMode={darkMode} />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/rawProducts"
              element={
                <ProtectedRoutes>
                  <RawProduct darkMode={darkMode} />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/RawProductForm/:id"
              element={
                <ProtectedRoutes>
                  <RawProductForm darkMode={darkMode} />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoutes>
                  <Products darkMode={darkMode} />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/productsform/:id"
              element={
                <ProtectedRoutes>
                  <ProductForm darkMode={darkMode} />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/quotes"
              element={
                <ProtectedRoutes>
                  <Quotes darkMode={darkMode} />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/quoteDetails/:id"
              element={
                <ProtectedRoutes>
                  <QuoteDetails
                    drawerOpen={drawerOpen}
                    setDrawerOpen={setDrawerOpen}
                    darkMode={darkMode}
                  />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/quoteForm/:id"
              element={
                <ProtectedRoutes>
                  <QuoteForm darkMode={darkMode} />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/signup"
              element={<Signup darkMode={darkMode} />}
            />
            <Route
              path="/login"
              element={<Login darkMode={darkMode} />}
            />
            <Route
              path="/scraps"
              element={
                <ProtectedRoutes>
                  <Scraps darkMode={darkMode} />
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
