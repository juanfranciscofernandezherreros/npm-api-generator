const { writeToFile, packageToPath } = require('../fileUtils');

const generateConsumerKafka = (config, projectDir) => {
  const { packageName, serviceName , topicName} = config;

  const content = `
package ${packageName}.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ${serviceName} {

    private static final Logger logger = LoggerFactory.getLogger(${serviceName}.class);

    @KafkaListener(topics = "${topicName}", groupId = "my-group")
    public void consumeMessage(String message) {
        logger.info("Mensaje recibido: " + message);
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/service/${serviceName}.java`, content);
};

module.exports = generateConsumerKafka;
