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
    <name>${config.projectName}</name>
    <description>Demo project for Spring Boot with H2 Database</description>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.3</version>
        <relativePath/>
    </parent>
    <properties>
        <java.version>11</java.version>
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
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!-- SpringDoc OpenAPI dependency -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-ui</artifactId>
            <version>1.6.15</version>
        </dependency>
        <!-- Lombok dependency -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.20</version>
            <scope>provided</scope>
        </dependency>
        <!-- MapStruct dependencies -->
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
</project>`;
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
spring.h2.console.enabled=true

# Ensure that schema.sql and data.sql are always run
spring.datasource.initialization-mode=always
spring.jpa.hibernate.ddl-auto=none

# Logging configuration
logging.file.name=logs/application.log
logging.level.${config.packageName}=INFO
`;
  writeToFile(`${projectDir}/src/main/resources/application.properties`, content);
};

// Generar MovieLibraryApplication.java
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

// Generar Movie.java
const generateModel = () => {
  const { packageName, entityName, entityFields, tableName } = config;

  const fields = entityFields.map(field => {
    let annotations = '';
    if (field.isPrimaryKey === 'Y') {
      annotations += '    @Id\n';
      if (field.isAutoIncrement === 'Y') {
        annotations += '    @GeneratedValue(strategy = GenerationType.IDENTITY)\n';
      }
    }
    if (field.isNotNull === 'Y') {
      annotations += '    @Column(nullable = false)\n';
    }
    return `${annotations}    private ${field.type} ${field.name};`;
  }).join('\n');

  const content = `
package ${packageName}.model;

import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "${tableName}")
@Data
public class ${entityName} {

${fields}

}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/model/${entityName}.java`, content);
};


// Generar MovieRepository.java
const generateRepository = () => {
  const { packageName, repositoryName, entityName } = config;
  const content = `
package ${packageName}.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ${packageName}.model.${entityName};

public interface ${repositoryName} extends JpaRepository<${entityName}, Long> {
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/repository/${repositoryName}.java`, content);
};

// Generar MovieService.java
const generateService = () => {
  const { packageName, serviceName, repositoryName, entityName, idType, idField } = config;
  const content = `
package ${packageName}.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ${packageName}.model.${entityName};
import ${packageName}.repository.${repositoryName};
import ${packageName}.exception.${config.exceptionName};
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Expression;
import java.util.ArrayList;
import java.util.Map;
import ${packageName}.dto.${entityName}GroupedDTO;

@Service
public class ${serviceName} {

    @Autowired
    private ${repositoryName} ${repositoryName.substring(0, 1).toLowerCase() + repositoryName.substring(1)};

    @PersistenceContext
    private EntityManager entityManager;

    public ${entityName} findById(${idType} ${idField}) throws ${config.exceptionName} {
        return ${repositoryName.substring(0, 1).toLowerCase() + repositoryName.substring(1)}.findById(${idField})
                .orElseThrow(() -> new ${config.exceptionName}("${entityName} not found with id: " + ${idField}));
    }

    public List<${entityName}> findAll() {
        return ${repositoryName.substring(0, 1).toLowerCase() + repositoryName.substring(1)}.findAll();
    }

    public Page<${entityName}> filterMovies(Map<String, Map<String, Object>> filters, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<${entityName}> query = cb.createQuery(${entityName}.class);
        Root<${entityName}> root = query.from(${entityName}.class);

        List<Predicate> predicates = new ArrayList<>();

        filters.forEach((field, operations) -> {
            operations.forEach((operator, value) -> {
                switch (operator) {
                    case "eq":
                        predicates.add(cb.equal(root.get(field), value));
                        break;
                    case "neq":
                        predicates.add(cb.notEqual(root.get(field), value));
                        break;
                    case "gt":
                        predicates.add(cb.greaterThan(root.get(field), (Comparable) value));
                        break;
                    case "lt":
                        predicates.add(cb.lessThan(root.get(field), (Comparable) value));
                        break;
                    case "gte":
                        predicates.add(cb.greaterThanOrEqualTo(root.get(field), (Comparable) value));
                        break;
                    case "lte":
                        predicates.add(cb.lessThanOrEqualTo(root.get(field), (Comparable) value));
                        break;
                    case "like":
                        predicates.add(cb.like(root.get(field), "%" + value + "%"));
                        break;
                    case "in":
                        predicates.add(root.get(field).in((List<?>) value));
                        break;
                    case "notIn":
                        predicates.add(cb.not(root.get(field).in((List<?>) value)));
                        break;
                    case "isNull":
                        if ((Boolean) value) {
                            predicates.add(cb.isNull(root.get(field)));
                        }
                        break;
                    case "isNotNull":
                        if ((Boolean) value) {
                            predicates.add(cb.isNotNull(root.get(field)));
                        }
                        break;
                    // Agrega más operadores según sea necesario
                }
            });
        });

        query.where(predicates.toArray(new Predicate[0]));

        List<${entityName}> resultList = entityManager.createQuery(query)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<${entityName}> countRoot = countQuery.from(${entityName}.class);
        countQuery.select(cb.count(countRoot)).where(predicates.toArray(new Predicate[0]));
        Long count = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(resultList, pageable, count);
    }

    public List<${entityName}GroupedDTO> groupByField(String groupByField, Map<String, Map<String, Object>> filters) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<${entityName}GroupedDTO> query = cb.createQuery(${entityName}GroupedDTO.class);
        Root<${entityName}> root = query.from(${entityName}.class);

        List<Predicate> predicates = new ArrayList<>();

        filters.forEach((field, operations) -> {
            operations.forEach((operator, value) -> {
                switch (operator) {
                    case "eq":
                        predicates.add(cb.equal(root.get(field), value));
                        break;
                    case "neq":
                        predicates.add(cb.notEqual(root.get(field), value));
                        break;
                    case "gt":
                        predicates.add(cb.greaterThan(root.get(field), (Comparable) value));
                        break;
                    case "lt":
                        predicates.add(cb.lessThan(root.get(field), (Comparable) value));
                        break;
                    case "gte":
                        predicates.add(cb.greaterThanOrEqualTo(root.get(field), (Comparable) value));
                        break;
                    case "lte":
                        predicates.add(cb.lessThanOrEqualTo(root.get(field), (Comparable) value));
                        break;
                    case "like":
                        predicates.add(cb.like(root.get(field), "%" + value + "%"));
                        break;
                    case "in":
                        predicates.add(root.get(field).in((List<?>) value));
                        break;
                    case "notIn":
                        predicates.add(cb.not(root.get(field).in((List<?>) value)));
                        break;
                    case "isNull":
                        if ((Boolean) value) {
                            predicates.add(cb.isNull(root.get(field)));
                        }
                        break;
                    case "isNotNull":
                        if ((Boolean) value) {
                            predicates.add(cb.isNotNull(root.get(field)));
                        }
                        break;
                    // Agrega más operadores según sea necesario
                }
            });
        });

        query.where(predicates.toArray(new Predicate[0]));

        Expression<String> groupByExpression = root.get(groupByField);
        query.multiselect(groupByExpression, cb.count(root));
        query.groupBy(groupByExpression);

        return entityManager.createQuery(query).getResultList();
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/service/${serviceName}.java`, content);
};

