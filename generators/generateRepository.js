const { writeToFile, packageToPath } = require('../fileUtils');

const generateRepository = (config, projectDir) => {
  const { packageName, repositoryName, entityName, entityFields } = config;

  const primaryKey = entityFields.find(field => field.isPrimaryKey === 'Y');

  const content = `
package ${packageName}.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ${packageName}.model.${entityName};

public interface ${repositoryName} extends JpaRepository<${entityName}, ${primaryKey.type}> {
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/repository/${repositoryName}.java`, content);
};

module.exports = generateRepository;
