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
    console.log(await runCommand('git init'));
    console.log(await runCommand('git remote add origin18 git@github.com:juanfranciscofernandezherreros/CryptoPortfolioManager.git'));
    console.log(await runCommand('git pull origin18 master --allow-unrelated-histories'));
    console.log(await runCommand('git add .'));
    console.log(await runCommand('git commit -m "Automated commit"'));
    console.log(await runCommand('git push origin18 master --force'));
    console.log('Project successfully deployed!');
  } catch (error) {
    console.error('Deployment failed:', error);
  }
};

deploy();
