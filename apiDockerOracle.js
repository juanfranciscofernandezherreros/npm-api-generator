const fs = require('fs');
const path = require('path');

// Obtener la ruta del archivo JSON desde los argumentos de la línea de comandos
const configPath = process.argv[2];

if (!configPath) {
  console.error('No se ha proporcionado la ruta del archivo de configuración.');
  process.exit(1);
}

// Leer configuración desde archivo JSON
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Función para convertir el nombre del paquete en una ruta de directorio
const packageToPath = (packageName) => {
  return packageName.replace(/\./g, '/');
};

// Subdirectorios base
const subDirs = [
  'controller',
  'exception',
  'model',
  'repository',
  'service',
  'config',
  'dto',
  'mapper'
];

// Construir directorios usando el nombre del paquete
const buildDirs = (subDirs, config) => {
  const packagePath = packageToPath(config.packageName);
  return subDirs.map(dir => `${config.projectName}/src/main/java/${packagePath}/${dir}`).concat(`${config.projectName}/src/main/resources`);
};

// Función para capitalizar la primera letra
const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// Crear la carpeta del proyecto
const projectDir = config.projectName;
if (!fs.existsSync(projectDir)) {
  fs.mkdirSync(projectDir, { recursive: true });
}

// Directorios actualizados
const dirs = buildDirs(subDirs, config);

// Crear directorios
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Función para escribir contenido en un archivo
const writeToFile = (fileName, content) => {
  fs.writeFileSync(fileName, content, 'utf8');
  console.log(`Archivo ${fileName} generado exitosamente.`);
};

// Generar pom.xml
const generatePomXml = () => {
  const content = `
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://www.apache.org/xsd/maven-4.0.0.xsd">
<modelVersion>4.0.0</modelVersion>
<groupId>${config.packageName}</groupId>
<artifactId>${config.projectName.toLowerCase()}</artifactId>
<version>0.0.1-SNAPSHOT</version>
<packaging>jar</packaging>
<description>Demo project for Spring Boot with H2 Database</description>
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.3</version>
    <relativePath/>
</parent>
<properties>
    <java.version>1.8</java.version>
</properties>
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-ui</artifactId>
        <version>1.6.15</version>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.20</version>
        <scope>provided</scope>
    </dependency>
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>1.4.2.Final</version>
    </dependency>
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct-processor</artifactId>
        <version>1.4.2.Final</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.8.1</version>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
                <compilerArgs>
                    <arg>-Xlint:unchecked</arg>
                </compilerArgs>
                <annotationProcessorPaths>
                    <path>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok</artifactId>
                        <version>1.18.20</version>
                    </path>
                    <path>
                        <groupId>org.mapstruct</groupId>
                        <artifactId>mapstruct-processor</artifactId>
                        <version>1.4.2.Final</version>
                    </path>
                </annotationProcessorPaths>
            </configuration>
        </plugin>
    </plugins>
</build>
</project>
`;
  writeToFile(`${projectDir}/pom.xml`, content);
};

// Generar application.properties
const generateApplicationProperties = () => {
  const { username, password, host } = config.databaseConfig;
  const content = `
# H2 Database configuration
spring.datasource.url=${host}
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=${username}
spring.datasource.password=${password}
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect

# Ensure that schema.sql and data.sql are always run
spring.datasource.initialization-mode=always
spring.jpa.hibernate.ddl-auto=none

# Logging configuration
logging.file.name=logs/application.log
logging.level.com.example.usuarios=INFO
`;
  writeToFile(`${projectDir}/src/main/resources/application.properties`, content);
};

// Generar SearchCriteriaDTO.java
const generateSearchCriteriaDTO = () => {
  const { packageName } = config;
  const content = `
package ${packageName}.dto;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class SearchCriteriaDTO {

    private Map<String, Map<String, Object>> criteria = new HashMap<>();
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/dto/SearchCriteriaDTO.java`, content);
};

// Generar UsuariosApplication.java
const generateAppClass = () => {
  const { packageName, appClassName } = config;
  const content = `
package ${packageName};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ${appClassName} {

    public static void main(String[] args) {
        SpringApplication.run(${appClassName}.class, args);
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/${appClassName}.java`, content);
};

