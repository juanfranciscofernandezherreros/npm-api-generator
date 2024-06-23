
package com.example.usuarios.model;

import javax.persistence.*;

@Entity
@Table(name = "EAL_USUS_USUARIOS")
public class Usuarios {

    @EmbeddedId
    private UsuariosId id;

    @Column(name = "APELLIDOS")
    private String apellidos;
    @Column(name = "FECHA_HORA_REVISION")
    private String fechaHoraRevision;
    @Column(name = "ID_INTERNO_ENTIDAD")
    private String idInternoEntidad;
    @Column(name = "BIC_ENTIDAD")
    private String bicEntidad;
    @Column(name = "COD_MOTIVO")
    private String codMotivo;
    @Column(name = "COD_ESTADO")
    private String codEstado;
    @Column(name = "NOMBRE")
    private String nombre;
    @Column(name = "COD_PERFIL")
    private String codPerfil;
    @Column(name = "COD_TIPO_DOC_IDENTIDAD")
    private String codTipoDocIdentidad;
    @Column(name = "ID_DOC_IDENTIDAD")
    private String idDocIdentidad;
    @Column(name = "COD_GENERO")
    private String codGenero;
    @Column(name = "FECHA_HORA_ESTADO")
    private String fechaHoraEstado;
    @Column(name = "COD_PAIS_NACIMIENTO")
    private String codPaisNacimiento;
    @Column(name = "COD_IDIOMA")
    private String codIdioma;
    @Column(name = "FECHA_CADUCIDAD_NFC")
    private String fechaCaducidadNfc;
    @Column(name = "FECHA_HORA_ALTA")
    private String fechaHoraAlta;
    @Column(name = "NOMBRE_VISUALIZACION")
    private String nombreVisualizacion;
    @Column(name = "ID_USUARIO_ESB")
    private String isUsuarioEsb;
    @Column(name = "FECHA_NACIMIENTO")
    private String fechaNacimiento;
    @Column(name = "VPAN")
    private String vpan;

    public UsuariosId getId() {
        return id;
    }

    public void setId(UsuariosId id) {
        this.id = id;
    }


    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getFechaHoraRevision() {
        return fechaHoraRevision;
    }

    public void setFechaHoraRevision(String fechaHoraRevision) {
        this.fechaHoraRevision = fechaHoraRevision;
    }

    public String getIdInternoEntidad() {
        return idInternoEntidad;
    }

    public void setIdInternoEntidad(String idInternoEntidad) {
        this.idInternoEntidad = idInternoEntidad;
    }

    public String getBicEntidad() {
        return bicEntidad;
    }

    public void setBicEntidad(String bicEntidad) {
        this.bicEntidad = bicEntidad;
    }

    public String getCodMotivo() {
        return codMotivo;
    }

    public void setCodMotivo(String codMotivo) {
        this.codMotivo = codMotivo;
    }

    public String getCodEstado() {
        return codEstado;
    }

    public void setCodEstado(String codEstado) {
        this.codEstado = codEstado;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCodPerfil() {
        return codPerfil;
    }

    public void setCodPerfil(String codPerfil) {
        this.codPerfil = codPerfil;
    }

    public String getCodTipoDocIdentidad() {
        return codTipoDocIdentidad;
    }

    public void setCodTipoDocIdentidad(String codTipoDocIdentidad) {
        this.codTipoDocIdentidad = codTipoDocIdentidad;
    }

    public String getIdDocIdentidad() {
        return idDocIdentidad;
    }

    public void setIdDocIdentidad(String idDocIdentidad) {
        this.idDocIdentidad = idDocIdentidad;
    }

    public String getCodGenero() {
        return codGenero;
    }

    public void setCodGenero(String codGenero) {
        this.codGenero = codGenero;
    }

    public String getFechaHoraEstado() {
        return fechaHoraEstado;
    }

    public void setFechaHoraEstado(String fechaHoraEstado) {
        this.fechaHoraEstado = fechaHoraEstado;
    }

    public String getCodPaisNacimiento() {
        return codPaisNacimiento;
    }

    public void setCodPaisNacimiento(String codPaisNacimiento) {
        this.codPaisNacimiento = codPaisNacimiento;
    }

    public String getCodIdioma() {
        return codIdioma;
    }

    public void setCodIdioma(String codIdioma) {
        this.codIdioma = codIdioma;
    }

    public String getFechaCaducidadNfc() {
        return fechaCaducidadNfc;
    }

    public void setFechaCaducidadNfc(String fechaCaducidadNfc) {
        this.fechaCaducidadNfc = fechaCaducidadNfc;
    }

    public String getFechaHoraAlta() {
        return fechaHoraAlta;
    }

    public void setFechaHoraAlta(String fechaHoraAlta) {
        this.fechaHoraAlta = fechaHoraAlta;
    }

    public String getNombreVisualizacion() {
        return nombreVisualizacion;
    }

    public void setNombreVisualizacion(String nombreVisualizacion) {
        this.nombreVisualizacion = nombreVisualizacion;
    }

    public String getIsUsuarioEsb() {
        return isUsuarioEsb;
    }

    public void setIsUsuarioEsb(String isUsuarioEsb) {
        this.isUsuarioEsb = isUsuarioEsb;
    }

    public String getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(String fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getVpan() {
        return vpan;
    }

    public void setVpan(String vpan) {
        this.vpan = vpan;
    }
}
