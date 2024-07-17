const { writeToFile, packageToPath } = require('../fileUtils');
const { getImports } = require('../helpers');

const generateModel = (config, projectDir) => {
  const { packageName, entityName, entityFields, tableName } = config;

  const imports = getImports(entityFields);
  const fields = entityFields.map(field => {
    let annotations = '';
    if (field.isPrimaryKey === 'Y') {
      annotations += '    @Id\n';
      if (field.isAutoIncrement === 'Y') {
        annotations += '    @GeneratedValue(strategy = GenerationType.IDENTITY)\n';
      }
    }
    if (field.isNotNull === 'Y') {
      annotations += '    @Column(nullable = false)\n';
    }
    return `${annotations}    private ${field.type} ${field.name};`;
  }).join('\n');

  const content = `
package ${packageName}.model;

import javax.persistence.*;
import lombok.Data;
${imports}

@Entity
@Table(name = "${tableName}")
@Data
public class ${entityName} {

${fields}

}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/model/${entityName}.java`, content);
};

module.exports = generateModel;
