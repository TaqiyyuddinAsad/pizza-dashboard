
package com.example.pizzadash.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.*;

@RestController
@RequestMapping("/api")
public class MapDataController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/customers")
    public List<Map<String, Object>> getCustomers() {
        String sql = "SELECT customerID, latitude, longitude FROM customers";
        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/stores")
    public List<Map<String, Object>> getStores() {
        String sql = "SELECT storeID, latitude, longitude FROM stores";
        return jdbcTemplate.queryForList(sql);
    }
}