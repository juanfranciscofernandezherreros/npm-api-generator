
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
COPY --from=build /app/target/usuarios-q-0.0.1-SNAPSHOT.jar usuarios-q-0.0.1-SNAPSHOT.jar

# Exponer el puerto en el que la aplicación se ejecutará
EXPOSE 8080

# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "usuarios-q-0.0.1-SNAPSHOT.jar"]

  