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

const generatePomXml = () => {
  const { username, password, host, databaseName, driverClassName, platform } = config.databaseConfig;
  const content = `
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://www.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>${config.packageName}</groupId>
    <artifactId>${config.projectName.toLowerCase()}</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>jar</packaging>
    <name>${config.projectName}</name>
    <description>Demo project for Spring Boot with Database</description>
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
        <!-- Check for MySQL dialect and add MySQL dependency if needed -->
        ${platform === 'org.hibernate.dialect.MySQL8Dialect' ? `
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>
        ` : ''}
        <!-- Check for H2 dialect and add H2 dependency if needed -->
        ${platform === 'org.hibernate.dialect.H2Dialect' ? `
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        ` : ''}
        <!-- Check for Oracle dialect and add Oracle dependency if needed -->
        ${platform === 'org.hibernate.dialect.Oracle12cDialect' ? `
        <dependency>
            <groupId>com.oracle.database.jdbc</groupId>
            <artifactId>ojdbc8</artifactId>
            <scope>runtime</scope>
        </dependency>
        ` : ''}
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
                    <source>11</source>
                    <target>11</target>
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
</project>`;

  writeToFile(`${projectDir}/pom.xml`, content);
};

const generateApplicationProperties = () => {
  const { username, password, host, driverClassName, platform } = config.databaseConfig;
  const isMySQL = platform === 'org.hibernate.dialect.MySQL8Dialect';
  const isH2 = platform === 'org.hibernate.dialect.H2Dialect';
  const isOracle = platform === 'org.hibernate.dialect.Oracle12cDialect';

  const content = `
${isMySQL ? `
# MySQL Database configuration
spring.datasource.url=${host}
spring.datasource.driverClassName=${driverClassName}
spring.datasource.username=${username}
spring.datasource.password=${password}
spring.jpa.database-platform=${platform}
` : ''}

${isH2 ? `
# H2 Database configuration
spring.datasource.url=${host}
spring.datasource.driverClassName=${driverClassName}
spring.datasource.username=${username}
spring.datasource.password=${password}
spring.jpa.database-platform=${platform}
` : ''}

${isOracle ? `
# Oracle Database configuration
spring.datasource.url=${host}
spring.datasource.driverClassName=${driverClassName}
spring.datasource.username=${username}
spring.datasource.password=${password}
spring.jpa.database-platform=${platform}
` : ''}

# Ensure that schema.sql and data.sql are always run
spring.datasource.initialization-mode=always
spring.jpa.hibernate.ddl-auto=none

# Logging configuration
logging.file.name=logs/application.log
logging.level.${config.packageName}=INFO
`;

  writeToFile(`${projectDir}/src/main/resources/application.properties`, content);
};

// Generar CryptoManagerApplication.java
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

