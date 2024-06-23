
# usuarios-q

Este proyecto es una aplicación Spring Boot con una base de datos Oracle integrada.

## Configuración

Asegúrate de tener Docker y Docker Compose instalados en tu máquina.

## Construcción

Para construir el proyecto, ejecuta:

```bash
mvn clean package
```

## Ejecución

Para ejecutar el proyecto, usa Docker Compose:

```bash
docker-compose up
```

## Endpoints

### Buscar por Claves

```bash
curl -X GET "http://localhost:8080/usuarios/find?codUsuario={codUsuario}"
```

### Buscar con Criterios

```bash
curl -X POST "http://localhost:8080/usuarios/search" -H "Content-Type: application/json" -d '{
  "criteria": {
    "codUsuario": { "eq": "value" },
    "apellidos": { "eq": "value" },
    "fechaHoraRevision": { "eq": "value" },
    "idInternoEntidad": { "eq": "value" },
    "bicEntidad": { "eq": "value" },
    "codMotivo": { "eq": "value" },
    "codEstado": { "eq": "value" },
    "nombre": { "eq": "value" },
    "codPerfil": { "eq": "value" },
    "codTipoDocIdentidad": { "eq": "value" },
    "idDocIdentidad": { "eq": "value" },
    "codGenero": { "eq": "value" },
    "fechaHoraEstado": { "eq": "value" },
    "codPaisNacimiento": { "eq": "value" },
    "codIdioma": { "eq": "value" },
    "fechaCaducidadNfc": { "eq": "value" },
    "fechaHoraAlta": { "eq": "value" },
    "nombreVisualizacion": { "eq": "value" },
    "isUsuarioEsb": { "eq": "value" },
    "fechaNacimiento": { "eq": "value" },
    "vpan": { "eq": "value" }
  }
}'
```
