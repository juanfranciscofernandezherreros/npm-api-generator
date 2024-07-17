const { writeToFile, packageToPath } = require('../fileUtils');

const generateConsumerKafka = (config, projectDir) => {
  const { packageName, consumerServiceName } = config;

  const content = `
package ${packageName}.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ${consumerServiceName} {

    private static final Logger logger = LoggerFactory.getLogger(${consumerServiceName}.class);

    @KafkaListener(topics = "TEST_MY_TOPIC", groupId = "my-group")
    public void consumeMessage(String message) {
        logger.info("Mensaje recibido: " + message);
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/service/${consumerServiceName}.java`, content);
};

module.exports = generateConsumerKafka;