// Generar UsuariosId.java (Clave compuesta)
const generateUsuariosId = () => {
  const { packageName, entityName, entityFields } = config;

  const primaryKeyFields = entityFields
    .filter(field => field.isPrimaryKey === 'Y')
    .map(field => `    @Column(name = "${field.columnName}", nullable = false)\n    private ${field.type} ${field.nameEntity};`)
    .join('\n');

  const primaryKeyGettersAndSetters = entityFields
    .filter(field => field.isPrimaryKey === 'Y')
    .map(field => `
    public ${field.type} get${capitalize(field.nameEntity)}() {
        return ${field.nameEntity};
    }

    public void set${capitalize(field.nameEntity)}(${field.type} ${field.nameEntity}) {
        this.${field.nameEntity} = ${field.nameEntity};
    }`)
    .join('\n');

  const content = `
package ${packageName}.model;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class ${entityName}Id implements Serializable {

${primaryKeyFields}

${primaryKeyGettersAndSetters}

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ${entityName}Id that = (${entityName}Id) o;

        // Check all fields for equality
        return ${entityFields.filter(field => field.isPrimaryKey === 'Y').map(field => `this.${field.nameEntity}.equals(that.${field.nameEntity})`).join(' && ')};
    }

    @Override
    public int hashCode() {
        int result = ${entityFields.filter(field => field.isPrimaryKey === 'Y').map(field => `this.${field.nameEntity}.hashCode()`).join(' ^ ')};
        return result;
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/model/${entityName}Id.java`, content);
};

const generateModel = () => {
  const { packageName, entityName, entityFields, tableName } = config;

  // Crear las definiciones de los campos no primarios
  const nonPrimaryKeyFields = entityFields
    .filter(field => field.isPrimaryKey !== 'Y')
    .map(field => {
      let annotations = `    @Column(name = "${field.columnName}"`;
      if (field.isNotNull === 'Y') {
        annotations += `, nullable = false`;
      }
      annotations += `)\n    private ${field.type} ${field.nameEntity};`;
      return annotations;
    }).join('\n');

  // Crear los getters y setters para los campos no primarios
  const nonPrimaryKeyGettersAndSetters = entityFields
    .filter(field => field.isPrimaryKey !== 'Y')
    .map(field => `
    public ${field.type} get${capitalize(field.nameEntity)}() {
        return ${field.nameEntity};
    }

    public void set${capitalize(field.nameEntity)}(${field.type} ${field.nameEntity}) {
        this.${field.nameEntity} = ${field.nameEntity};
    }`)
    .join('\n');

  // Contenido final de la clase de modelo
  const content = `
package ${packageName}.model;

import javax.persistence.*;

@Entity
@Table(name = "${tableName}")
public class ${entityName} {

    @EmbeddedId
    private ${entityName}Id id;

${nonPrimaryKeyFields}

    public ${entityName}Id getId() {
        return id;
    }

    public void setId(${entityName}Id id) {
        this.id = id;
    }

${nonPrimaryKeyGettersAndSetters}
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/model/${entityName}.java`, content);
};

// Generar WrapperKey.java dinámicamente
const generateWrapperKey = () => {
  const { packageName, entityFields } = config;
  
  const primaryKeys = entityFields
    .filter(field => field.isPrimaryKey === 'Y')
    .map(field => `    private ${field.type} ${field.name};`)
    .join('\n');

  const content = `
package ${packageName}.dto;

import lombok.Data;

@Data
public class WrapperKey {
${primaryKeys}
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/dto/WrapperKey.java`, content);
};

// Generar UsuariosRepository.java
const generateRepository = () => {
  const { packageName, repositoryName, entityName } = config;

  const content = `
package ${packageName}.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ${packageName}.model.${entityName};
import ${packageName}.model.${entityName}Id;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ${repositoryName} extends JpaRepository<${entityName}, ${entityName}Id>, JpaSpecificationExecutor<${entityName}> {
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/repository/${repositoryName}.java`, content);
};

