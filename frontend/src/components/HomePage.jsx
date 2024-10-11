// src/pages/LandingPage.js
import * as React from "react";
import { Container, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

function HomePage(props) {
  const { darkMode } = props;
  return (
    <Container
      maxWidth="md"
      sx={{ textAlign: "center", marginTop: 5 }}
    >
      <Typography
        variant="h2"
        gutterBottom
      >
        Welcome to Our Product Management App
      </Typography>
      <Typography
        variant="h5"
        gutterBottom
      >
        Manage your products efficiently and effectively with our application.
      </Typography>
      <Stack
        spacing={2}
        direction="row"
        justifyContent="center"
        sx={{ marginTop: 3 }}
      >
        <Button
          variant="contained"
          component={Link}
          to="/RawProducts"
          sx={{
            bgcolor: darkMode ? "#5e6b6b" : "#26b7f0",
            color: darkMode ? "#ffffff" : "#000000",
            "&:hover": { bgcolor: darkMode && "#3a4242" },
          }}
        >
          View Raw Products
        </Button>
        <Button
          variant="contained"
          component={Link}
          to="/Products"
          sx={{
            bgcolor: darkMode ? "#5e6b6b" : "#26b7f0",
            color: darkMode ? "#ffffff" : "#000000",
            "&:hover": { bgcolor: darkMode && "#3a4242" },
          }}
        >
          View Products
        </Button>
        <Button
          variant="contained"
          component={Link}
          to="/Productsfamilly"
          sx={{
            bgcolor: darkMode ? "#5e6b6b" : "#26b7f0",
            color: darkMode ? "#ffffff" : "#000000",
            "&:hover": { bgcolor: darkMode && "#3a4242" },
          }}
        >
          View Product Families
        </Button>
      </Stack>
    </Container>
  );
}

export default HomePage;
