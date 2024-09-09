import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function Title(props) {
  const { title, customForm, addButton, children } = props;
  const navigate = useNavigate();

  const handleAddButton = (id = "new") => {
    navigate(`/${customForm}/${id}`);
  };

  return (
    <>
      <Stack
        sx={{ marginTop: 5, marginBottom: 10 }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          variant="h2"
          sx={{ marginLeft: 10 }}
        >
          {title}
        </Typography>
        {addButton === "yes" && (
          <Button
            variant="contained"
            onClick={() => handleAddButton()}
          >
            {children}
          </Button>
        )}
      </Stack>
    </>
  );
}

export default Title;