const generateService = () => {
  const { packageName, serviceName, entityName, repositoryName, entityFields } = config;

  const primaryKeySetters = entityFields
    .filter(field => field.isPrimaryKey === 'Y')
    .map(field => `        id.set${capitalize(field.nameEntity)}(key.get${capitalize(field.name)}());`)
    .join('\n');

  const generateGetPathMethod = () => {
    const primaryKeys = entityFields
      .filter(field => field.isPrimaryKey === 'Y')
      .map(field => `
            case "${field.name}":
                return root.get("id").get("${field.nameEntity}");`)
      .join('\n');

    return `
    private Path<?> getPath(Root<${entityName}> root, String key) {
        switch (key) {
            ${primaryKeys}
            default:
                return root.get(key);
        }
    }`;
  };

  const content = `
package ${packageName}.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import ${packageName}.dto.SearchCriteriaDTO;
import ${packageName}.dto.WrapperKey;
import ${packageName}.model.${entityName};
import ${packageName}.model.${entityName}Id;
import ${packageName}.repository.${repositoryName};
import ${packageName}.exception.ResourceNotFoundException;

import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ${serviceName} {

    @Autowired
    private ${repositoryName} ${repositoryName.substring(0, 1).toLowerCase() + repositoryName.substring(1)};

    public ${entityName} findByKeys(WrapperKey key) throws ResourceNotFoundException {
        ${entityName}Id id = new ${entityName}Id();
${primaryKeySetters}
        ${entityName} probe = new ${entityName}();
        probe.setId(id);
        Example<${entityName}> example = Example.of(probe);

        return ${repositoryName.substring(0, 1).toLowerCase() + repositoryName.substring(1)}.findOne(example)
                .orElseThrow(() -> new ResourceNotFoundException("${entityName} not found with provided keys"));
    }

    public Page<${entityName}> search(SearchCriteriaDTO criteria, Pageable pageable) {
        Specification<${entityName}> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            for (Map.Entry<String, Map<String, Object>> entry : criteria.getCriteria().entrySet()) {
                String key = entry.getKey();
                Map<String, Object> valueMap = entry.getValue();
                Path<?> path = getPath(root, key);

                for (Map.Entry<String, Object> valueEntry : valueMap.entrySet()) {
                    String operation = valueEntry.getKey();
                    Object value = valueEntry.getValue();
                    switch (operation) {
                        case "like":
                            predicates.add(cb.like(path.as(String.class), "%" + value + "%"));
                            break;
                        case "eq":
                            predicates.add(cb.equal(path, value));
                            break;
                        case "neq":
                            predicates.add(cb.notEqual(path, value));
                            break;
                        case "gt":
                            predicates.add(cb.greaterThan(path.as((Class<? extends Comparable>) value.getClass()), (Comparable) value));
                            break;
                        case "lt":
                            predicates.add(cb.lessThan(path.as((Class<? extends Comparable>) value.getClass()), (Comparable) value));
                            break;
                        case "gte":
                            predicates.add(cb.greaterThanOrEqualTo(path.as((Class<? extends Comparable>) value.getClass()), (Comparable) value));
                            break;
                        case "lte":
                            predicates.add(cb.lessThanOrEqualTo(path.as((Class<? extends Comparable>) value.getClass()), (Comparable) value));
                            break;
                        case "in":
                            predicates.add(path.in((List<?>) value));
                            break;
                        case "notIn":
                            predicates.add(cb.not(path.in((List<?>) value)));
                            break;
                    }
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return ${repositoryName.substring(0, 1).toLowerCase() + repositoryName.substring(1)}.findAll(spec, pageable);
    }

    ${generateGetPathMethod()}

    public ${entityName} save(${entityName} entity) {
        return ${repositoryName.substring(0, 1).toLowerCase() + repositoryName.substring(1)}.save(entity);
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/service/${serviceName}.java`, content);
};

