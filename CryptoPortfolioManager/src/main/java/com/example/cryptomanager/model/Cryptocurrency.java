
package com.example.cryptomanager.model;

import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "cryptocurrencies")
@Data
public class Cryptocurrency {

    @Id
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
