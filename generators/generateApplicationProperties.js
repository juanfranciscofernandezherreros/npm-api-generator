const { writeToFile } = require('../fileUtils');

const generateApplicationProperties = (config, projectDir) => {
  const { username, password, host, driverClassName, platform } = config.databaseConfig;
  const isMySQL = platform === 'org.hibernate.dialect.MySQL8Dialect';
  const isH2 = platform === 'org.hibernate.dialect.H2Dialect';
  const isOracle = platform === 'org.hibernate.dialect.Oracle12cDialect';

  const content = `
${isMySQL ? `
# MySQL Database configuration
spring.datasource.url=${host}
spring.datasource.driverClassName=${driverClassName}
spring.datasource.username=${username}
spring.datasource.password=${password}
spring.jpa.database-platform=${platform}
` : ''}

${isH2 ? `
# H2 Database configuration
spring.datasource.url=${host}
spring.datasource.driverClassName=${driverClassName}
spring.datasource.username=${username}
spring.datasource.password=${password}
spring.jpa.database-platform=${platform}
` : ''}

${isOracle ? `
# Oracle Database configuration
spring.datasource.url=${host}
spring.datasource.driverClassName=${driverClassName}
spring.datasource.username=${username}
spring.datasource.password=${password}
spring.jpa.database-platform=${platform}
` : ''}

# Ensure that schema.sql and data.sql are always run
spring.datasource.initialization-mode=always
spring.jpa.hibernate.ddl-auto=none

# Logging configuration
logging.file.name=logs/application.log
logging.level.${config.packageName}=INFO
`;

  writeToFile(`${projectDir}/src/main/resources/application.properties`, content);
};

module.exports = generateApplicationProperties;
