import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { 
  getBestsellersByOrders, 
  getWorstSellersByOrders,
  getBestsellersByRevenue,
  getWorstSellersByRevenue
} from '../services/productservice';

const ProductBestsellersTable = ({ filters }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState('orders'); // 'orders' or 'revenue'
  const [sortOrder, setSortOrder] = useState('best'); // 'best' or 'worst'

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      
      if (sortBy === 'orders') {
        if (sortOrder === 'best') {
          response = await getBestsellersByOrders(filters, page, rowsPerPage);
        } else {
          response = await getWorstSellersByOrders(filters, page, rowsPerPage);
        }
      } else {
        if (sortOrder === 'best') {
          response = await getBestsellersByRevenue(filters, page, rowsPerPage);
        } else {
          response = await getWorstSellersByRevenue(filters, page, rowsPerPage);
        }
      }
      
      setData(response.content || []);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, page, rowsPerPage, sortBy, sortOrder]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortByChange = (event, newSortBy) => {
    if (newSortBy !== null) {
      setSortBy(newSortBy);
      setPage(0);
    }
  };

  const handleSortOrderChange = (event, newSortOrder) => {
    if (newSortOrder !== null) {
      setSortOrder(newSortOrder);
      setPage(0);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getRankColor = (index) => {
    if (sortOrder === 'best') {
      if (index === 0) return '#FFD700'; // Gold
      if (index === 1) return '#C0C0C0'; // Silver
      if (index === 2) return '#CD7F32'; // Bronze
    }
    return 'transparent';
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Product Analysis
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ToggleButtonGroup
            value={sortBy}
            exclusive
            onChange={handleSortByChange}
            size="small"
          >
            <ToggleButton value="orders">By Orders</ToggleButton>
            <ToggleButton value="revenue">By Revenue</ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            value={sortOrder}
            exclusive
            onChange={handleSortOrderChange}
            size="small"
          >
            <ToggleButton value="best">Best</ToggleButton>
            <ToggleButton value="worst">Worst</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Size</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Store</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Orders</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow 
                  key={`${row.productSku}-${row.productSize}-${row.storeId}`}
                  sx={{ 
                    backgroundColor: getRankColor(index),
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  <TableCell>
                    <Chip 
                      label={`#${page * rowsPerPage + index + 1}`}
                      size="small"
                      color={index < 3 ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {row.productName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        SKU: {row.productSku}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.productCategory} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.productSize} 
                      size="small" 
                      color="secondary"
                    />
                  </TableCell>
                  <TableCell>
                    {formatCurrency(row.productPrice)}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {row.storeId}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {row.storeCity}, {row.storeState}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {row.totalOrders?.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      {formatCurrency(row.totalRevenue)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalElements}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default ProductBestsellersTable;