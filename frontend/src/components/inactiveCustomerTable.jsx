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
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";

const InactiveCustomerTable = ({ filters }) => {
  const referenceDate = '2022-12-31';
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('oldest'); // 'oldest' | 'newest'

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    fetch(`http://localhost:8080/api/analytics/inactive-customers?reference=${referenceDate}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
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

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    setPage(0);
  };

  if (loading) {
    return <Typography className="dark:text-gray-300" variant="body2">Lade inaktive Kunden...</Typography>;
  }

  if (!rows.length) {
    return <Typography className="dark:text-gray-300" variant="body2">Keine inaktiven Kunden gefunden.</Typography>;
  }

  // Sortiere rows nach lastOrder (Datum)
  const sortedRows = [...rows].sort((a, b) => {
    const dateA = a.lastOrder ? new Date(a.lastOrder) : new Date(0);
    const dateB = b.lastOrder ? new Date(b.lastOrder) : new Date(0);
    if (sortOrder === 'newest') {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <Typography variant="h6" gutterBottom className="dark:text-gray-100" style={{ textAlign: 'left', fontWeight: 600 }}>
            Inaktive Kunden
          </Typography>
          <Typography variant="body2" className="dark:text-gray-300" color="textSecondary" style={{ marginBottom: 0, textAlign: 'left' }}>
            Kunden ohne Bestellung seit mind. 30 Tagen
          </Typography>
        </div>
        <FormControl size="small" style={{ minWidth: 140 }}>
          <InputLabel id="sort-label" className="dark:text-gray-300">Sortierung</InputLabel>
          <Select
            labelId="sort-label"
            value={sortOrder}
            label="Sortierung"
            onChange={handleSortChange}
            className="dark:bg-gray-700 dark:text-gray-100"
          >
            <MenuItem value="oldest" className="dark:text-gray-300">Älteste zuerst</MenuItem>
            <MenuItem value="newest" className="dark:text-gray-300">Neueste zuerst</MenuItem>
          </Select>
        </FormControl>
      </div>
      <TableContainer component={Paper} className="dark:bg-gray-800">
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell className="dark:text-gray-100" style={{ fontSize: 16, fontWeight: 600 }}>Customer ID</TableCell>
              <TableCell className="dark:text-gray-100" style={{ fontSize: 16, fontWeight: 600 }}>Letzte Order</TableCell>
              <TableCell className="dark:text-gray-100" style={{ fontSize: 16, fontWeight: 600 }}>Inaktiv seit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => (
                <TableRow key={idx} style={{ height: 56 }}>
                  <TableCell className="dark:text-gray-300" style={{ fontSize: 15 }}>{row.customerID}</TableCell>
                  <TableCell className="dark:text-gray-300" style={{ fontSize: 15 }}>{row.lastOrder ? new Date(row.lastOrder).toLocaleDateString() : "-"}</TableCell>
                  <TableCell className="dark:text-gray-300" style={{ fontSize: 15 }}>{row.inactiveDays} Tagen</TableCell>
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
          rowsPerPageOptions={[3, 5]}
        />
      </TableContainer>
    </>
  );
};

export default InactiveCustomerTable;
