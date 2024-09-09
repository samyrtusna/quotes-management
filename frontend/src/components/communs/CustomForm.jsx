// CustomForm.js
import React from "react";
import {
  TextField,
  Button,
  Stack,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

function CustomForm(props) {
  const {
    title,
    fields,
    handleChange,
    handleSubmit,
    handleDelete,
    isEditMode,
    inputRef,
    children,
    errorMessage,
  } = props;

  return (
    <>
      <div className="title">
        <Typography
          variant="h2"
          align="center"
          sx={{ marginTop: 5, marginBottom: 10 }}
        >
          {title}
        </Typography>
      </div>
      <Box sx={{ maxWidth: 400, margin: "0 auto", marginTop: 5 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {fields.map((field) => {
              if (field.type === "select") {
                return (
                  <FormControl
                    fullWidth
                    key={field.name}
                  >
                    <InputLabel id={`${field.name}-label`}>
                      {field.label}
                    </InputLabel>
                    <Select
                      labelId={`${field.name}-label`}
                      id={field.name}
                      value={field.value}
                      label={field.label}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                    >
                      {field.options.map((option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              }
              return (
                <TextField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  value={field.value}
                  type={field.type}
                  inputRef={
                    field.name === "code" && !isEditMode
                      ? inputRef
                      : field.name === "label" && isEditMode
                      ? inputRef
                      : null
                  }
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  fullWidth
                />
              );
            })}
            <Stack>
              {isEditMode ? (
                <Stack
                  direction="row"
                  spacing={2}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                  >
                    Edit
                  </Button>

                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleDelete}
                    fullWidth
                  >
                    Delete
                  </Button>
                </Stack>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  {children}
                </Button>
              )}
              <Typography
                color="error"
                variant="body2"
                style={{ marginTop: "8px" }}
              >
                {errorMessage}
              </Typography>
            </Stack>
          </Stack>
        </form>
      </Box>
    </>
  );
}

export default CustomForm;
