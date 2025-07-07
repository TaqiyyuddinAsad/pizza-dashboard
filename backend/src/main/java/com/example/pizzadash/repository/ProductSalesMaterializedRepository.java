package com.example.pizzadash.repository;

import com.example.pizzadash.entity.ProductSalesMaterialized;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProductSalesMaterializedRepository extends JpaRepository<ProductSalesMaterialized, Long> {
    
    // Get bestsellers by orders using native SQL for proper aggregation
    @Query(value = "SELECT " +
           "p.product_sku, p.product_name, p.product_category, p.product_size, p.product_price, " +
           "p.store_id, p.store_city, p.store_state, " +
           "SUM(p.total_orders) as total_orders, SUM(p.total_revenue) as total_revenue " +
           "FROM product_bestsellers_store_materialized p " +
           "WHERE (:storeId IS NULL OR p.store_id = :storeId) " +
           "AND (:sku IS NULL OR p.product_sku = :sku) " +
           "AND (:startDate IS NULL OR p.sale_date >= :startDate) " +
           "AND (:endDate IS NULL OR p.sale_date <= :endDate) " +
           "AND (:category IS NULL OR p.product_category = :category) " +
           "AND (:size IS NULL OR p.product_size = :size) " +
           "GROUP BY p.product_sku, p.product_name, p.product_category, p.product_size, p.product_price, p.store_id, p.store_city, p.store_state " +
           "ORDER BY SUM(p.total_orders) DESC", 
           nativeQuery = true)
    List<Object[]> findBestsellersByOrdersNative(
            @Param("storeId") String storeId,
            @Param("sku") String sku,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("category") String category,
            @Param("size") String size);
    
    // Get worst sellers by orders using native SQL
    @Query(value = "SELECT " +
           "p.product_sku, p.product_name, p.product_category, p.product_size, p.product_price, " +
           "p.store_id, p.store_city, p.store_state, " +
           "SUM(p.total_orders) as total_orders, SUM(p.total_revenue) as total_revenue " +
           "FROM product_bestsellers_store_materialized p " +
           "WHERE (:storeId IS NULL OR p.store_id = :storeId) " +
           "AND (:startDate IS NULL OR p.sale_date >= :startDate) " +
           "AND (:endDate IS NULL OR p.sale_date <= :endDate) " +
           "AND (:category IS NULL OR p.product_category = :category) " +
           "AND (:size IS NULL OR p.product_size = :size) " +
           "GROUP BY p.product_sku, p.product_name, p.product_category, p.product_size, p.product_price, p.store_id, p.store_city, p.store_state " +
           "HAVING SUM(p.total_orders) > 0 " +
           "ORDER BY SUM(p.total_orders) ASC", 
           nativeQuery = true)
    List<Object[]> findWorstSellersByOrdersNative(
            @Param("storeId") String storeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("category") String category,
            @Param("size") String size);
    
    // Get bestsellers by revenue using native SQL
    @Query(value = "SELECT " +
           "p.product_sku, p.product_name, p.product_category, p.product_size, p.product_price, " +
           "p.store_id, p.store_city, p.store_state, " +
           "SUM(p.total_orders) as total_orders, SUM(p.total_revenue) as total_revenue " +
           "FROM product_bestsellers_store_materialized p " +
           "WHERE (:storeId IS NULL OR p.store_id = :storeId) " +
           "AND (:startDate IS NULL OR p.sale_date >= :startDate) " +
           "AND (:endDate IS NULL OR p.sale_date <= :endDate) " +
           "AND (:category IS NULL OR p.product_category = :category) " +
           "AND (:size IS NULL OR p.product_size = :size) " +
           "GROUP BY p.product_sku, p.product_name, p.product_category, p.product_size, p.product_price, p.store_id, p.store_city, p.store_state " +
           "ORDER BY SUM(p.total_revenue) DESC", 
           nativeQuery = true)
    List<Object[]> findBestsellersByRevenueNative(
            @Param("storeId") String storeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("category") String category,
            @Param("size") String size);
    
    // Get worst sellers by revenue using native SQL
    @Query(value = "SELECT " +
           "p.product_sku, p.product_name, p.product_category, p.product_size, p.product_price, " +
           "p.store_id, p.store_city, p.store_state, " +
           "SUM(p.total_orders) as total_orders, SUM(p.total_revenue) as total_revenue " +
           "FROM product_bestsellers_store_materialized p " +
           "WHERE (:storeId IS NULL OR p.store_id = :storeId) " +
           "AND (:startDate IS NULL OR p.sale_date >= :startDate) " +
           "AND (:endDate IS NULL OR p.sale_date <= :endDate) " +
           "AND (:category IS NULL OR p.product_category = :category) " +
           "AND (:size IS NULL OR p.product_size = :size) " +
           "GROUP BY p.product_sku, p.product_name, p.product_category, p.product_size, p.product_price, p.store_id, p.store_city, p.store_state " +
           "HAVING SUM(p.total_revenue) > 0 " +
           "ORDER BY SUM(p.total_revenue) ASC", 
           nativeQuery = true)
    List<Object[]> findWorstSellersByRevenueNative(
            @Param("storeId") String storeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("category") String category,
            @Param("size") String size);
    
    // Get total count for bestsellers
    @Query(value = "SELECT COUNT(DISTINCT CONCAT(p.product_sku, '-', p.product_size)) " +
           "FROM product_bestsellers_store_materialized p " +
           "WHERE (:storeId IS NULL OR p.store_id = :storeId) " +
           "AND (:startDate IS NULL OR p.sale_date >= :startDate) " +
           "AND (:endDate IS NULL OR p.sale_date <= :endDate) " +
           "AND (:category IS NULL OR p.product_category = :category) " +
           "AND (:size IS NULL OR p.product_size = :size)", 
           nativeQuery = true)
    long countByFilters(
            @Param("storeId") String storeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("category") String category,
            @Param("size") String size);
    
    // Get total count for worst sellers
    @Query(value = "SELECT COUNT(*) FROM (" +
           "SELECT p.product_sku, p.product_size " +
           "FROM product_bestsellers_store_materialized p " +
           "WHERE (:storeId IS NULL OR p.store_id = :storeId) " +
           "AND (:startDate IS NULL OR p.sale_date >= :startDate) " +
           "AND (:endDate IS NULL OR p.sale_date <= :endDate) " +
           "AND (:category IS NULL OR p.product_category = :category) " +
           "AND (:size IS NULL OR p.product_size = :size) " +
           "GROUP BY p.product_sku, p.product_size " +
           "HAVING SUM(p.total_orders) > 0) as subquery", 
           nativeQuery = true)
    long countWorstSellersByFilters(
            @Param("storeId") String storeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("category") String category,
            @Param("size") String size);
    
    // Get unique categories
    @Query(value = "SELECT DISTINCT product_category FROM product_bestsellers_store_materialized " +
           "WHERE product_category IS NOT NULL ORDER BY product_category", 
           nativeQuery = true)
    List<String> findDistinctCategories();
    
    // Get unique sizes
    @Query(value = "SELECT DISTINCT product_size FROM product_bestsellers_store_materialized " +
           "WHERE product_size IS NOT NULL ORDER BY product_size", 
           nativeQuery = true)
    List<String> findDistinctSizes();
    
    // Get unique stores
    @Query(value = "SELECT DISTINCT store_id FROM product_bestsellers_store_materialized " +
           "WHERE store_id IS NOT NULL ORDER BY store_id", 
           nativeQuery = true)
    List<String> findDistinctStores();
    
    // Get sales summary by store
    @Query(value = "SELECT p.store_id, p.store_city, p.store_state, " +
           "COUNT(DISTINCT CONCAT(p.product_sku, '-', p.product_size)) as unique_products, " +
           "SUM(p.total_orders) as total_orders, " +
           "SUM(p.total_revenue) as total_revenue " +
           "FROM product_bestsellers_store_materialized p " +
           "WHERE (:startDate IS NULL OR p.sale_date >= :startDate) " +
           "AND (:endDate IS NULL OR p.sale_date <= :endDate) " +
           "GROUP BY p.store_id, p.store_city, p.store_state " +
           "ORDER BY total_revenue DESC", 
           nativeQuery = true)
    List<Object[]> getSalesSummaryByStore(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
    
    // Get all unique products (SKU and name) from the materialized table
    @Query(value = "SELECT p.product_sku, p.product_name, GROUP_CONCAT(DISTINCT p.product_size ORDER BY p.product_size) as sizes FROM product_bestsellers_store_materialized p GROUP BY p.product_sku, p.product_name ORDER BY p.product_name", nativeQuery = true)
    List<Object[]> findDistinctProducts();

    @Query(value = "SELECT " +
           "FLOOR(DATEDIFF(pbm.sale_date, pr.Launch) / 7) + 1 AS week_after_launch, " +
           "SUM(pbm.total_orders) AS quantity, " +
           "SUM(pbm.total_revenue) AS revenue " +
           "FROM product_bestsellers_store_materialized pbm " +
           "JOIN products pr ON pbm.product_sku = pr.SKU " +
           "WHERE pbm.product_sku = :sku " +
           "AND pr.Launch IS NOT NULL " +
           "AND pbm.sale_date >= pr.Launch " +
           "AND pbm.sale_date < DATE_ADD(pr.Launch, INTERVAL :days DAY) " +
           "AND (:size IS NULL OR pbm.product_size = :size) " +
           "AND (:storeId IS NULL OR pbm.store_id = :storeId) " +
           "GROUP BY week_after_launch " +
           "ORDER BY week_after_launch", nativeQuery = true)
    List<Object[]> getProductPerformanceAfterLaunch(
        @Param("sku") String sku,
        @Param("days") int days,
        @Param("size") String size,
        @Param("storeId") String storeId
    );

    @Query(value = "SELECT " +
           "DATE_FORMAT(pbm.sale_date, '%Y-%u') AS period, " +
           "pbm.product_category AS category, " +
           "SUM(pbm.total_revenue) AS revenue " +
           "FROM product_bestsellers_store_materialized pbm " +
           "WHERE pbm.sale_date >= :startDate AND pbm.sale_date <= :endDate " +
           "AND (:storeId IS NULL OR pbm.store_id = :storeId) " +
           "AND (:size IS NULL OR pbm.product_size = :size) " +
           "GROUP BY period, category " +
           "ORDER BY period, category", nativeQuery = true)
    List<Object[]> getCategorySalesTimeline(
        @Param("startDate") java.sql.Date startDate,
        @Param("endDate") java.sql.Date endDate,
        @Param("storeId") String storeId,
        @Param("size") String size
    );

    @Query(value = "SELECT p.store_id, p.store_city, SUM(p.total_orders) as orders, SUM(p.total_revenue) as revenue " +
           "FROM product_bestsellers_store_materialized p " +
           "WHERE p.product_sku = :sku " +
           "AND (:size IS NULL OR p.product_size = :size) " +
           "AND p.sale_date >= :startDate AND p.sale_date <= :endDate " +
           "GROUP BY p.store_id, p.store_city " +
           "ORDER BY revenue DESC", nativeQuery = true)
    List<Object[]> findStoresForProductByRevenue(
        @Param("sku") String sku,
        @Param("size") String size,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
} 