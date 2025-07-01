package com.example.pizzadash.service;

import com.example.pizzadash.dto.CustomerCountDTO;
import com.example.pizzadash.dto.RevenuePerCustomerDTO;
import com.example.pizzadash.dto.InactiveCustomerDTO;
import com.example.pizzadash.dto.RevenueSegmentDTO;
import com.example.pizzadash.repository.AnalyticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private AnalyticsRepository analyticsRepository;

    public List<CustomerCountDTO> getCustomerCount(String start, String end, String groupBy, List<String> categories, List<String> sizes, List<String> stores) {
        return analyticsRepository.getCustomerCount(start, end, groupBy, categories, sizes, stores);
    }

    public List<RevenuePerCustomerDTO> getRevenuePerCustomer(String start, String end, String groupBy, List<String> categories, List<String> sizes, List<String> stores) {
        return analyticsRepository.getRevenuePerCustomer(start, end, groupBy, categories, sizes, stores);
    }

    public List<InactiveCustomerDTO> getInactiveCustomers(int days) {
        return analyticsRepository.getInactiveCustomers(days);
    }

    public List<RevenueSegmentDTO> getRevenuePerCustomerSegments(String start, String end, List<String> categories, List<String> sizes, List<String> stores) {
        return analyticsRepository.getRevenuePerCustomerSegments(start, end, categories, sizes, stores);
    }
}
