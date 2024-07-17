const { writeToFile, packageToPath } = require('../fileUtils');

const generateBadRequestException = (config, projectDir) => {
  const { packageName, exceptionNameBadRequest } = config;
  const content = `
package ${packageName}.exception;

public class ${exceptionNameBadRequest} extends RuntimeException {
    public ${exceptionNameBadRequest}(String message) {
        super(message);
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/exception/${exceptionNameBadRequest}.java`, content);
};

module.exports = generateBadRequestException;
