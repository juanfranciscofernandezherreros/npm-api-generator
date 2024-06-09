const { exec } = require('child_process');

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error.message);
      } else if (stderr) {
        console.error(`stderr: ${stderr}`);
        resolve(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

const deploy = async () => {
  try {
	console.log(await runCommand('cd CryptoPortfolioManager'));
	console.log(await runCommand('git init'));
    //console.log(await runCommand('git remote add origin git@github.com:juanfranciscofernandezherreros/nombre-del-repositorio.git'));
    console.log(await runCommand('git pull origin master'));
    console.log(await runCommand('git add .'));
    console.log(await runCommand('git commit -m "Automated commit"'));
    console.log(await runCommand('git push origin master'));
    console.log('Project successfully deployed!');
  } catch (error) {
    console.error('Deployment failed:', error);
  }
};

deploy();
