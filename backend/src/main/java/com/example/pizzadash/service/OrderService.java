package com.example.pizzadash.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.pizzadash.dto.OrderTimeDTO;
import com.example.pizzadash.dto.OrdersDTO;
import com.example.pizzadash.dto.RankedProduct;
import com.example.pizzadash.dto.RankingEntry;
import com.example.pizzadash.dto.StoreDTO;
import com.example.pizzadash.dto.StoreRankingEntry;
import com.example.pizzadash.repository.OrderRepository;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    public List<OrdersDTO> getOrdersGroupedByWeekday(LocalDate start, LocalDate end, List<String> stores, List<String> categories, List<String> sizes) {
        return orderRepository.getOrdersGroupedByWeekday(start, end, stores, categories, sizes);
    }

    public Map<String, Object> getKpiSummary(LocalDate start, LocalDate end, List<String> stores, List<String> categories, List<String> sizes) {
        return orderRepository.getKpiSummary(start, end, stores, categories, sizes);
    }

    public List<RankingEntry> getProductRanking(LocalDate start, LocalDate end) {
        return orderRepository.getProductRanking(start, end);
    }

    public List<StoreRankingEntry> getStoreRanking(LocalDate start, LocalDate end) {
        return orderRepository.getStoreRanking(start, end);
    }

    public List<OrderTimeDTO> getOrderTimes(LocalDate start, LocalDate end, List<String> stores, List<String> categories, List<String> sizes) {
        return orderRepository.getOrderTimes(start, end, stores, categories, sizes);
    }

    // Pure Java logic can stay here
    public List<RankedProduct> compareRankings(List<RankingEntry> previous, List<RankingEntry> current) {
        java.util.Map<String, Integer> previousMap = new java.util.HashMap<>();
        for (int i = 0; i < previous.size(); i++) {
            previousMap.put(previous.get(i).product, i);
        }
        List<RankedProduct> result = new java.util.ArrayList<>();
        for (int i = 0; i < current.size(); i++) {
            RankingEntry item = current.get(i);
            Integer prevIndex = previousMap.get(item.product);
            String trend;
            Integer rankBefore = null;
            if (prevIndex == null) {
                trend = "new";
            } else {
                rankBefore = prevIndex + 1;
                trend = prevIndex > i ? "up" : prevIndex < i ? "down" : "same";
            }
            result.add(new RankedProduct(item.product, item.orders, i + 1, rankBefore, trend));
        }
        return result;
    }

    public List<StoreDTO> compareStoreRankings(List<StoreRankingEntry> previous, List<StoreRankingEntry> current) {
        java.util.Map<String, Integer> previousMap = new java.util.HashMap<>();
        for (int i = 0; i < previous.size(); i++) {
            previousMap.put(previous.get(i).store, i);
        }
        List<StoreDTO> result = new java.util.ArrayList<>();
        for (int i = 0; i < current.size(); i++) {
            StoreRankingEntry item = current.get(i);
            Integer prevIndex = previousMap.get(item.store);
            String trend;
            Integer rankBefore = null;
            if (prevIndex == null) {
                trend = "new";
            } else {
                rankBefore = prevIndex + 1;
                trend = prevIndex > i ? "up" : prevIndex < i ? "down" : "same";
            }
            result.add(new StoreDTO(item.store, item.orders, i + 1, rankBefore, trend));
        }
        return result;
    }
}