// Generar UsuariosController.java
const generateController = () => {
  const { packageName, controllerName, serviceName, entityName, urlName, entityFields , findByKeys, search } = config;

  const requestParams = entityFields
    .filter(field => field.isPrimaryKey === 'Y')
    .map(field => `            @RequestParam(required = false) ${field.type} ${field.name}`)
    .join(',\n');

  const keySetters = entityFields
    .filter(field => field.isPrimaryKey === 'Y')
    .map(field => `        key.set${capitalize(field.name)}(${field.name});`)
    .join('\n');

  const content = `
package ${packageName}.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ${packageName}.dto.SearchCriteriaDTO;
import ${packageName}.dto.WrapperKey;
import ${packageName}.dto.${entityName}Dto;
import ${packageName}.mapper.${entityName}Mapper;
import ${packageName}.service.${serviceName};
import ${packageName}.model.${entityName};

@RestController
@RequestMapping("/${urlName}")
public class ${controllerName} {

    @Autowired
    private ${serviceName} ${serviceName.substring(0, 1).toLowerCase() + serviceName.substring(1)};

    @Autowired
    private ${entityName}Mapper ${entityName.toLowerCase()}Mapper;

    @GetMapping("/${findByKeys}")
    public ResponseEntity<${entityName}Dto> findByKeys(
${requestParams}) {
        WrapperKey key = new WrapperKey();
${keySetters}
        return ResponseEntity.ok(${entityName.toLowerCase()}Mapper.toDto(${serviceName.substring(0, 1).toLowerCase() + serviceName.substring(1)}.findByKeys(key)));
    }

    @PostMapping("/${search}")
    public ResponseEntity<Page<${entityName}Dto>> search(@RequestBody SearchCriteriaDTO criteria, @PageableDefault Pageable pageable) {
        Page<${entityName}> resultPage = ${serviceName.substring(0, 1).toLowerCase() + serviceName.substring(1)}.search(criteria, pageable);
        return ResponseEntity.ok(resultPage.map(${entityName.toLowerCase()}Mapper::toDto));
    }

    @PostMapping
    public ResponseEntity<${entityName}Dto> create(@RequestBody ${entityName}Dto ${entityName.toLowerCase()}Dto) {
        ${entityName} ${entityName.toLowerCase()} = ${entityName.toLowerCase()}Mapper.toEntity(${entityName.toLowerCase()}Dto);
        ${entityName} saved${entityName} = ${serviceName.substring(0, 1).toLowerCase() + serviceName.substring(1)}.save(${entityName.toLowerCase()});
        return ResponseEntity.ok(${entityName.toLowerCase()}Mapper.toDto(saved${entityName}));
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/controller/${controllerName}.java`, content);
};

// Generar UsuariosDto.java
const generateDto = () => {
  const { packageName, dtoName, entityFields } = config;
  const fields = entityFields.map(field => `    private ${field.type} ${field.name};`).join('\n');

  const content = `
package ${packageName}.dto;

import lombok.Data;

@Data
public class ${dtoName} {
${fields}
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/dto/${dtoName}.java`, content);
};

// Generar UsuariosMapper.java
const generateMapper = () => {
  const { packageName, entityName, dtoName, mapperName, entityFields } = config;

  // Mapear los campos de DTO a DAO
  const dtoToDaoMappings = entityFields
    .filter(field => field.isPrimaryKey !== 'Y')
    .map(field => `    @Mapping(source = "${field.name}", target = "${field.nameEntity}")`)
    .join('\n');
  
  const daoToDtoMappings = entityFields
    .filter(field => field.isPrimaryKey !== 'Y')
    .map(field => `    @Mapping(source = "${field.nameEntity}", target = "${field.name}")`)
    .join('\n');

  // Mapear los campos de clave primaria compuesta de DTO a DAO
  const dtoToDaoIdMappings = entityFields
    .filter(field => field.isPrimaryKey === 'Y')
    .map(field => `    @Mapping(source = "${field.name}", target = "id.${field.nameEntity}")`)
    .join('\n');
  
  const daoToDtoIdMappings = entityFields
    .filter(field => field.isPrimaryKey === 'Y')
    .map(field => `    @Mapping(source = "id.${field.nameEntity}", target = "${field.name}")`)
    .join('\n');

  const content = `
package ${packageName}.mapper;

import ${packageName}.dto.${dtoName};
import ${packageName}.model.${entityName};
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ${mapperName} {

${daoToDtoIdMappings}
${daoToDtoMappings}
    ${dtoName} toDto(${entityName} entity);

${dtoToDaoIdMappings}
${dtoToDaoMappings}
    ${entityName} toEntity(${dtoName} dto);
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/mapper/${mapperName}.java`, content);
};

// Generar ResourceNotFoundException.java
const generateException = () => {
  const { packageName, exceptionName } = config;
  const content = `
package ${packageName}.exception;

public class ${exceptionName} extends RuntimeException {
    public ${exceptionName}(String message) {
        super(message);
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/exception/${exceptionName}.java`, content);
};

