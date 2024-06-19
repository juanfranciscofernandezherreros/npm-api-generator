const fs = require('fs');
const axios = require('axios');
const simpleGit = require('simple-git');
const git = simpleGit();

// Configura tu token de acceso personal y el nombre del repositorio
const githubToken = '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';
const repoName = 'tu_repositorio';
const username = 'juanfranciscofernandezherreros';

async function createRepo() {
  try {
    const response = await axios.post(
      `https://api.github.com/user/repos`,
      {
        name: repoName,
        private: false,
      },
      {
        headers: {
          Authorization: `token ${githubToken}`,
        },
      }
    );
    console.log(`Created repository ${repoName} on GitHub`);
    return response.data.clone_url;
  } catch (error) {
    console.error('Error creating repository on GitHub', error);
    throw error;
  }
}

async function initRepo(remoteUrl) {
  try {
    // Crear un archivo README.md
    fs.writeFileSync('README.md', '# Proyecto\n\nEste es el README del proyecto.');
    console.log('Created README.md file');

    // Inicializa un nuevo repositorio Git
    await git.init();
    console.log('Initialized empty Git repository');

    // Añade todos los archivos al repositorio
    await git.add('.');
    console.log('Added files to repository');

    // Realiza el primer commit
    await git.commit('Initial commit');
    console.log('Committed files');

    // Crear y cambiar a la rama master si no existe
    const branches = await git.branch();
    if (!branches.all.includes('master')) {
      await git.checkoutLocalBranch('master');
      console.log('Created and switched to branch master');
    } else {
      await git.checkout('master');
      console.log('Switched to branch master');
    }

    // Añadir el nuevo remoto
    await git.addRemote('origin', remoteUrl);
    console.log(`Added remote origin: ${remoteUrl}`);

    // Empuja los cambios al repositorio remoto con force
    await git.push('origin', 'master', { '--force': null });
    console.log('Pushed to remote repository with force');
  } catch (err) {
    console.error('Error initializing repository', err);
  }
}

async function main() {
  try {
    const remoteUrl = await createRepo();
    await initRepo(remoteUrl);
  } catch (error) {
    console.error('Error in main function', error);
  }
}

main();
