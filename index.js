const fs = require('fs');
const { exec } = require('child_process');

// Lee el archivo JSON
fs.readFile('config.json', 'utf8', (err, data) => {
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

    // Cuenta las claves primarias en entityFields
    const primaryKeyCount = config.entityFields.filter(field => field.isPrimaryKey === 'Y').length;

    // Función para ejecutar scripts
    const executeScript = (script, configFile) => {
        exec(`node ${script} ${configFile}`, (err, stdout, stderr) => {
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

    // Lógica condicional basada en el número de claves primarias
    if (primaryKeyCount === 1) {
        executeScript('api.js', 'config.json');
    } else if (primaryKeyCount === 2) {
        executeScript('generatePKCompuesta.js', 'config.json');
    } else {
        console.log(`Hay ${primaryKeyCount} claves primarias.`);
    }
});
