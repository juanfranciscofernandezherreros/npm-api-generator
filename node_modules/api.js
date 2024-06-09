const fs = require('fs');
const path = require('path');

// Obtener los argumentos de línea de comandos
const args = process.argv.slice(2);
if (args.length !== 1) {
    console.error('Uso: node api.js <config-json>');
    process.exit(1);
}

// Parsea el argumento JSON
const config = JSON.parse(args[0]);

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
  'service'
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
    <groupId>com.example</groupId>
    <artifactId>library</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>jar</packaging>
    <name>library</name>
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
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`;
  writeToFile(`${projectDir}/pom.xml`, content);
};

// Generar application.properties
const generateApplicationProperties = () => {
  const content = `
# H2 Database configuration
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true

# Ensure that schema.sql and data.sql are always run
spring.datasource.initialization-mode=always
spring.jpa.hibernate.ddl-auto=none
`;
  writeToFile(`${projectDir}/src/main/resources/application.properties`, content);
};

// Generar LibraryApplication.java
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

// Generar Book.java
const generateModel = () => {
  const { packageName, entityName, entityFields } = config;
  const fields = entityFields.map(field => `    private ${field.type} ${field.name};`).join('\n');
  const gettersSetters = entityFields.map(field => `
    public ${field.type} get${capitalize(field.name)}() {
        return ${field.name};
    }

    public void set${capitalize(field.name)}(${field.type} ${field.name}) {
        this.${field.name} = ${field.name};
    }
  `).join('\n');

  const content = `
package ${packageName}.model;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "books")
public class ${entityName} {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

${fields}

${gettersSetters}
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/model/${entityName}.java`, content);
};

// Generar BookRepository.java
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

// Generar BookService.java
const generateService = () => {
  const { packageName, serviceName, repositoryName, entityName, idType, idField } = config;
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

    public ${entityName} findById(${idType} ${idField}) throws ${config.exceptionName} {
        return ${repositoryName.substring(0, 1).toLowerCase() + repositoryName.substring(1)}.findById(${idField})
                .orElseThrow(() -> new ${config.exceptionName}("${entityName} not found with id: " + ${idField}));
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/service/${serviceName}.java`, content);
};

// Generar BookController.java
const generateController = () => {
  const { packageName, controllerName, serviceName, entityName, idType, idField } = config;
  const content = `
package ${packageName}.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ${packageName}.model.${entityName};
import ${packageName}.service.${serviceName};

@RestController
@RequestMapping("/books")
public class ${controllerName} {

    @Autowired
    private ${serviceName} ${serviceName.substring(0, 1).toLowerCase() + serviceName.substring(1)};

    @GetMapping("/{id}")
    public ResponseEntity<${entityName}> findById(@PathVariable ${idType} ${idField}) {
        ${entityName} ${entityName.substring(0, 1).toLowerCase() + entityName.substring(1)} = ${serviceName.substring(0, 1).toLowerCase() + serviceName.substring(1)}.findById(${idField});
        return ResponseEntity.ok(${entityName.substring(0, 1).toLowerCase() + entityName.substring(1)});
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/controller/${controllerName}.java`, content);
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

// Generar GlobalExceptionHandler.java
const generateExceptionHandler = () => {
  const { packageName, handlerName, exceptionName } = config;
  const content = `
package ${packageName}.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ${handlerName} {

    @ExceptionHandler(${exceptionName}.class)
    public ResponseEntity<String> handleResourceNotFoundException(${exceptionName} ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/exception/${handlerName}.java`, content);
};

// Generar schema.sql
const generateSchemaSql = () => {
  const content = `
CREATE TABLE books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);
  `;
  writeToFile(`${projectDir}/src/main/resources/schema.sql`, content);
};

// Generar data.sql
const generateDataSql = () => {
  const content = `
INSERT INTO books (title, author, isbn, price) VALUES
('The Catcher in the Rye', 'J.D. Salinger', '9780316769488', 10.99),
('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 7.99);
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
  generateException();
  generateExceptionHandler();
  generateDataSql();
  generateSchemaSql();
};

generateProjectFiles();
