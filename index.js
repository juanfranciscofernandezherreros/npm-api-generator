const fs = require('fs');
const { exec } = require('child_process');
const setupRepo = require('./setupRepo');

// Lee el archivo JSON
fs.readFile('config.json', 'utf8', async (err, data) => {
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
        executeScript('apiLong.js', 'config.json');
    } else if (primaryKeyCount === 1 && (primaryKey.type !== 'Long' || primaryKey.name !== 'id')) {
        console.log('Hay una única clave primaria, pero no es del tipo Long o no se llama "id".');
        executeScript('apiUnique.js', 'config.json');
    } else if (primaryKeyCount > 1) {
        console.log('Hay múltiples claves primarias.');
        executeScript('apiDocker.js', 'config.json');
    } else {
        console.log('No hay claves primarias definidas.');
    }

    // Llama a setupRepo
    try {
        await setupRepo(config.projectName, config.username);
        console.log('Repositorio configurado exitosamente.');
    } catch (initRepoError) {
        console.error('Error inicializando el repositorio:', initRepoError);
    }
});
