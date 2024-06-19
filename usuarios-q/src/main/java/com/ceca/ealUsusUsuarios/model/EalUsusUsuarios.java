
package com.ceca.ealUsusUsuarios.model;

import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "EAL_USUS_USUARIOS")
@Data
public class EalUsusUsuarios {

    private String apellidos;
    @Id
    private String codUsuario;
    private String codPerfil;
    private String bicEntidad;
    private String idInternoEntidad;
    private String codEstado;
    private String fechaHoraEstado;
    private String fechaHoraAlta;
    @Column(nullable = false)
    private String idDocIdentidad;
    @Column(nullable = false)
    private String fechaNacimiento;
    @Column(nullable = false)
    private String codGenero;
    @Column(nullable = false)
    private String codPaisNacimiento;
    private String codIdioma;
    @Column(nullable = false)
    private String codTipoDocIdentidad;
    @Column(nullable = false)
    private String nombreVisualizacion;
    @Column(nullable = false)
    private String nombre;
    @Column(nullable = false)
    private String idUsuarioEsb;
    @Column(nullable = false)
    private String vpan;
    @Column(nullable = false)
    private String codMotivo;
    @Column(nullable = false)
    private String fechaHoraRevision;
    @Column(nullable = false)
    private String fechaCaducidadNfc;

}
