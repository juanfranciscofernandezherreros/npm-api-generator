const fs = require('fs');
const path = require('path');
const { getConfig, packageToPath } = require('./fileUtils');
const generators = require('./generators');

const main = () => {
  const configPath = process.argv[2];
  if (!configPath) {
    console.error('No se ha proporcionado la ruta del archivo de configuración.');
    process.exit(1);
  }

  const config = getConfig(configPath);
  const projectDir = config.projectName;

  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }

  const subDirs = [
    'model',
    'repository',
    'service',
    'mapper'
  ];

  const dirs = subDirs.map(dir => `${projectDir}/src/main/java/${packageToPath(config.packageName)}/${dir}`).concat(`${projectDir}/src/main/resources`);

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  generateProjectFiles(config, projectDir);
};

const generateProjectFiles = (config, projectDir,topicName,serviceName) => {
  generators.generatePomXmlKafka(config, projectDir);
  generators.generateApplicationPropertiesKafkaConsumer(config, projectDir);
  generators.generateAppClass(config, projectDir);
  generators.generateConsumerKafka(config, projectDir,topicName,serviceName);
};

main();
