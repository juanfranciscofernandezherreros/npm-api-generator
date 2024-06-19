package com.ceca.ealUsusUsuarios.mapper;

import com.ceca.ealUsusUsuarios.dto.EalUsusUsuariosDto;
import com.ceca.ealUsusUsuarios.model.EalUsusUsuarios;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-06-19T15:13:56+0200",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 17.0.10 (Oracle Corporation)"
)
@Component
public class EalUsusUsuariosMapperImpl implements EalUsusUsuariosMapper {

    @Override
    public EalUsusUsuariosDto toDto(EalUsusUsuarios entity) {
        if ( entity == null ) {
            return null;
        }

        EalUsusUsuariosDto ealUsusUsuariosDto = new EalUsusUsuariosDto();

        ealUsusUsuariosDto.setApellidos( entity.getApellidos() );
        ealUsusUsuariosDto.setCodUsuario( entity.getCodUsuario() );
        ealUsusUsuariosDto.setCodPerfil( entity.getCodPerfil() );
        ealUsusUsuariosDto.setBicEntidad( entity.getBicEntidad() );
        ealUsusUsuariosDto.setIdInternoEntidad( entity.getIdInternoEntidad() );
        ealUsusUsuariosDto.setCodEstado( entity.getCodEstado() );
        ealUsusUsuariosDto.setFechaHoraEstado( entity.getFechaHoraEstado() );
        ealUsusUsuariosDto.setFechaHoraAlta( entity.getFechaHoraAlta() );
        ealUsusUsuariosDto.setIdDocIdentidad( entity.getIdDocIdentidad() );
        ealUsusUsuariosDto.setFechaNacimiento( entity.getFechaNacimiento() );
        ealUsusUsuariosDto.setCodGenero( entity.getCodGenero() );
        ealUsusUsuariosDto.setCodPaisNacimiento( entity.getCodPaisNacimiento() );
        ealUsusUsuariosDto.setCodIdioma( entity.getCodIdioma() );
        ealUsusUsuariosDto.setCodTipoDocIdentidad( entity.getCodTipoDocIdentidad() );
        ealUsusUsuariosDto.setNombreVisualizacion( entity.getNombreVisualizacion() );
        ealUsusUsuariosDto.setNombre( entity.getNombre() );
        ealUsusUsuariosDto.setIdUsuarioEsb( entity.getIdUsuarioEsb() );
        ealUsusUsuariosDto.setVpan( entity.getVpan() );
        ealUsusUsuariosDto.setCodMotivo( entity.getCodMotivo() );
        ealUsusUsuariosDto.setFechaHoraRevision( entity.getFechaHoraRevision() );
        ealUsusUsuariosDto.setFechaCaducidadNfc( entity.getFechaCaducidadNfc() );

        return ealUsusUsuariosDto;
    }

    @Override
    public EalUsusUsuarios toEntity(EalUsusUsuariosDto dto) {
        if ( dto == null ) {
            return null;
        }

        EalUsusUsuarios ealUsusUsuarios = new EalUsusUsuarios();

        ealUsusUsuarios.setApellidos( dto.getApellidos() );
        ealUsusUsuarios.setCodUsuario( dto.getCodUsuario() );
        ealUsusUsuarios.setCodPerfil( dto.getCodPerfil() );
        ealUsusUsuarios.setBicEntidad( dto.getBicEntidad() );
        ealUsusUsuarios.setIdInternoEntidad( dto.getIdInternoEntidad() );
        ealUsusUsuarios.setCodEstado( dto.getCodEstado() );
        ealUsusUsuarios.setFechaHoraEstado( dto.getFechaHoraEstado() );
        ealUsusUsuarios.setFechaHoraAlta( dto.getFechaHoraAlta() );
        ealUsusUsuarios.setIdDocIdentidad( dto.getIdDocIdentidad() );
        ealUsusUsuarios.setFechaNacimiento( dto.getFechaNacimiento() );
        ealUsusUsuarios.setCodGenero( dto.getCodGenero() );
        ealUsusUsuarios.setCodPaisNacimiento( dto.getCodPaisNacimiento() );
        ealUsusUsuarios.setCodIdioma( dto.getCodIdioma() );
        ealUsusUsuarios.setCodTipoDocIdentidad( dto.getCodTipoDocIdentidad() );
        ealUsusUsuarios.setNombreVisualizacion( dto.getNombreVisualizacion() );
        ealUsusUsuarios.setNombre( dto.getNombre() );
        ealUsusUsuarios.setIdUsuarioEsb( dto.getIdUsuarioEsb() );
        ealUsusUsuarios.setVpan( dto.getVpan() );
        ealUsusUsuarios.setCodMotivo( dto.getCodMotivo() );
        ealUsusUsuarios.setFechaHoraRevision( dto.getFechaHoraRevision() );
        ealUsusUsuarios.setFechaCaducidadNfc( dto.getFechaCaducidadNfc() );

        return ealUsusUsuarios;
    }
}
