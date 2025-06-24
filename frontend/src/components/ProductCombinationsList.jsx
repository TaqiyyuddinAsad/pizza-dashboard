import React from "react";
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const ProductCombinationsList = ({ data }) => (
  <Card sx={{ marginBottom: 2 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>Beliebteste Kombinationen</Typography>
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
                <TableCell>{row.orders}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2}>Keine Daten</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default ProductCombinationsList; 