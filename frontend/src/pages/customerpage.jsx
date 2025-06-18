import React, { useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import InactiveCustomer from "../components/inactiveCustomerTable";
import TotalCustomersCard from "../components/totalCustomer";
import AverageRevenueCard from "../components/averageRevenue";
import RevenuePieChart from "../components/revenuePieChart";

const CustomerPage = () => {
  const [activeCard, setActiveCard] = useState("totalCustomers");

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom color="black">
        Kundenanalyse
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box className="bg-white rounded-xl shadow-md p-6 h-full">
            {activeCard === "totalCustomers" ? (
              <TotalCustomersCard />
            ) : (
              <AverageRevenueCard />
            )}

            <Box
              mt={3}
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={2}
            >
              <div
                onClick={() => setActiveCard("totalCustomers")}
                className={`w-3 h-3 rounded-full cursor-pointer transition ${
                  activeCard === "totalCustomers" ? "bg-black" : "bg-gray-300"
                }`}
              />
              <div
                onClick={() => setActiveCard("avgRevenue")}
                className={`w-3 h-3 rounded-full cursor-pointer transition ${
                  activeCard === "avgRevenue" ? "bg-black" : "bg-gray-300"
                }`}
              />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box className="bg-white rounded-xl shadow-md p-6 h-full">
            <RevenuePieChart />
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box className="bg-white rounded-xl shadow-md p-6 h-full">
            <InactiveCustomer />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerPage;
