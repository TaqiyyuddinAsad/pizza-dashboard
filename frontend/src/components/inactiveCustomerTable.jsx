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
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('oldest'); // 'oldest' | 'newest'

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/api/analytics/inactive-customers?reference=2022-12-31")
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
    return <Typography variant="body2">Lade inaktive Kunden...</Typography>;
  }

  if (!rows.length) {
    return <Typography variant="body2">Keine inaktiven Kunden gefunden.</Typography>;
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
          <Typography variant="h6" gutterBottom style={{ textAlign: 'left', fontWeight: 600 }}>
            Inaktive Kunden
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{ marginBottom: 0, textAlign: 'left' }}>
            Kunden ohne Bestellung seit mind. 30 Tagen
          </Typography>
        </div>
        <FormControl size="small" style={{ minWidth: 140 }}>
          <InputLabel id="sort-label">Sortierung</InputLabel>
          <Select
            labelId="sort-label"
            value={sortOrder}
            label="Sortierung"
            onChange={handleSortChange}
          >
            <MenuItem value="oldest">Älteste zuerst</MenuItem>
            <MenuItem value="newest">Neueste zuerst</MenuItem>
          </Select>
        </FormControl>
      </div>
      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell style={{ fontSize: 16, fontWeight: 600 }}>Customer ID</TableCell>
              <TableCell style={{ fontSize: 16, fontWeight: 600 }}>Letzte Order</TableCell>
              <TableCell style={{ fontSize: 16, fontWeight: 600 }}>Inaktiv seit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => (
                <TableRow key={idx} style={{ height: 56 }}>
                  <TableCell style={{ fontSize: 15 }}>{row.customerID}</TableCell>
                  <TableCell style={{ fontSize: 15 }}>{row.lastOrder ? new Date(row.lastOrder).toLocaleDateString() : "-"}</TableCell>
                  <TableCell style={{ fontSize: 15 }}>{row.inactiveDays} Tagen</TableCell>
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
