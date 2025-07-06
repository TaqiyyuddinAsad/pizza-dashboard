import React from "react";
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from "@mui/material";

const ProductCombinationsList = ({ data, total, page, rowsPerPage, onPageChange, onRowsPerPageChange, dateRange, storeLabel }) => (
  <Card className="dark:bg-gray-800 dark:border-gray-700" sx={{ marginBottom: 2 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom className="dark:text-gray-100">
        Beliebteste Kombinationen {dateRange ? `| ${dateRange}` : ''} {storeLabel ? `| ${storeLabel}` : ''}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="dark:text-gray-100">Kombination</TableCell>
            <TableCell className="dark:text-gray-100">Anzahl Bestellungen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell className="dark:text-gray-300">{row.combination}</TableCell>
                <TableCell className="dark:text-gray-300">{row.count}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="dark:text-gray-300">Keine Daten</TableCell>
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