const fs = require('fs');
const path = require('path');

const getConfig = (configPath) => {
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
};

const packageToPath = (packageName) => {
  return packageName.replace(/\./g, '/');
};

const writeToFile = (fileName, content) => {
  fs.writeFileSync(fileName, content, 'utf8');
  console.log(`Archivo ${fileName} generado exitosamente.`);
};

module.exports = {
  getConfig,
  packageToPath,
  writeToFile
};
