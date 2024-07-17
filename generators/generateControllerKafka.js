const { writeToFile, packageToPath } = require('../fileUtils');

const generateControllerKafka = (config, projectDir) => {
  const { packageName, controllerName, serviceName } = config;

  const content = `
package ${packageName}.controller;

import ${packageName}.service.${serviceName};
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ${controllerName} {

    @Autowired
    private ${serviceName} producerService;

    @GetMapping("/send")
    public String sendMessage(@RequestParam("clave") String clave, @RequestParam("message") String message) {
        producerService.sendMessage(clave, message);
        return "";
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/controller/${controllerName}.java`, content);
};

module.exports = generateControllerKafka;
