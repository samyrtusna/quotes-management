import React from "react";
import { Drawer, Box, Typography, List, ListItem, Grid } from "@mui/material";
import FormatMoney from "../utils/MoneyFormat";

const RawProductsDrawer = (props) => {
  const { open, onClose, rawProducts } = props;
  return (
    <Drawer
      open={open}
      onClose={onClose}
    >
      <Box sx={{ width: 400, padding: 2 }}>
        <Typography
          variant="h6"
          gutterBottom
        >
          Raw Products Consumed
        </Typography>
        <List>
          {rawProducts.map((raw) => (
            <ListItem
              key={raw.id}
              divider
            >
              <Grid
                container
                spacing={2}
              >
                <Grid
                  item
                  xs={12}
                >
                  <Typography variant="body1">Label: {raw.label}</Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <Typography variant="body2">
                    Quantity by Product: {raw.quantity_by_product}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <Typography variant="body2">
                    Cost: {FormatMoney(raw.cost)}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <Typography variant="body2">
                    Number of Products: {raw.number_of_products}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <Typography variant="body2">
                    Total Quantity: {raw.total_quantity}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                >
                  <Typography variant="body2">
                    Total Cost: {FormatMoney(raw.total_cost)}
                  </Typography>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default RawProductsDrawer;
