const { writeToFile } = require('../fileUtils');

const generateApplicationPropertiesKafkaConsumer = (config, projectDir) => {
  const content = `
server.port=8089
spring.kafka.bootstrap-servers=localhost:9092
spring.kafka.consumer.key-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.value-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.group-id=my-group
`;

  writeToFile(`${projectDir}/src/main/resources/application.properties`, content);
};

module.exports = generateApplicationPropertiesKafkaConsumer;
