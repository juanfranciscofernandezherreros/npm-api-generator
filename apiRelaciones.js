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
  return subDirs.map(dir => `${config.projectName}/src/main/java/${packagePath}/${dir}`).concat(
    subDirs.map(dir => `${config.projectName}/src/test/java/${packagePath}/${dir}`)
  ).concat(`${config.projectName}/src/main/resources`);
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
    <junit.jupiter.version>5.7.0</junit.jupiter.version>
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
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-engine</artifactId>
        <version>\${junit.jupiter.version}</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-api</artifactId>
        <version>\${junit.jupiter.version}</version>
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
        <plugin>
            <groupId>org.jacoco</groupId>
            <artifactId>jacoco-maven-plugin</artifactId>
            <version>0.8.7</version>
            <executions>
                <execution>
                    <goals>
                        <goal>prepare-agent</goal>
                    </goals>
                </execution>
                <execution>
                    <id>report</id>
                    <phase>prepare-package</phase>
                    <goals>
                        <goal>report</goal>
                    </goals>
                </execution>
            </executions>
            <configuration>
                <excludes>
                    <exclude>**/*_$$_*</exclude>
                    <exclude>**/*_Lombok*.*</exclude>
                    <exclude>**/*$GeneratedByLombok*.*</exclude>
                </excludes>
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
  const { url, username, password } = config.databaseConfig;
  const content = `
# H2 Database configuration
spring.datasource.url=${url}
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=${username}
spring.datasource.password=${password}
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect

# Ensure that schema.sql and data.sql are always run
spring.datasource.initialization-mode=always
spring.jpa.hibernate.ddl-auto=update

# H2 Console settings
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# Logging configuration
logging.file.name=logs/application.log
logging.level.${config.packageName}=INFO
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

// Generar MyApplication.java
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

// Generar entidades y otros archivos relacionados
const generateEntitiesAndRelatedFiles = () => {
  config.entities.forEach(entity => {
    const { packageName } = config;
    const { entityName, tableName, entityFields, urlName, relations } = entity;

    // Generar archivo de entidad
    const generateEntity = () => {
      const fields = entityFields.map(field => {
        let annotations = `    @Column(name = "${field.columnName}"`;
        if (field.isNotNull === 'Y') {
          annotations += `, nullable = false`;
        }
        annotations += `)\n    private ${field.type} ${field.name};`;
        return annotations;
      }).join('\n');

      const relationMappings = (relations || []).map(relation => {
        switch (relation.relationType) {
          case 'OneToOne':
            return `    @OneToOne(mappedBy = "${relation.mappedBy}")\n    private ${relation.targetEntity} ${relation.targetEntity.toLowerCase()};`;
          case 'OneToMany':
            return `    @OneToMany(mappedBy = "${relation.mappedBy}")\n    private Set<${relation.targetEntity}> ${relation.targetEntity.toLowerCase()}s;`;
          case 'ManyToOne':
            return `    @ManyToOne\n    @JoinColumn(name = "${relation.mappedBy}")\n    private ${relation.targetEntity} ${relation.targetEntity.toLowerCase()};`;
          case 'ManyToMany':
            return `    @ManyToMany\n    @JoinTable(name = "${tableName}_${relation.targetEntity.toUpperCase()}",\n        joinColumns = @JoinColumn(name = "${entityName.toUpperCase()}_ID"),\n        inverseJoinColumns = @JoinColumn(name = "${relation.targetEntity.toUpperCase()}_ID"))\n    private Set<${relation.targetEntity}> ${relation.targetEntity.toLowerCase()}s;`;
          default:
            return '';
        }
      }).join('\n');

      const content = `
package ${packageName}.model;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "${tableName}")
public class ${entityName} {

    @Id
${fields}

${relationMappings}

    // Getters y setters
}
`;
      writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/model/${entityName}.java`, content);
    };

    // Generar archivo de DTO
    const generateDto = () => {
      const fields = entityFields.map(field => `    private ${field.type} ${field.name};`).join('\n');

      const content = `
package ${packageName}.dto;

import lombok.Data;

@Data
public class ${entityName}Dto {
${fields}
}
`;
      writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/dto/${entityName}Dto.java`, content);
    };

    // Generar archivo de repositorio
    const generateRepository = () => {
      const content = `
package ${packageName}.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ${packageName}.model.${entityName};

public interface ${entityName}Repository extends JpaRepository<${entityName}, Long> {
}
`;
      writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/repository/${entityName}Repository.java`, content);
    };

    // Generar archivo de servicio
    const generateService = () => {
      const content = `
package ${packageName}.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ${packageName}.dto.SearchCriteriaDTO;
import ${packageName}.model.${entityName};
import ${packageName}.repository.${entityName}Repository;
import ${packageName}.exception.${config.commonConfig.exceptionName};

import java.util.Optional;

@Service
public class ${entityName}Service {

    @Autowired
    private ${entityName}Repository ${entityName.toLowerCase()}Repository;

    public ${entityName} findById(Long id) throws ${config.commonConfig.exceptionName} {
        return ${entityName.toLowerCase()}Repository.findById(id)
                .orElseThrow(() -> new ${config.commonConfig.exceptionName}("${entityName} not found with id " + id));
    }

    public Page<${entityName}> search(SearchCriteriaDTO criteria, Pageable pageable) {
        // Implement search logic here
        return ${entityName.toLowerCase()}Repository.findAll(pageable);
    }

    public ${entityName} save(${entityName} entity) {
        return ${entityName.toLowerCase()}Repository.save(entity);
    }
}
`;
      writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/service/${entityName}Service.java`, content);
    };

    // Generar archivo de controlador
    const generateController = () => {
      const content = `
package ${packageName}.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ${packageName}.dto.SearchCriteriaDTO;
import ${packageName}.dto.${entityName}Dto;
import ${packageName}.mapper.${entityName}Mapper;
import ${packageName}.service.${entityName}Service;
import ${packageName}.model.${entityName};

@RestController
@RequestMapping("/${urlName}")
public class ${entityName}Controller {

    @Autowired
    private ${entityName}Service ${entityName.toLowerCase()}Service;

    @Autowired
    private ${entityName}Mapper ${entityName.toLowerCase()}Mapper;

    @GetMapping("/{id}")
    public ResponseEntity<${entityName}Dto> findById(@PathVariable Long id) {
        ${entityName} ${entityName.toLowerCase()} = ${entityName.toLowerCase()}Service.findById(id);
        return ResponseEntity.ok(${entityName.toLowerCase()}Mapper.toDto(${entityName.toLowerCase()}));
    }

    @PostMapping("/${config.commonConfig.search}")
    public ResponseEntity<Page<${entityName}Dto>> search(@RequestBody SearchCriteriaDTO criteria, Pageable pageable) {
        Page<${entityName}> resultPage = ${entityName.toLowerCase()}Service.search(criteria, pageable);
        return ResponseEntity.ok(resultPage.map(${entityName.toLowerCase()}Mapper::toDto));
    }

    @PostMapping
    public ResponseEntity<${entityName}Dto> create(@RequestBody ${entityName}Dto ${entityName.toLowerCase()}Dto) {
        ${entityName} ${entityName.toLowerCase()} = ${entityName.toLowerCase()}Mapper.toEntity(${entityName.toLowerCase()}Dto);
        ${entityName} saved${entityName} = ${entityName.toLowerCase()}Service.save(${entityName.toLowerCase()});
        return ResponseEntity.ok(${entityName.toLowerCase()}Mapper.toDto(saved${entityName}));
    }
}
`;
      writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/controller/${entityName}Controller.java`, content);
    };

    // Generar archivo de mapper
    const generateMapper = () => {
      const content = `
package ${packageName}.mapper;

import ${packageName}.dto.${entityName}Dto;
import ${packageName}.model.${entityName};
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ${entityName}Mapper {

    ${entityName}Dto toDto(${entityName} entity);

    ${entityName} toEntity(${entityName}Dto dto);
}
`;
      writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/mapper/${entityName}Mapper.java`, content);
    };

    // Generar archivo de excepción
    const generateException = () => {
      const content = `
package ${packageName}.exception;

public class ${config.commonConfig.exceptionName} extends RuntimeException {
    public ${config.commonConfig.exceptionName}(String message) {
        super(message);
    }
}
`;
      writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/exception/${config.commonConfig.exceptionName}.java`, content);
    };

    // Generar archivo de excepción para solicitudes incorrectas
    const generateBadRequestException = () => {
      const content = `
package ${packageName}.exception;

public class ${config.commonConfig.exceptionNameBadRequest} extends RuntimeException {
    public ${config.commonConfig.exceptionNameBadRequest}(String message) {
        super(message);
    }
}
`;
      writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/exception/${config.commonConfig.exceptionNameBadRequest}.java`, content);
    };

    // Generar archivo de manejador de excepciones global
    const generateExceptionHandler = () => {
      const content = `
package ${packageName}.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@ControllerAdvice
public class ${config.commonConfig.handlerName} {

    @ExceptionHandler(${config.commonConfig.exceptionName}.class)
    public ResponseEntity<String> handleResourceNotFoundException(${config.commonConfig.exceptionName} ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(${config.commonConfig.exceptionNameBadRequest}.class)
    public ResponseEntity<String> handleBadRequestException(${config.commonConfig.exceptionNameBadRequest} ex) {
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
      writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/exception/${config.commonConfig.handlerName}.java`, content);
    };

    // Generar todos los archivos relacionados
    generateEntity();
    generateDto();
    generateRepository();
    generateService();
    generateController();
    generateMapper();
    generateException();
    generateBadRequestException();
    generateExceptionHandler();
  });
};

// Generar schema.sql
const generateSchemaSql = () => {
  const content = config.entities.map(entity => {
    const { tableName, entityFields } = entity;
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

    return `
CREATE TABLE ${tableName} (
    ${columns},
    PRIMARY KEY (${primaryKeys})
);`;
  }).join('\n');

  writeToFile(`${config.projectName}/src/main/resources/schema.sql`, content);
};

// Función para mapear tipos de Java a tipos de SQL
const mapJavaTypeToSqlType = (javaType) => {
  const typeMap = {
    "Long": "BIGINT",
    "String": "VARCHAR(255)",
    "Double": "DOUBLE",
    "Integer": "INT",
    "Date": "DATE"
  };
  return typeMap[javaType] || javaType.toUpperCase();
};

// Generar Dockerfile
const generateDockerfile = () => {
  const artifactId = config.projectName.toLowerCase();
  const version = "0.0.1-SNAPSHOT";
  const packaging = "jar";
  const jarFileName = `${artifactId}-${version}.${packaging}`;

  const content = `
# Etapa 1: Construcción
FROM maven:3.8.6-openjdk-8 AS build

# Establecer el directorio de trabajo en /app
WORKDIR /app

# Copiar el archivo de configuración de Maven
COPY pom.xml .

# Descargar las dependencias necesarias para la construcción
RUN mvn dependency:go-offline

# Copiar el resto del código fuente
COPY src ./src

# Construir el proyecto
RUN mvn clean package

# Etapa 2: Ejecución
FROM openjdk:8-jdk-alpine

# Establecer el directorio de trabajo en /app
WORKDIR /app

# Copiar el archivo JAR de la etapa de construcción
COPY --from=build /app/target/${jarFileName} ${jarFileName}

# Exponer el puerto en el que la aplicación se ejecutará
EXPOSE 8080

# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "${jarFileName}"]

  `;
  writeToFile(`${projectDir}/Dockerfile`, content);
};

// Generar .dockerignore
const generateDockerignore = () => {
  const content = `
target/
*.jar
*.war
*.zip
*.tar.gz
*.iml
.DS_Store
.idea/
.git/
  `;
  writeToFile(`${projectDir}/.dockerignore`, content);
};

// Generar README.md
const generateReadme = () => {
  const { projectName, commonConfig } = config;
  const endpointExamples = config.entities.map(entity => {
    const { urlName, entityFields } = entity;
    const primaryKeyFields = entityFields.filter(field => field.isPrimaryKey === 'Y').map(field => field.name);
    const queryParams = primaryKeyFields.map(field => `${field}={${field}}`).join('&');
    const criteriaExample = entityFields.map(field => `"${field.name}": { "eq": "value" }`).join(',\n    ');

    return `
### ${entity.entityName} Endpoints

#### Buscar por Claves

\`\`\`bash
curl -X GET "http://localhost:8080/${urlName}/${commonConfig.findByKeys}?${queryParams}"
\`\`\`

#### Buscar con Criterios

\`\`\`bash
curl -X POST "http://localhost:8080/${urlName}/${commonConfig.search}" -H "Content-Type: application/json" -d '{
  "criteria": {
    ${criteriaExample}
  }
}'
\`\`\`
`;
  }).join('\n');

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

Para ejecutar el proyecto, usa Docker Compose:

\`\`\`bash
docker-compose up
\`\`\`

## Endpoints

${endpointExamples}
`;
  writeToFile(`${projectDir}/README.md`, content);
};

// Ejecutar la generación de todos los archivos
const generateProjectFiles = () => {
  generatePomXml();
  generateApplicationProperties();
  generateSearchCriteriaDTO();
  generateAppClass();
  generateEntitiesAndRelatedFiles();
  generateSchemaSql();
  generateDockerfile();
  generateDockerignore();
  generateReadme();
};

generateProjectFiles();
