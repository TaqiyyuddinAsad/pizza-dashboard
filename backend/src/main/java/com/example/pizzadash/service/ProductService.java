package com.example.pizzadash.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import com.example.pizzadash.repository.AnalyticsRepository;
import com.example.pizzadash.dto.ProductBestsellerDTO;
import com.example.pizzadash.dto.ProductCombinationDTO;
import com.example.pizzadash.dto.ProductPerformanceDTO;
import com.example.pizzadash.dto.ProductPieDTO;
import com.example.pizzadash.dto.ProductSummaryDTO;
import com.example.pizzadash.dto.CategorySalesDTO;

@Service
public class ProductService {
    @Autowired
    private AnalyticsRepository analyticsRepository;

    public List<ProductBestsellerDTO> getBestseller(String start, String end, List<String> stores, List<String> categories, List<String> sizes) {
        // Beispiel: Pagination-Parameter (könnten als weitere Argumente übergeben werden)
        int page = 1; // TODO: aus Request holen
        int size = 3; // TODO: aus Request holen
        int offset = (page - 1) * size;

        StringBuilder sql = new StringBuilder(
            "SELECT p.SKU, p.name, p.price, p.Size, COUNT(*) AS orders, SUM(o.total) AS revenue " +
            "FROM orders o " +
            "JOIN orderitems oi ON o.orderID = oi.orderID " +
            "JOIN products p ON oi.productID = p.SKU " +
            "WHERE o.orderDate BETWEEN ? AND ? "
        );
        List<Object> params = new java.util.ArrayList<>();
        params.add(start);
        params.add(end);
        if (stores != null && !stores.isEmpty()) {
            sql.append(" AND o.storeID IN (").append("?,".repeat(stores.size()).replaceAll(",$", "")).append(")");
            params.addAll(stores);
        }
        if (categories != null && !categories.isEmpty()) {
            sql.append(" AND p.Category IN (").append("?,".repeat(categories.size()).replaceAll(",$", "")).append(")");
            params.addAll(categories);
        }
        if (sizes != null && !sizes.isEmpty()) {
            sql.append(" AND p.Size IN (").append("?,".repeat(sizes.size()).replaceAll(",$", "")).append(")");
            params.addAll(sizes);
        }
        sql.append(" GROUP BY p.SKU, p.name, p.price, p.Size ");
        sql.append(" ORDER BY orders DESC ");
        sql.append(" LIMIT ? OFFSET ?");
        params.add(size);
        params.add(offset);

        return analyticsRepository.getJdbcTemplate().query(
            sql.toString(),
            params.toArray(),
            (rs, rowNum) -> new ProductBestsellerDTO(
                rs.getString("SKU"),
                rs.getString("name"),
                rs.getDouble("price"),
                rs.getString("Size"),
                rs.getInt("orders"),
                rs.getDouble("revenue")
            )
        );
    }
    public List<ProductCombinationDTO> getCombinations(String start, String end, List<String> stores) {
        // Default pagination: page 1, size 3 (can be parameterized later)
        int page = 1;
        int size = 3;
        return analyticsRepository.getBestCombinations(start, end, stores, page, size);
    }
    public List<ProductPerformanceDTO> getPerformance(String sku, String start, String end, List<String> stores) {
        return analyticsRepository.getPerformanceAfterLaunch(sku, start, end, stores);
    }
    public List<ProductPieDTO> getPieBySize(String start, String end, List<String> stores) {
        return analyticsRepository.getPieBySize(start, end, stores);
    }
    public ProductSummaryDTO getSummary(String sku, String start, String end, List<String> stores) {
        // TODO: Query für Summary
        return null;
    }
    public List<CategorySalesDTO> getCategorySales(String start, String end, List<String> stores, List<String> sizes) {
        return analyticsRepository.getCategorySales(start, end, stores, sizes);
    }
}
