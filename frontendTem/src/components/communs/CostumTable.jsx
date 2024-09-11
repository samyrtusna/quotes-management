import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";

function CustomTable(props) {
  const navigate = useNavigate();
  const { columns, data = [], customForm, pointerField, onRowClick } = props;
  const theme = useTheme();

  const handleInputFieldClick = (id) => {
    navigate(`/${customForm}/${id}`);
  };

  const handleRowClick = (row) => {
    if (onRowClick) {
      onRowClick(row);
    } else {
      handleInputFieldClick(row.id);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 650 }}
        aria-label="custom table"
      >
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
            {columns.map((column) => (
              <TableCell
                key={column.field}
                align={column.align}
                sx={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: theme.palette.text.primary,
                }}
              >
                {column.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={() => handleRowClick(row)}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    align={column.align}
                    sx={
                      column.field === pointerField ? { cursor: "pointer" } : {}
                    }
                  >
                    {column.renderCell
                      ? column.renderCell({ row, value: row[column.field] })
                      : row[column.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CustomTable;
