package com.example.pizzadash.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.HashMap;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/filters")
public class FilterController {

    @Autowired
    private JdbcTemplate jdbc;


    @GetMapping
    public Map<String, List<String>> getAllFilterOptions() {
        List<String> sizes = jdbc.queryForList("SELECT DISTINCT Size FROM products WHERE Size IS NOT NULL", String.class);
        List<String> categories = jdbc.queryForList("SELECT DISTINCT Category FROM products WHERE Category IS NOT NULL", String.class);
        List<String> stores = jdbc.queryForList("SELECT storeID FROM stores", String.class);

        Map<String, List<String>> filters = new HashMap<>();
        filters.put("sizes", sizes);
        filters.put("categories", categories);
        filters.put("stores", stores);

        return filters;
    }
}
