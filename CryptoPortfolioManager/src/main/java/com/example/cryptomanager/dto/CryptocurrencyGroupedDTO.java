
package com.example.cryptomanager.dto;

public class CryptocurrencyGroupedDTO {
    private String field;
    private Long count;

    public CryptocurrencyGroupedDTO(String field, Long count) {
        this.field = field;
        this.count = count;
    }

    // Getters y setters
    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
