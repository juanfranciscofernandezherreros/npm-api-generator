const { writeToFile, packageToPath } = require('../fileUtils');

const generateServiceKafka = (config, projectDir) => {
  const { packageName, serviceName, topicName } = config;

  const content = `
package ${packageName}.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ${serviceName} {

    private static final String TOPIC = "${topicName}";
    private static final Logger logger = LoggerFactory.getLogger(${serviceName}.class);

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendMessage(String key, String message) {
        kafkaTemplate.send(TOPIC, key, message).addCallback(
                result -> logger.info("Mensaje enviado: " + message + " con offset: " + result.getRecordMetadata().offset()),
                ex -> logger.error("Error enviando mensaje: " + message, ex)
        );
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/service/${serviceName}.java`, content);
};

module.exports = generateServiceKafka;
