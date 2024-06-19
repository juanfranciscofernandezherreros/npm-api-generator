
CREATE TABLE EAL_USUS_USUARIOS (
    apellidos VARCHAR(255),
    codUsuario VARCHAR(255),
    codPerfil VARCHAR(255),
    bicEntidad VARCHAR(255),
    idInternoEntidad VARCHAR(255),
    codEstado VARCHAR(255),
    fechaHoraEstado VARCHAR(255),
    fechaHoraAlta VARCHAR(255),
    idDocIdentidad VARCHAR(255) NOT NULL,
    fechaNacimiento VARCHAR(255) NOT NULL,
    codGenero VARCHAR(255) NOT NULL,
    codPaisNacimiento VARCHAR(255) NOT NULL,
    codIdioma VARCHAR(255),
    codTipoDocIdentidad VARCHAR(255) NOT NULL,
    nombreVisualizacion VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    idUsuarioEsb VARCHAR(255) NOT NULL,
    vpan VARCHAR(255) NOT NULL,
    codMotivo VARCHAR(255) NOT NULL,
    fechaHoraRevision VARCHAR(255) NOT NULL,
    fechaCaducidadNfc VARCHAR(255) NOT NULL,
    PRIMARY KEY (codUsuario)
);
  