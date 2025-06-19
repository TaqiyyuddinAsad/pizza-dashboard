import React from "react";
import { Box, Typography } from "@mui/material";
import ProductBestsellerList from "../components/productsBestseller.jsx";

const ProductPage = () => {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Waren – Analyse
      </Typography>

<Box className="bg-white rounded-xl shadow-md p-6">
  <ProductBestsellerList />
</Box>
    </Box>
  );
};

export default ProductPage;
