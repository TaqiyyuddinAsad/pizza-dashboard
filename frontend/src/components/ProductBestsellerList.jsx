import React from "react";
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from "@mui/material";

const ProductBestsellerList = ({ data, total, page, rowsPerPage, onPageChange, onRowsPerPageChange, appliedFilters, sortOrder = 'best' }) => (
  <Card className="dark:bg-gray-800 dark:border-gray-700" sx={{ marginBottom: 2 }}>
    <CardContent>
      {appliedFilters && (
        <div
          className="dark:text-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700"
          style={{
            marginBottom: '1rem',
            fontWeight: 500,
            fontSize: '1.1rem',
            color: '#222',
            textAlign: 'center',
            borderRadius: 12,
            padding: '0.75rem 1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            border: '1px solid #e5e7eb'
          }}
        >
          {appliedFilters}
        </div>
      )}
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
              <TableRow key={`${row.sku || row.name}-${row.size}-${idx}`}>
                <TableCell className="dark:text-gray-300">{row.name}</TableCell>
                <TableCell className="dark:text-gray-300">{row.price}$</TableCell>
                <TableCell className="dark:text-gray-300">{row.size}</TableCell>
                <TableCell className="dark:text-gray-300">{row.orders}</TableCell>
                <TableCell className="dark:text-gray-300">{row.revenue}$</TableCell>
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