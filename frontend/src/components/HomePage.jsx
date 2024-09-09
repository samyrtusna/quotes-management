// src/pages/LandingPage.js
import * as React from "react";
import { Container, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

function HomePage() {
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
          color="primary"
          component={Link}
          to="/RawProducts"
        >
          View Raw Products
        </Button>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/Products"
        >
          View Products
        </Button>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/Productsfamilly"
        >
          View Product Families
        </Button>
      </Stack>
    </Container>
  );
}

export default HomePage;
