const { writeToFile, packageToPath } = require('../fileUtils');

const generateException = (config, projectDir) => {
  const { packageName, exceptionName } = config;
  const content = `
package ${packageName}.exception;

public class ${exceptionName} extends RuntimeException {
    public ${exceptionName}(String message) {
        super(message);
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/exception/${exceptionName}.java`, content);
};

module.exports = generateException;
