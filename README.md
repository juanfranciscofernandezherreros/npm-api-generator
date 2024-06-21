# mi-repositorio1

npm run setup:repo -- C:\Users\xxxxx\Desktop\config.json

{
  "projectName": "usuarios-q",
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
    {"type": "String", "name": "apellidos", "nameEntity":"apellidos","isPrimaryKey": "N", "isNotNull": "N", "columnName": "APELLIDOS"},
    {"type": "String", "name": "codigoPrueba", "nameEntity":"codigoPrueba","isPrimaryKey": "Y", "isNotNull": "N", "columnName": "CODIGO_PRUEBA"},
    {"type": "String", "name": "codPerfil", "nameEntity":"codPerfil","isPrimaryKey": "Y", "isNotNull": "N", "columnName": "CODIGO_PERFIL"}
  ],

  "tableName": "USUARIOS",
  "urlName": "usuarios",
  "findByKeys": "find",
  "search": "search",
  "databaseConfig": {
    "username": "sa",
    "password": "",
    "host": "jdbc:h2:mem:testdb"
  }
}
