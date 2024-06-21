const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// Verifica si se proporcionó la ruta del archivo JSON como argumento
if (process.argv.length < 3) {
    console.error('Uso: node index.js <ruta_al_archivo_json>');
    process.exit(1);
}

// Obtener la ruta absoluta del archivo JSON desde los argumentos
const jsonFilePath = path.resolve(process.argv[2]);

// Función para validar el esquema del JSON
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

// Lee el archivo JSON
fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo:', err);
        return;
    }

    // Parsea el contenido JSON
    let config;
    try {
        config = JSON.parse(data);
    } catch (parseErr) {
        console.error('Error al parsear el archivo JSON:', parseErr);
        return;
    }

    // Validar el esquema del JSON
    if (!validateSchema(config)) {
        console.error('El archivo JSON no cumple con el esquema esperado.');
        return;
    }

    // Cuenta las claves primarias en entityFields
    const primaryKeys = config.entityFields.filter(field => field.isPrimaryKey === 'Y');
    const primaryKeyCount = primaryKeys.length;
    const primaryKey = primaryKeys.length === 1 ? primaryKeys[0] : null;

    // Función para ejecutar scripts
    const executeScript = (script, ...args) => {
        const command = `node ${script} ${args.join(' ')}`;
        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error ejecutando ${script}: ${err}`);
                return;
            }
            console.log(`Salida de ${script}:\n${stdout}`);
            if (stderr) {
                console.error(`Error de ${script}:\n${stderr}`);
            }
        });
    };

    // Llama a otros scripts según la configuración de las claves primarias
    if (primaryKeyCount === 1 && primaryKey.type === 'Long' && primaryKey.name === 'id') {
        console.log('Hay una única clave primaria del tipo Long con el nombre "id".');
        executeScript('apiLong.js', jsonFilePath);
    } else if (primaryKeyCount === 1 && (primaryKey.type !== 'Long' || primaryKey.name !== 'id')) {
        console.log('Hay una única clave primaria, pero no es del tipo Long o no se llama "id".');
        executeScript('apiUnique.js', jsonFilePath);
    } else if (primaryKeyCount > 1) {
        console.log('Hay múltiples claves primarias.');
        executeScript('apiDocker.js', jsonFilePath);
    } else {
        console.log('No hay claves primarias definidas.');
    }
});
