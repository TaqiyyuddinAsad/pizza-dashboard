import React from "react";
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from "@mui/material";

const ProductBestsellerList = ({ data, total, page, rowsPerPage, onPageChange, onRowsPerPageChange, dateRange, storeLabel }) => (
  <Card className="dark:bg-gray-800 dark:border-gray-700" sx={{ marginBottom: 2 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom className="dark:text-gray-100">
        Bestseller {dateRange ? `| ${dateRange}` : ''} {storeLabel ? `| ${storeLabel}` : ''}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="dark:text-gray-100">Name</TableCell>
            <TableCell className="dark:text-gray-100">Preis</TableCell>
            <TableCell className="dark:text-gray-100">Größe</TableCell>
            <TableCell className="dark:text-gray-100">Bestellungen</TableCell>
            <TableCell className="dark:text-gray-100">Umsatz</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell className="dark:text-gray-300">{row.name}</TableCell>
                <TableCell className="dark:text-gray-300">{row.price}€</TableCell>
                <TableCell className="dark:text-gray-300">{row.size}</TableCell>
                <TableCell className="dark:text-gray-300">{row.orders}</TableCell>
                <TableCell className="dark:text-gray-300">{row.revenue}€</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="dark:text-gray-300">Keine Daten</TableCell>
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