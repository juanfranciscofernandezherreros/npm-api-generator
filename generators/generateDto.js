const { writeToFile, packageToPath } = require('../fileUtils');
const { getImports } = require('../helpers');

const generateDto = (config, projectDir) => {
  const { packageName, dtoName, entityFields } = config;
  const imports = getImports(entityFields);
  const fields = entityFields.map(field => `    private ${field.type} ${field.name};`).join('\n');

  const content = `
package ${packageName}.dto;

import lombok.Data;
${imports}

@Data
public class ${dtoName} {
${fields}
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/dto/${dtoName}.java`, content);
};

module.exports = generateDto;
