# mi-repositorio1



npm run setup:repo -- C:\Users\Usuario\Desktop\config.json

npm run setup:repo -- C:\Users\Usuario\Desktop\config.json

{
  "projectName": "usuarios-h2",
  "username": "xxxx",
  "newBranchName": "feature/XXXXX",
  "targetDirectory": "usuarios-q",
  "packageName": "com.example.usuarios",
  "appClassName": "UsuariosApplication",
  "entityName": "Usuarios",
  "repositoryName": "UsuariosRepository",
  "serviceName": "UsuariosService",
  "controllerName": "UsuariosController",
  "exceptionName": "ResourceNotFoundException",
  "exceptionNameBadRequest": "BadRequestException",
  "handlerName": "GlobalExceptionHandler",
  "dtoName": "UsuariosDto",
  "mapperName": "UsuariosMapper",
  "entityFields": [
    {"type": "String", "name": "apellidos", "nameEntity":"apellidos","isPrimaryKey": "Y", "isNotNull": "N", "columnName": "APELLIDOS"},
    {"type": "String", "name": "codigoPrueba", "nameEntity":"codigoPrueba","isPrimaryKey": "N", "isNotNull": "N", "columnName": "CODIGO_PRUEBA"},
    {"type": "String", "name": "codPerfil", "nameEntity":"codPerfil","isPrimaryKey": "N", "isNotNull": "N", "columnName": "CODIGO_PERFIL"}
  ],
  "tableName": "USUARIOS",
  "urlName": "usuarios",
  "findByKeys": "find",
  "search": "search",
  "databaseConfig": {
    "username": "sa",
    "password": "",
    "platform": "org.hibernate.dialect.H2Dialect",
    "driverClassName": "org.h2.Driver",
    "host": "jdbc:h2:mem:testdb"
  }
}
---
{
  "projectName": "usuarios-mysql",
  "username": "xxxx",
  "newBranchName": "feature/XXXXX", 
  "targetDirectory": "usuarios-q",
  "packageName": "com.example.usuarios",
  "appClassName": "UsuariosApplication",
  "entityName": "Usuarios",
  "repositoryName": "UsuariosRepository",
  "serviceName": "UsuariosService",
  "controllerName": "UsuariosController",
  "exceptionName": "ResourceNotFoundException",
  "exceptionNameBadRequest": "BadRequestException",
  "handlerName": "GlobalExceptionHandler",
  "dtoName": "UsuariosDto",
  "mapperName": "UsuariosMapper",
  "entityFields": [
    {"type": "String", "name": "apellidos", "nameEntity":"apellidos","isPrimaryKey": "Y", "isNotNull": "N", "columnName": "APELLIDOS"},
    {"type": "String", "name": "codigoPrueba", "nameEntity":"codigoPrueba","isPrimaryKey": "N", "isNotNull": "N", "columnName": "CODIGO_PRUEBA"},
    {"type": "String", "name": "codPerfil", "nameEntity":"codPerfil","isPrimaryKey": "N", "isNotNull": "N", "columnName": "CODIGO_PERFIL"}
  ],

  "tableName": "USUARIOS",
  "urlName": "usuarios",
  "findByKeys": "find",
  "search": "search",
  "databaseConfig": {
    "username": "sa",
    "password": "",
    "platform": "org.hibernate.dialect.MySQL8Dialect",
    "driverClassName": "com.mysql.cj.jdbc.Driver",
    "host": "jdbc:mysql://localhost:6603/sports?useSSL=false&serverTimezone=UTC"
  }
}
--
{
    "projectName": "usuarios-oracle",
    "username": "xxxx",
    "newBranchName": "feature/XXXXX",
    "targetDirectory": "usuarios-q",
    "packageName": "com.example.usuarios",
    "appClassName": "UsuariosApplication",
    "entityName": "Usuarios",
    "repositoryName": "UsuariosRepository",
    "serviceName": "UsuariosService",
    "controllerName": "UsuariosController",
    "exceptionName": "ResourceNotFoundException",
    "exceptionNameBadRequest": "BadRequestException",
    "handlerName": "GlobalExceptionHandler",
    "dtoName": "UsuariosDto",
    "mapperName": "UsuariosMapper",
    "entityFields": [
      {"type": "String", "name": "apellidos", "nameEntity":"apellidos","isPrimaryKey": "Y", "isNotNull": "N", "columnName": "APELLIDOS"},
      {"type": "String", "name": "codigoPrueba", "nameEntity":"codigoPrueba","isPrimaryKey": "N", "isNotNull": "N", "columnName": "CODIGO_PRUEBA"},
      {"type": "String", "name": "codPerfil", "nameEntity":"codPerfil","isPrimaryKey": "N", "isNotNull": "N", "columnName": "CODIGO_PERFIL"}
    ],
    "tableName": "USUARIOS",
    "urlName": "usuarios",
    "findByKeys": "find",
    "search": "search",
    "databaseConfig": {
      "username": "oracle_user",
      "password": "oracle_password",
      "platform": "org.hibernate.dialect.Oracle12cDialect",
      "driverClassName": "oracle.jdbc.OracleDriver",
      "host": "jdbc:oracle:thin:@localhost:1521:orcl"
    }
  }