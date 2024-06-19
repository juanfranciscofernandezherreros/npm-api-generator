const fs = require('fs');
const axios = require('axios');
const simpleGit = require('simple-git');
const git = simpleGit();

// Configura tu token de acceso personal
const githubToken = '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'; // Reemplaza con tu token real
const repoName = 'usuarios-q';
const username = 'juanfranciscofernandezherreros';

if (!githubToken) {
  console.error('Error: No se ha encontrado el token de GitHub.');
  process.exit(1);
}

async function createRepo() {
  try {
    // Verificar si el repositorio ya existe
    const existingRepo = await axios.get(
      `https://api.github.com/repos/${username}/${repoName}`,
      {
        headers: {
          Authorization: `token ${githubToken}`,
        },
      }
    );

    if (existingRepo.data) {
      console.log(`Repository ${repoName} already exists on GitHub`);
      return existingRepo.data.clone_url;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Si el repositorio no existe, proceder a crearlo
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
      } catch (creationError) {
        console.error('Error creating repository on GitHub', creationError.response.data);
        throw creationError;
      }
    } else {
      console.error('Error checking repository existence on GitHub', error.response.data);
      throw error;
    }
  }
}

async function initRepo(remoteUrl) {
  try {
    // Inicializar el repositorio localmente y configurarlo
    await git.init();
    console.log('Initialized empty Git repository');

    // Crear un archivo README.md
    fs.writeFileSync('README.md', '# Proyecto\n\nEste es el README del proyecto.');
    console.log('Created README.md file');

    // Añadir todos los archivos al repositorio
    await git.add('.');
    console.log('Added files to repository');

    // Realiza el primer commit en master
    await git.commit('Initial commit');
    console.log('Committed files');

    // Crear y empujar la rama master
    await git.branch(['-M', 'master']);
    await git.addRemote('origin', remoteUrl);
    await git.push('origin', 'master');
    console.log('Pushed master branch to remote repository');

    // Crear y empujar la rama develop
    await git.checkoutLocalBranch('develop');
    await git.push('origin', 'develop');
    console.log('Pushed develop branch to remote repository');
  } catch (error) {
    console.error('Error initializing repository or pushing branches', error);
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
