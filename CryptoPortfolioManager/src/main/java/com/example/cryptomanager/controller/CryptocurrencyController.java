
package com.example.cryptomanager.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.cryptomanager.dto.CryptocurrencyDto;
import com.example.cryptomanager.dto.CryptocurrencyGroupedDTO;
import com.example.cryptomanager.mapper.CryptocurrencyMapper;
import com.example.cryptomanager.service.CryptocurrencyService;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import com.example.cryptomanager.model.Cryptocurrency;

@RestController
@RequestMapping("/cryptocurrencies")
public class CryptocurrencyController {

    @Autowired
    private CryptocurrencyService cryptocurrencyService;

    @Autowired
    private CryptocurrencyMapper cryptocurrencyMapper;

    @GetMapping("/{id}")
    public ResponseEntity<CryptocurrencyDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(cryptocurrencyMapper.toDto(cryptocurrencyService.findById(id)));
    }

    @GetMapping
    public ResponseEntity<List<CryptocurrencyDto>> findAll() {
        return ResponseEntity.ok(cryptocurrencyService.findAll().stream().map(cryptocurrencyMapper::toDto).collect(Collectors.toList()));
    }

    @PostMapping("/filter")
    public Page<Cryptocurrency> filterMovies(
            @RequestBody Map<String, Map<String, Object>> filters,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return cryptocurrencyService.filterMovies(filters, pageable);
    }
}
