import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import InactiveCustomer from "../components/inactiveCustomerTable";
import TotalCustomersCard from "../components/totalCustomer";
import AverageRevenueCard from "../components/averageRevenue";
import RevenuePieChart from "../components/revenuePieChart";


const CustomerPage = () => {
  const [activeCard, setActiveCard] = useState("totalCustomers");

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom color="black">
        Kundenanalyse
      </Typography>

      {/* Kartendarstellung + Umschaltpunkte */}
      <Box
        mt={2}
        className="bg-white rounded-xl shadow-md p-6 w-full max-w-4xl mx-auto"
      >
        {/* Aktive Karte */}
        {activeCard === "totalCustomers" ? (
          <TotalCustomersCard />
        ) : (
          <AverageRevenueCard />
        )}

        {/* Umschaltpunkte zentriert */}
        <Box
          mt={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2}
          style={{ minHeight: "24px" }}
        >
          <Box mt={4}>
  <RevenuePieChart />
</Box>

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

      {/* Weitere Komponenten */}
      <Box mt={4}>
        <InactiveCustomer />
      </Box>
    </Box>
  );
};

export default CustomerPage;
