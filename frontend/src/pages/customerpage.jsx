
import { Box, Typography } from "@mui/material";
import InactiveCustomer from "../components/inactiveCustomerTable"
import TotalCustomersCard from "../components/totalCustomer";



const CustomerPage = () => {
 return (
  <Box p={3}>
    <Typography variant="h4" gutterBottom color="black">
      Kundenanalyse
    </Typography>

    <Box display="flex" flexDirection="column" gap={3} mt={2}>
      <TotalCustomersCard />
      <InactiveCustomer />
    </Box>
  </Box>
);

};



export default CustomerPage;
