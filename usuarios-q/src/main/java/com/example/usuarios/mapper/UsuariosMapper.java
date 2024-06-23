
package com.example.usuarios.mapper;

import com.example.usuarios.dto.UsuariosDto;
import com.example.usuarios.model.Usuarios;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UsuariosMapper {

    @Mapping(source = "id.codUsuario", target = "codUsuario")
    @Mapping(source = "apellidos", target = "apellidos")
    @Mapping(source = "fechaHoraRevision", target = "fechaHoraRevision")
    @Mapping(source = "idInternoEntidad", target = "idInternoEntidad")
    @Mapping(source = "bicEntidad", target = "bicEntidad")
    @Mapping(source = "codMotivo", target = "codMotivo")
    @Mapping(source = "codEstado", target = "codEstado")
    @Mapping(source = "nombre", target = "nombre")
    @Mapping(source = "codPerfil", target = "codPerfil")
    @Mapping(source = "codTipoDocIdentidad", target = "codTipoDocIdentidad")
    @Mapping(source = "idDocIdentidad", target = "idDocIdentidad")
    @Mapping(source = "codGenero", target = "codGenero")
    @Mapping(source = "fechaHoraEstado", target = "fechaHoraEstado")
    @Mapping(source = "codPaisNacimiento", target = "codPaisNacimiento")
    @Mapping(source = "codIdioma", target = "codIdioma")
    @Mapping(source = "fechaCaducidadNfc", target = "fechaCaducidadNfc")
    @Mapping(source = "fechaHoraAlta", target = "fechaHoraAlta")
    @Mapping(source = "nombreVisualizacion", target = "nombreVisualizacion")
    @Mapping(source = "isUsuarioEsb", target = "isUsuarioEsb")
    @Mapping(source = "fechaNacimiento", target = "fechaNacimiento")
    @Mapping(source = "vpan", target = "vpan")
    UsuariosDto toDto(Usuarios entity);

    @Mapping(source = "codUsuario", target = "id.codUsuario")
    @Mapping(source = "apellidos", target = "apellidos")
    @Mapping(source = "fechaHoraRevision", target = "fechaHoraRevision")
    @Mapping(source = "idInternoEntidad", target = "idInternoEntidad")
    @Mapping(source = "bicEntidad", target = "bicEntidad")
    @Mapping(source = "codMotivo", target = "codMotivo")
    @Mapping(source = "codEstado", target = "codEstado")
    @Mapping(source = "nombre", target = "nombre")
    @Mapping(source = "codPerfil", target = "codPerfil")
    @Mapping(source = "codTipoDocIdentidad", target = "codTipoDocIdentidad")
    @Mapping(source = "idDocIdentidad", target = "idDocIdentidad")
    @Mapping(source = "codGenero", target = "codGenero")
    @Mapping(source = "fechaHoraEstado", target = "fechaHoraEstado")
    @Mapping(source = "codPaisNacimiento", target = "codPaisNacimiento")
    @Mapping(source = "codIdioma", target = "codIdioma")
    @Mapping(source = "fechaCaducidadNfc", target = "fechaCaducidadNfc")
    @Mapping(source = "fechaHoraAlta", target = "fechaHoraAlta")
    @Mapping(source = "nombreVisualizacion", target = "nombreVisualizacion")
    @Mapping(source = "isUsuarioEsb", target = "isUsuarioEsb")
    @Mapping(source = "fechaNacimiento", target = "fechaNacimiento")
    @Mapping(source = "vpan", target = "vpan")
    Usuarios toEntity(UsuariosDto dto);
}
