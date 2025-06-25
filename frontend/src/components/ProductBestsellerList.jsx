import React from "react";
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from "@mui/material";

const ProductBestsellerList = ({ data, total, page, rowsPerPage, onPageChange, onRowsPerPageChange, dateRange, storeLabel }) => (
  <Card sx={{ marginBottom: 2 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Bestseller {dateRange ? `| ${dateRange}` : ''} {storeLabel ? `| ${storeLabel}` : ''}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Preis</TableCell>
            <TableCell>Größe</TableCell>
            <TableCell>Bestellungen</TableCell>
            <TableCell>Umsatz</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.price}€</TableCell>
                <TableCell>{row.size}</TableCell>
                <TableCell>{row.orders}</TableCell>
                <TableCell>{row.revenue}€</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>Keine Daten</TableCell>
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

export default ProductBestsellerList; 