// Generar MovieController.java
const generateController = () => {
  const { packageName, controllerName, serviceName, entityName, urlName, entityFields } = config;
  
  // Encontrar el campo que es clave primaria
  const idField = entityFields.find(field => field.isPrimaryKey === 'Y');

  if (!idField) {
    console.error('No se encontró ningún campo que sea clave primaria.');
    return;
  }

  const content = `
package ${packageName}.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ${packageName}.dto.${entityName}Dto;
import ${packageName}.dto.${entityName}GroupedDTO;
import ${packageName}.mapper.${entityName}Mapper;
import ${packageName}.service.${serviceName};
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import ${packageName}.model.${entityName};

@RestController
@RequestMapping("/${urlName}")
public class ${controllerName} {

    @Autowired
    private ${serviceName} ${serviceName.substring(0, 1).toLowerCase() + serviceName.substring(1)};

    @Autowired
    private ${entityName}Mapper ${entityName.toLowerCase()}Mapper;

    @GetMapping("/{id}")
    public ResponseEntity<${entityName}Dto> findById(@PathVariable ${idField.type} ${idField.name}) {
        return ResponseEntity.ok(${entityName.toLowerCase()}Mapper.toDto(${serviceName.substring(0, 1).toLowerCase() + serviceName.substring(1)}.findById(${idField.name})));
    }

    @GetMapping
    public ResponseEntity<List<${entityName}Dto>> findAll() {
        return ResponseEntity.ok(${serviceName.substring(0, 1).toLowerCase() + serviceName.substring(1)}.findAll().stream().map(${entityName.toLowerCase()}Mapper::toDto).collect(Collectors.toList()));
    }

    @PostMapping("/filter")
    public Page<${entityName}> filterMovies(
            @RequestBody Map<String, Map<String, Object>> filters,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ${serviceName.substring(0, 1).toLowerCase() + serviceName.substring(1)}.filterMovies(filters, pageable);
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/controller/${controllerName}.java`, content);
};


// Generar MovieDto.java
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

// Generar MovieGroupedDTO.java
const generateGroupedDto = () => {
  const { packageName, entityName } = config;
  const content = `
package ${packageName}.dto;

public class ${entityName}GroupedDTO {
    private String field;
    private Long count;

    public ${entityName}GroupedDTO(String field, Long count) {
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
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/dto/${entityName}GroupedDTO.java`, content);
};

// Generar MovieMapper.java
const generateMapper = () => {
  const { packageName, entityName, dtoName } = config;
  const content = `
package ${packageName}.mapper;

import ${packageName}.dto.${dtoName};
import ${packageName}.model.${entityName};
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ${entityName}Mapper {
    ${dtoName} toDto(${entityName} entity);
    ${entityName} toEntity(${dtoName} dto);
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/mapper/${entityName}Mapper.java`, content);
};

// Generar ResourceNotFoundException.java
const generateException = () => {
  const { packageName, exceptionName} = config;
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

// Generate BadRequestException.java
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
  const { packageName, handlerName, exceptionName ,exceptionNameBadRequest } = config;
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
  const content = `
CREATE TABLE movies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(255) NOT NULL,
    releaseYear INT NOT NULL,
    rating DOUBLE NOT NULL
);
  `;
  writeToFile(`${projectDir}/src/main/resources/schema.sql`, content);
};

// Generar data.sql
const generateDataSql = () => {
  const content = `
INSERT INTO movies (title, genre, releaseYear, rating) VALUES
('The Matrix', 'Sci-Fi', 1999, 8.7),
('The Godfather', 'Crime', 1972, 9.2);
  `;
  writeToFile(`${projectDir}/src/main/resources/data.sql`, content);
};

// Ejecutar la generación de todos los archivos
const generateProjectFiles = () => {
  generatePomXml();
  generateApplicationProperties();
  generateAppClass();
  generateModel();
  generateRepository();
  generateService();
  generateController();
  generateDto();
  generateGroupedDto();
  generateMapper();
  generateException();
  generateBadRequestException();
  generateExceptionHandler();
  generateSchemaSql();
  generateDataSql();
};

generateProjectFiles();
