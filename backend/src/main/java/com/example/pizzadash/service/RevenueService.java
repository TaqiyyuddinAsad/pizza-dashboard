package com.example.pizzadash.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.pizzadash.dto.RevenueDTO;
import com.example.pizzadash.repository.RevenueRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class RevenueService {
    @Autowired
    private RevenueRepository revenueRepository;

    public List<RevenueDTO> getRevenueFiltered(LocalDate start, LocalDate end, List<String> stores, List<String> categories, List<String> sizes) {
        return revenueRepository.getRevenueFiltered(start, end, stores, categories, sizes);
    }
}
