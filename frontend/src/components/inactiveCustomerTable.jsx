import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography
} from "@mui/material";

const dummyData = [
  { id: "C1537", lastOrder: "2020-03-10", inactiveDays: 571 },
  { id: "C0721", lastOrder: "2020-03-10", inactiveDays: 571 },
  { id: "C0422", lastOrder: "2020-03-10", inactiveDays: 571 },
];

const InactiveCustomerTable = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

 // useEffect(() => {
    
   // setRows(dummyData);
 // }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Typography variant="subtitle1" gutterBottom>
        Kunden ohne Bestellung seit mind. 30 Tagen
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Customer ID</b></TableCell>
              <TableCell><b>Letzte Order</b></TableCell>
              <TableCell><b>Inaktiv seit</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.lastOrder}</TableCell>
                  <TableCell>{row.inactiveDays} Tagen</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 7, 10]}
        />
      </TableContainer>
    </>
  );
};

export default InactiveCustomerTable;
