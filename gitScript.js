const { execSync } = require('child_process');
const path = require('path');

// Función para ejecutar comandos de Git
function executeCommand(command) {
    try {
        console.log(`Ejecutando: ${command}`);
        const output = execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Error ejecutando ${command}: ${error.message}`);
        console.error(error.stderr);
    }
}

// Obtener el directorio, URL del remoto y nombre de la rama de los argumentos
const [targetDirectory, remoteUrlArg, branchNameArg] = process.argv.slice(2);

if (!targetDirectory || !remoteUrlArg || !branchNameArg) {
    console.error('Por favor, proporciona el directorio, la URL del remoto y el nombre de la rama como argumentos.');
    process.exit(1);
}

// Cambiar al directorio especificado
try {
    process.chdir(targetDirectory);
    console.log(`Directorio cambiado a ${targetDirectory}`);
} catch (err) {
    console.error(`Error cambiando al directorio ${targetDirectory}: ${err.message}`);
    process.exit(1);
}

// Generar un nombre aleatorio para el remoto
function generateRandomRemoteName() {
    return 'origin' + Math.floor(Math.random() * 10000);
}

// Variables
const remoteName = generateRandomRemoteName();
const remoteUrl = remoteUrlArg;
const branchName = branchNameArg;
const directorio = targetDirectory;

// Secuencia de comandos Git
executeCommand(`cd ${directorio}`);
executeCommand('git init');
executeCommand(`git remote add ${remoteName} ${remoteUrl}`);
executeCommand(`git checkout -b ${branchName}`);
executeCommand('git status');
executeCommand('git add .');
executeCommand('git commit -m "commit initial"');
executeCommand(`git push -u ${remoteName} ${branchName}`);
