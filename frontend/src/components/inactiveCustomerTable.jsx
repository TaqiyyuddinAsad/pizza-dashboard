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

const InactiveCustomerTable = ({ filters }) => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/api/analytics/inactive-customers")
      .then(res => res.json())
      .then(data => {
        setRows(data || []);
        setLoading(false);
      })
      .catch(() => {
        setRows([]);
        setLoading(false);
      });
  }, [filters]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (loading) {
    return <Typography variant="body2">Lade inaktive Kunden...</Typography>;
  }

  if (!rows.length) {
    return <Typography variant="body2">Keine inaktiven Kunden gefunden.</Typography>;
  }

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
                  <TableCell>{row.customerID}</TableCell>
                  <TableCell>{row.lastOrder ? new Date(row.lastOrder).toLocaleDateString() : "-"}</TableCell>
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
