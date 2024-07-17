const validateSchema = (config) => {
    const requiredFields = [
        "projectName", "username", "newBranchName", "targetDirectory", "packageName", 
        "appClassName", "entityName", "repositoryName", "serviceName", "controllerName", 
        "exceptionName", "exceptionNameBadRequest", "handlerName", "dtoName", "mapperName", 
        "entityFields", "tableName", "urlName", "findByKeys", "search", "databaseConfig"
    ];

    const missingFields = requiredFields.filter(field => !config.hasOwnProperty(field));

    if (missingFields.length > 0) {
        console.error(`Faltan los siguientes campos requeridos en el archivo JSON: ${missingFields.join(', ')}`);
        return false;
    }

    if (!Array.isArray(config.entityFields)) {
        console.error('El campo "entityFields" debe ser un arreglo.');
        return false;
    }

    const requiredEntityFieldProps = ["type", "name", "nameEntity", "isPrimaryKey", "isNotNull", "columnName"];
    const missingEntityFieldProps = [];

    config.entityFields.forEach((entityField, index) => {
        requiredEntityFieldProps.forEach(prop => {
            if (!entityField.hasOwnProperty(prop)) {
                missingEntityFieldProps.push(`entityFields[${index}].${prop}`);
            }
        });
    });

    if (missingEntityFieldProps.length > 0) {
        console.error(`Faltan los siguientes campos requeridos en los objetos de "entityFields": ${missingEntityFieldProps.join(', ')}`);
        return false;
    }

    return true;
}

module.exports = {
    validateSchema
};
