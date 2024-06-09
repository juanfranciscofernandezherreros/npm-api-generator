const { exec } = require('child_process');

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        reject(stderr);
      }
      resolve(stdout);
    });
  });
};

const deploy = async () => {
  try {
	await runCommand('git status');
    await runCommand('git add .');
    await runCommand('git commit -m "Automated commit"');
    await runCommand('git push origin main');
    console.log('Project successfully deployed!');
  } catch (error) {
    console.error('Deployment failed:', error);
  }
};

deploy();
