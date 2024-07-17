const { writeToFile } = require('../fileUtils');
const { mapJavaTypeToSqlType } = require('../helpers');

const generateSchemaSql = (config, projectDir) => {
  const { tableName, entityFields } = config;

  const columns = entityFields.map(field => {
    let columnDefinition = `${field.name} ${mapJavaTypeToSqlType(field.type)}`;
    if (field.isNotNull === 'Y') {
      columnDefinition += ' NOT NULL';
    }
    return columnDefinition;
  }).join(',\n    ');

  const primaryKey = entityFields
    .filter(field => field.isPrimaryKey === 'Y')
    .map(field => field.name)
    .join(', ');

  const content = `
CREATE TABLE ${tableName} (
    ${columns},
    PRIMARY KEY (${primaryKey})
);
  `;
  writeToFile(`${projectDir}/src/main/resources/schema.sql`, content);
};

module.exports = generateSchemaSql;
