const generateAppClass = require('./generateAppClass');
const generateApplicationProperties = require('./generateApplicationProperties');
const generateBadRequestException = require('./generateBadRequestException');
const generateController = require('./generateController');
const generateDto = require('./generateDto');
const generateException = require('./generateException');
const generateExceptionHandler = require('./generateExceptionHandler');
const generateMapper = require('./generateMapper');
const generateModel = require('./generateModel');
const generatePomXml = require('./generatePomXml');
const generateRepository = require('./generateRepository');
const generateSchemaSql = require('./generateSchemaSql');
const generateService = require('./generateService');
const generateApplicationPropertiesKafkaProducer = require('./generateApplicationPropertiesKafkaProducer');
const generateControllerKafka = require('./generateControllerKafka');
const generateServiceKafka = require('./generateServiceKafka');
const generateKafkaConfig = require('./generateKafkaConfig');

module.exports = {
  generateAppClass,
  generateApplicationProperties,
  generateBadRequestException,
  generateController,
  generateDto,
  generateException,
  generateExceptionHandler,
  generateMapper,
  generateModel,
  generatePomXml,
  generateRepository,
  generateSchemaSql,
  generateService,
  generateApplicationPropertiesKafkaProducer,
  generateControllerKafka,
  generateServiceKafka,
  generateKafkaConfig
};
