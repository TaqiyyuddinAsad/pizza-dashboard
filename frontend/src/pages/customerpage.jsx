
import { Box, Typography } from "@mui/material";
import InactiveCustomer from "../components/inactiveCustomerTable"



const CustomerPage = () => {
  return (
    <div>
    <Box p={3}>
      <Typography variant="h4" gutterBottom color="black">
        Kundenanalyse
      </Typography>
    </Box>
    <div><InactiveCustomer></InactiveCustomer></div>
    </div>
  );
};



export default CustomerPage;
