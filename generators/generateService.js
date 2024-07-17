const { writeToFile, packageToPath } = require('../fileUtils');

const generateService = (config, projectDir) => {
  const { packageName, serviceName, repositoryName, entityName, entityFields } = config;

  const primaryKey = entityFields.find(field => field.isPrimaryKey === 'Y');

  const content = `
package ${packageName}.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ${packageName}.model.${entityName};
import ${packageName}.repository.${repositoryName};
import ${packageName}.exception.${config.exceptionName};

@Service
public class ${serviceName} {

    @Autowired
    private ${repositoryName} ${repositoryName.substring(0, 1).toLowerCase() + repositoryName.substring(1)};

    public ${entityName} findById(${primaryKey.type} ${primaryKey.name}) throws ${config.exceptionName} {
        return ${repositoryName.substring(0, 1).toLowerCase() + repositoryName.substring(1)}.findById(${primaryKey.name})
                .orElseThrow(() -> new ${config.exceptionName}("${entityName} not found with id: " + ${primaryKey.name}));
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/service/${serviceName}.java`, content);
};

module.exports = generateService;
