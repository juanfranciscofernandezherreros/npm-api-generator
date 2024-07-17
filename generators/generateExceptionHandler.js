const { writeToFile, packageToPath } = require('../fileUtils');

const generateExceptionHandler = (config, projectDir) => {
  const { packageName, handlerName, exceptionName, exceptionNameBadRequest } = config;
  const content = `
package ${packageName}.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@ControllerAdvice
public class ${handlerName} {

    @ExceptionHandler(${exceptionName}.class)
    public ResponseEntity<String> handleResourceNotFoundException(${exceptionName} ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(${exceptionNameBadRequest}.class)
    public ResponseEntity<String> handleBadRequestException(${exceptionNameBadRequest} ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<String> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException ex) {
        String message = String.format("The parameter '%s' of value '%s' could not be converted to type '%s'", 
ex.getName(), ex.getValue(), ex.getRequiredType().getSimpleName());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
    }
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/exception/${handlerName}.java`, content);
};

module.exports = generateExceptionHandler;
