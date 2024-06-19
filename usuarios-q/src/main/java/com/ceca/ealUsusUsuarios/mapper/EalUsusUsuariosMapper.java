
package com.ceca.ealUsusUsuarios.mapper;

import com.ceca.ealUsusUsuarios.dto.EalUsusUsuariosDto;
import com.ceca.ealUsusUsuarios.model.EalUsusUsuarios;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EalUsusUsuariosMapper {
    EalUsusUsuariosDto toDto(EalUsusUsuarios entity);
    EalUsusUsuarios toEntity(EalUsusUsuariosDto dto);
}
