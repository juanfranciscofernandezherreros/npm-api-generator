const { exec } = require('child_process');
const path = require('path');

const executeScript = (script, outputDir, ...args) => {
    const command = `node ${path.resolve(script)} ${args.join(' ')}`;
    exec(command, { cwd: outputDir }, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error ejecutando ${script}: ${err}`);
            return;
        }
        console.log(`Salida de ${script}:\n${stdout}`);
        if (stderr) {
            console.error(`Error de ${script}:\n${stderr}`);
        }
    });
}

module.exports = {
    executeScript
};
