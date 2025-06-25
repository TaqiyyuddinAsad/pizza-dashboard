import React from "react";
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from "@mui/material";

const ProductCombinationsList = ({ data, total, page, rowsPerPage, onPageChange, onRowsPerPageChange, dateRange, storeLabel }) => (
  <Card sx={{ marginBottom: 2 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Beliebteste Kombinationen {dateRange ? `| ${dateRange}` : ''} {storeLabel ? `| ${storeLabel}` : ''}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Kombination</TableCell>
            <TableCell>Anzahl Bestellungen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.combination}</TableCell>
                <TableCell>{row.count}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2}>Keine Daten</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={total || 0}
        page={page}
        onPageChange={(e, newPage) => onPageChange(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={e => onRowsPerPageChange(Number(e.target.value))}
        rowsPerPageOptions={[5]}
      />
    </CardContent>
  </Card>
);

export default ProductCombinationsList; 