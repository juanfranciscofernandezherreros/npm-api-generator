const { writeToFile, packageToPath } = require('../fileUtils');

const generateMapper = (config, projectDir) => {
  const { packageName, entityName, dtoName } = config;
  const content = `
package ${packageName}.mapper;

import ${packageName}.dto.${dtoName};
import ${packageName}.model.${entityName};
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ${entityName}Mapper {
    ${dtoName} toDto(${entityName} entity);
    ${entityName} toEntity(${dtoName} dto);
}
`;
  writeToFile(`${projectDir}/src/main/java/${packageToPath(packageName)}/mapper/${entityName}Mapper.java`, content);
};

module.exports = generateMapper;
