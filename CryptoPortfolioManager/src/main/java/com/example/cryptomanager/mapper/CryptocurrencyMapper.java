
package com.example.cryptomanager.mapper;

import com.example.cryptomanager.dto.CryptocurrencyDto;
import com.example.cryptomanager.model.Cryptocurrency;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CryptocurrencyMapper {
    CryptocurrencyDto toDto(Cryptocurrency entity);
    Cryptocurrency toEntity(CryptocurrencyDto dto);
}