// Generar BadRequestException.java
const generateBadRequestException = () => {
  const { packageName, exceptionNameBadRequest } = config;
  const content = `
package ${packageName}.exception;

public class ${exceptionNameBadRequest} extends RuntimeException {
    public ${exceptionNameBadRequest}(String message) {
        super(message);
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/exception/${exceptionNameBadRequest}.java`, content);
};

// Generar GlobalExceptionHandler.java
const generateExceptionHandler = () => {
  const { packageName, handlerName, exceptionName, exceptionNameBadRequest } = config;
  const content = `
package ${packageName}.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@ControllerAdvice
public class ${handlerName} {

    @ExceptionHandler(${exceptionName}.class)
    public ResponseEntity<String> handleResourceNotFoundException(${exceptionName} ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(${exceptionNameBadRequest}.class)
    public ResponseEntity<String> handleBadRequestException(${exceptionNameBadRequest} ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<String> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException ex) {
        String message = String.format("The parameter '%s' of value '%s' could not be converted to type '%s'", 
ex.getName(), ex.getValue(), ex.getRequiredType().getSimpleName());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/exception/${handlerName}.java`, content);
};

// Generar schema.sql
const generateSchemaSql = () => {
  const { tableName, entityFields } = config;

  const columns = entityFields.map(field => {
    let columnDefinition = `${field.columnName} ${mapJavaTypeToSqlType(field.type)}`;
    if (field.isNotNull === 'Y') {
      columnDefinition += ' NOT NULL';
    }
    return columnDefinition;
  }).join(',\n    ');

  const primaryKeys = entityFields
    .filter(field => field.isPrimaryKey === 'Y')
    .map(field => field.columnName)
    .join(', ');

  const content = `
CREATE TABLE ${tableName} (
    ${columns},
    PRIMARY KEY (${primaryKeys})
);
`;
  writeToFile(`${config.projectName}/src/main/resources/schema.sql`, content);
};

// Función para mapear tipos de Java a tipos de SQL
const mapJavaTypeToSqlType = (javaType) => {
  const typeMap = {
    "Long": "NUMBER(19)",
    "String": "VARCHAR(255)",
    "Double": "FLOAT",
    "Integer": "NUMBER(10)"
  };
  return typeMap[javaType] || javaType.toUpperCase();
};

// Generar README.md
const generateReadme = () => {
  const { projectName, urlName, entityFields , findByKeys, search } = config;

  // Extraer los nombres de los campos de la entidad que son claves primarias
  const primaryKeyFields = entityFields
    .filter(field => field.isPrimaryKey === 'Y')
    .map(field => field.name);

  // Crear la cadena de parámetros de consulta para la búsqueda por claves
  const queryParams = primaryKeyFields
    .map(field => `${field}={${field}}`)
    .join('&');

  // Crear un ejemplo de cuerpo de solicitud JSON para la búsqueda con criterios
  const criteriaExample = entityFields
    .map(field => `"${field.name}": { "eq": "value" }`)
    .join(',\n    ');

  const content = `
# ${projectName}

Este proyecto es una aplicación Spring Boot con una base de datos H2 integrada.

## Configuración

Asegúrate de tener Docker y Docker Compose instalados en tu máquina.

## Construcción

Para construir el proyecto, ejecuta:

\`\`\`bash
mvn clean package
\`\`\`

## Ejecución

Para ejecutar el proyecto, usa:

\`\`\`bash
mvn spring-boot:run
\`\`\`

## Endpoints

### Buscar por Claves

\`\`\`bash
curl -X GET "http://localhost:8080/${urlName}/${findByKeys}?${queryParams}"
\`\`\`

### Buscar con Criterios

\`\`\`bash
curl -X POST "http://localhost:8080/${urlName}/${search}" -H "Content-Type: application/json" -d '{
  "criteria": {
    ${criteriaExample}
  }
}'
\`\`\`
`;
  writeToFile(`${projectDir}/README.md`, content);
};

// Ejecutar la generación de todos los archivos
const generateProjectFiles = () => {
  generatePomXml();
  generateApplicationProperties();
  generateSearchCriteriaDTO();
  generateAppClass();
  generateUsuariosId();
  generateModel();
  generateWrapperKey();
  generateRepository();
  generateService();
  generateController();
  generateDto();
  generateMapper();
  generateException();
  generateBadRequestException();
  generateExceptionHandler();
  generateSchemaSql();
  generateReadme();
};

generateProjectFiles();
