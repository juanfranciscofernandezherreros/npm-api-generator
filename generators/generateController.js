const { writeToFile, packageToPath } = require('../fileUtils');

const generateController = (config, projectDir) => {
  const { packageName, controllerName, serviceName, entityName, urlName, entityFields } = config;

  const primaryKey = entityFields.find(field => field.isPrimaryKey === 'Y');

  const content = `
package ${packageName}.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ${packageName}.dto.${entityName}Dto;
import ${packageName}.mapper.${entityName}Mapper;
import ${packageName}.service.${serviceName};

@RestController
@RequestMapping("/${urlName}")
public class ${controllerName} {

    @Autowired
    private ${serviceName} ${serviceName.substring(0, 1).toLowerCase() + serviceName.substring(1)};

    @Autowired
    private ${entityName}Mapper ${entityName.toLowerCase()}Mapper;

    @GetMapping("/{id}")
    public ResponseEntity<${entityName}Dto> findById(@PathVariable ${primaryKey.type} ${primaryKey.name}) {
        return ResponseEntity.ok(${entityName.toLowerCase()}Mapper.toDto(${serviceName.substring(0, 1).toLowerCase() + serviceName.substring(1)}.findById(${primaryKey.name})));
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/controller/${controllerName}.java`, content);
};

module.exports = generateController;
