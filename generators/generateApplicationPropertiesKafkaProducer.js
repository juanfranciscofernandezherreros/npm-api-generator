const { writeToFile } = require('../fileUtils');

const generateApplicationPropertiesKafkaProducer = (config, projectDir) => {
  const content = `
server.port=8089
spring.kafka.bootstrap-servers=localhost:29092
spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer
spring.kafka.producer.value-serializer=org.apache.kafka.common.serialization.StringSerializer
`;

  writeToFile(`${projectDir}/src/main/resources/application.properties`, content);
};

module.exports = generateApplicationPropertiesKafkaProducer;