// Generar Cryptocurrency.java
const generateModel = () => {
  const { packageName, entityName, entityFields, tableName } = config;

  const imports = getImports(entityFields);
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
${imports}

@Entity
@Table(name = "${tableName}")
@Data
public class ${entityName} {

${fields}

}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/model/${entityName}.java`, content);
};

// Generar CryptocurrencyRepository.java
const generateRepository = () => {
  const { packageName, repositoryName, entityName, entityFields } = config;

  const primaryKey = entityFields.find(field => field.isPrimaryKey === 'Y');

  const content = `
package ${packageName}.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ${packageName}.model.${entityName};

public interface ${repositoryName} extends JpaRepository<${entityName}, ${primaryKey.type}> {
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/repository/${repositoryName}.java`, content);
};

// Generar CryptocurrencyService.java
const generateService = () => {
  const { packageName, serviceName, repositoryName, entityName, entityFields } = config;

  const primaryKey = entityFields.find(field => field.isPrimaryKey === 'Y');

  const content = `
package ${packageName}.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ${packageName}.model.${entityName};
import ${packageName}.repository.${repositoryName};
import ${packageName}.exception.${config.exceptionName};

@Service
public class ${serviceName} {

    @Autowired
    private ${repositoryName} ${repositoryName.substring(0, 1).toLowerCase() + repositoryName.substring(1)};

    public ${entityName} findById(${primaryKey.type} ${primaryKey.name}) throws ${config.exceptionName} {
        return ${repositoryName.substring(0, 1).toLowerCase() + repositoryName.substring(1)}.findById(${primaryKey.name})
                .orElseThrow(() -> new ${config.exceptionName}("${entityName} not found with id: " + ${primaryKey.name}));
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/service/${serviceName}.java`, content);
};

// Generar CryptocurrencyController.java
const generateController = () => {
  const { packageName, controllerName, serviceName, entityName, urlName, entityFields } = config;

  const primaryKey = entityFields.find(field => field.isPrimaryKey === 'Y');

  const content = `
package ${packageName}.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ${packageName}.dto.${entityName}Dto;
import ${packageName}.mapper.${entityName}Mapper;
import ${packageName}.service.${serviceName};

@RestController
@RequestMapping("/${urlName}")
public class ${controllerName} {

    @Autowired
    private ${serviceName} ${serviceName.substring(0, 1).toLowerCase() + serviceName.substring(1)};

    @Autowired
    private ${entityName}Mapper ${entityName.toLowerCase()}Mapper;

    @GetMapping("/{id}")
    public ResponseEntity<${entityName}Dto> findById(@PathVariable ${primaryKey.type} ${primaryKey.name}) {
        return ResponseEntity.ok(${entityName.toLowerCase()}Mapper.toDto(${serviceName.substring(0, 1).toLowerCase() + serviceName.substring(1)}.findById(${primaryKey.name})));
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/controller/${controllerName}.java`, content);
};

// Generar CryptocurrencyDto.java
const generateDto = () => {
  const { packageName, dtoName, entityFields } = config;
  const imports = getImports(entityFields);
  const fields = entityFields.map(field => `    private ${field.type} ${field.name};`).join('\n');

  const content = `
package ${packageName}.dto;

import lombok.Data;
${imports}

@Data
public class ${dtoName} {
${fields}
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/dto/${dtoName}.java`, content);
};

// Generar CryptocurrencyMapper.java
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
    let columnDefinition = `${field.name} ${mapJavaTypeToSqlType(field.type)}`;
    if (field.isNotNull === 'Y') {
      columnDefinition += ' NOT NULL';
    }
    return columnDefinition;
  }).join(',\n    ');

  const primaryKey = entityFields
    .filter(field => field.isPrimaryKey === 'Y')
    .map(field => field.name)
    .join(', ');

  const content = `
CREATE TABLE ${tableName} (
    ${columns},
    PRIMARY KEY (${primaryKey})
);
  `;
  writeToFile(`${projectDir}/src/main/resources/schema.sql`, content);
};

// Función para mapear tipos de Java a tipos de SQL
const mapJavaTypeToSqlType = (javaType) => {
  const typeMap = {
    "Long": "BIGINT",
    "String": "VARCHAR(255)",
    "Double": "DOUBLE",
    "BigDecimal": "DECIMAL(19,2)",
    "Date": "DATE",
    "Timestamp": "TIMESTAMP",
    "Time": "TIME",
    "Year": "YEAR",
    "Set": "SET"
  };
  return typeMap[javaType] || javaType.toUpperCase();
};

// Función para obtener las importaciones necesarias
const getImports = (entityFields) => {
  const importMap = {
    "BigDecimal": "import java.math.BigDecimal;",
    "Date": "import java.util.Date;",
    "Timestamp": "import java.sql.Timestamp;",
    "Time": "import java.sql.Time;",
    "Year": "import java.time.Year;",
    "Set<String>": "import java.util.Set;",
    "Object": "import java.lang.Object;"
  };

  const imports = new Set();
  entityFields.forEach(field => {
    if (importMap[field.type]) {
      imports.add(importMap[field.type]);
    }
  });

  return Array.from(imports).join('\n');
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
  generateMapper();
  generateException();
  generateBadRequestException();
  generateExceptionHandler();
  generateSchemaSql();
};

generateProjectFiles();
