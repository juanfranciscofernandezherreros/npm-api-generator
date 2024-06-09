const fs = require('fs');
const path = require('path');

// Configuración de la base de datos y entidad
const config = {
  "packageName": "com.example.store",
  "projectName": "StoreProjectPK",
  "name": "product",
  "urlName": "products",
  "entityName": "Product",
  "repositoryName": "ProductRepository",
  "serviceName": "ProductService",
  "controllerName": "ProductController",
  "exceptionName": "ResourceNotFoundException",
  "handlerName": "GlobalExceptionHandler",
  "appClassName": "StoreApplication",
  "testClassName": "StoreApplicationTests",
  "idClassName": "ProductId",
  "tableName": "products",
  "databaseConfig": {
    "username": "sa",
    "password": "password",
    "host": "jdbc:h2:mem:testdb"
  },
  "entityFields": [
    { "name": "storeId", "type": "Long" },
    { "name": "productId", "type": "String" },
    { "name": "name", "type": "String" },
    { "name": "description", "type": "String" },
    { "name": "price", "type": "BigDecimal" }
  ]
};

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
  'filter'
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
    <artifactId>store</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>jar</packaging>
    <name>store</name>
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
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-logging</artifactId>
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

// Generar StoreApplication.java
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

// Generar ProductId.java
const generateIdClass = () => {
  const { packageName, idClassName, entityFields } = config;
  const idFields = entityFields.slice(0, 2).map(field => `    private ${field.type} ${field.name};`).join('\n');
  const gettersSetters = entityFields.slice(0, 2).map(field => `
    public ${field.type} get${capitalize(field.name)}() {
        return ${field.name};
    }

    public void set${capitalize(field.name)}(${field.type} ${field.name}) {
        this.${field.name} = ${field.name};
    }
  `).join('\n');

  const content = `
package ${packageName}.model;

import java.io.Serializable;
import java.util.Objects;

import javax.persistence.Embeddable;

@Embeddable
public class ${idClassName} implements Serializable {

${idFields}

${gettersSetters}

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ${idClassName} that = (${idClassName}) o;
        return Objects.equals(storeId, that.storeId) && Objects.equals(productId, that.productId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(storeId, productId);
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/model/${idClassName}.java`, content);
};

// Generar Product.java
const generateModel = () => {
  const { packageName, entityName, idClassName, entityFields, tableName } = config;
  const fields = entityFields.slice(2).map(field => `    private ${field.type} ${field.name};`).join('\n');
  const gettersSetters = entityFields.slice(2).map(field => `
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
@Table(name = "${tableName}")
public class ${entityName} {

    @EmbeddedId
    private ${idClassName} id;

${fields}

    public ${idClassName} getId() {
        return id;
    }

    public void setId(${idClassName} id) {
        this.id = id;
    }

    public Long getStoreId() {
        return id.getStoreId();
    }

    public void setStoreId(Long storeId) {
        id.setStoreId(storeId);
    }

    public String getProductId() {
        return id.getProductId();
    }

    public void setProductId(String productId) {
        id.setProductId(productId);
    }

${gettersSetters}
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/model/${entityName}.java`, content);
};

// Generar ProductRepository.java
const generateRepository = () => {
  const { packageName, repositoryName, entityName, idClassName } = config;
  const content = `
package ${packageName}.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ${packageName}.model.${entityName};
import ${packageName}.model.${idClassName};

public interface ${repositoryName} extends JpaRepository<${entityName}, ${idClassName}> {
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/repository/${repositoryName}.java`, content);
};

// Generar ProductService.java
const generateService = () => {
  const { packageName, serviceName, repositoryName, entityName, idClassName } = config;
  const content = `
package ${packageName}.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ${packageName}.model.${entityName};
import ${packageName}.model.${idClassName};
import ${packageName}.repository.${repositoryName};
import ${packageName}.exception.${config.exceptionName};

@Service
public class ${serviceName} {

    @Autowired
    private ${repositoryName} ${repositoryName.substring(0, 1).toLowerCase() + repositoryName.substring(1)};

    public ${entityName} findById(${idClassName} id) throws ${config.exceptionName} {
        return ${repositoryName.substring(0, 1).toLowerCase() + repositoryName.substring(1)}.findById(id)
                .orElseThrow(() -> new ${config.exceptionName}("${entityName} not found with id: " + id));
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/service/${serviceName}.java`, content);
};

// Generar ProductController.java
const generateController = () => {
  const { packageName, controllerName, serviceName, entityName, idClassName, urlName } = config;
  const content = `
package ${packageName}.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ${packageName}.model.${entityName};
import ${packageName}.model.${idClassName};
import ${packageName}.service.${serviceName};

@RestController
@RequestMapping("/${urlName}")
public class ${controllerName} {

    @Autowired
    private ${serviceName} ${serviceName.substring(0, 1).toLowerCase() + serviceName.substring(1)};

    @GetMapping("/{storeId}/{productId}")
    public ResponseEntity<${entityName}> findById(@PathVariable Long storeId, @PathVariable String productId) {
        ${idClassName} id = new ${idClassName}();
        id.setStoreId(storeId);
        id.setProductId(productId);
        ${entityName} ${entityName.substring(0, 1).toLowerCase() + entityName.substring(1)} = ${serviceName.substring(0, 1).toLowerCase() + serviceName.substring(1)}.findById(id);
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
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
public class ${handlerName} {

    @ExceptionHandler(${exceptionName}.class)
    public ResponseEntity<String> handleResourceNotFoundException(${exceptionName} ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<String> handleNoHandlerFoundException(NoHandlerFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No handler found for " + ex.getHttpMethod() + " " + ex.getRequestURL());
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/exception/${handlerName}.java`, content);
};

// Generar LoggingFilter.java
const generateLoggingFilter = () => {
  const { packageName } = config;
  const content = `
package ${packageName}.filter;

import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import javax.servlet.Filter;
import java.io.IOException;
import java.util.logging.Logger;

@Component
public class LoggingFilter implements Filter {

    private static final Logger logger = Logger.getLogger(LoggingFilter.class.getName());

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // No initialization required
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        logger.info("Incoming request: " + req.getMethod() + " " + req.getRequestURI());
        chain.doFilter(request, response);
        logger.info("Outgoing response for: " + req.getMethod() + " " + req.getRequestURI());
    }

    @Override
    public void destroy() {
        // No cleanup required
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/filter/LoggingFilter.java`, content);
};

// Generar schema.sql
const generateSchemaSql = () => {
  const { tableName } = config;
  const content = `
CREATE TABLE ${tableName} (
    store_id BIGINT NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (store_id, product_id)
);
  `;
  writeToFile(`${projectDir}/src/main/resources/schema.sql`, content);
};

// Generar data.sql
const generateDataSql = () => {
  const { tableName } = config;
  const content = `
INSERT INTO ${tableName} (store_id, product_id, name, description, price) VALUES
(1, 'A', 'Laptop', 'High performance laptop', 1500.99),
(2, 'B', 'Smartphone', 'Latest model smartphone', 999.99);
  `;
  writeToFile(`${projectDir}/src/main/resources/data.sql`, content);
};

// Ejecutar la generación de todos los archivos
const generateProjectFiles = () => {
  generatePomXml();
  generateApplicationProperties();
  generateAppClass();
  generateIdClass();
  generateModel();
  generateRepository();
  generateService();
  generateController();
  generateException();
  generateExceptionHandler();
  generateLoggingFilter();
  generateDataSql();
  generateSchemaSql();
};

generateProjectFiles();
