// CustomForm.js
import React, { useState } from "react";
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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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
    elementToDelete,
    darkMode,
    isEmpty,
  } = props;

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Box>
      <Stack>
        <Typography
          variant="h2"
          align="center"
          sx={{ marginTop: 7, marginBottom: 5 }}
        >
          {title}
        </Typography>
      </Stack>
      <Box sx={{ maxWidth: 400, margin: "0 auto", marginY: 3 }}>
        <Paper
          sx={{
            width: "100%",
            padding: 2,
            backgroundColor: "inherit",
          }}
          elevation={3}
        >
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
                        onChange={(e) =>
                          handleChange(field.name, e.target.value)
                        }
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
                      type="submit"
                      fullWidth
                      sx={{
                        bgcolor: darkMode ? "#5e6b6b" : "#26b7f0",
                        color: darkMode ? "#ffffff" : "#000000",
                        "&:hover": { bgcolor: darkMode && "#3a4242" },
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="contained"
                      onClick={() => setOpen(true)}
                      fullWidth
                      sx={{
                        bgcolor: "#e31e1e",
                        "&:hover": { bgcolor: "#b71c1c" },
                      }}
                    >
                      Delete
                    </Button>
                    <Dialog
                      open={open}
                      onClose={() => setOpen(false)}
                      aria-labelledby="dialog-title"
                    >
                      <DialogContent>
                        <DialogContentText id="dialog-description">
                          Are you sure you want to Delete this {elementToDelete}{" "}
                          ?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => {
                            navigate("/");
                            setOpen(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            handleDelete();
                            setOpen(false);
                          }}
                          autoFocus
                          sx={{
                            bgcolor: darkMode ? "#5e6b6b" : "#26b7f0",
                            color: darkMode ? "#ffffff" : "#000000",
                            "&:hover": { bgcolor: darkMode && "#3a4242" },
                          }}
                        >
                          Submit
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Stack>
                ) : (
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    sx={{
                      bgcolor: darkMode ? "#5e6b6b" : "#26b7f0",
                      color: darkMode ? "#ffffff" : "#000000",
                      "&:hover": { bgcolor: darkMode && "#3a4242" },
                    }}
                    disabled={isEmpty}
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
        </Paper>
      </Box>
    </Box>
  );
}

export default CustomForm;
