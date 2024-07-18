const { writeToFile } = require('../fileUtils');

const generateApplicationPropertiesKStream = (config, projectDir) => {
  const content = `
spring.kafka.bootstrap-servers=localhost:9092
spring.kafka.streams.application-id=kstream-example
spring.kafka.streams.default.key.serde=org.apache.kafka.common.serialization.Serdes$StringSerde
spring.kafka.streams.default.value.serde=org.apache.kafka.common.serialization.Serdes$StringSerde
`;

  writeToFile(`${projectDir}/src/main/resources/application.properties`, content);
};

module.exports = generateApplicationPropertiesKStream;
