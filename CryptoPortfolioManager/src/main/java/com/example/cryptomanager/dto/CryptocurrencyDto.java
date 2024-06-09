
package com.example.cryptomanager.dto;

import lombok.Data;

@Data
public class CryptocurrencyDto {
    private Long id;
    private String symbol;
    private String name;
    private Double currentPrice;
    private Double marketCap;
    private Double circulatingSupply;
    private Double totalSupply;
    private Double maxSupply;
    private Double change24h;
}
