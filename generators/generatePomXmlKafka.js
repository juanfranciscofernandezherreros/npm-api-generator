const { writeToFile } = require('../fileUtils');

const generatePomXmlKStream = (config, projectDir) => {
  const content = `

  <project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://www.apache.org/xsd/maven-4.0.0.xsd">

<modelVersion>4.0.0</modelVersion>
<groupId>com.fernandez.eal_entis_aplicaciones</groupId>
<artifactId>eal_entis_aplicaciones-q</artifactId>
<version>0.0.1-SNAPSHOT</version>
<packaging>jar</packaging>
<name>eal_entis_aplicaciones-q</name>
<description>Demo project for Spring Boot with Kafka</description>

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
     <artifactId>spring-boot-starter-validation</artifactId>
 </dependency>
 <dependency>
     <groupId>org.springframework.kafka</groupId>
     <artifactId>spring-kafka</artifactId>
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

module.exports = generatePomXmlKStream;
