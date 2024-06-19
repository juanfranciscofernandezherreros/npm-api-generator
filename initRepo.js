const fs = require('fs');
const axios = require('axios');
const simpleGit = require('simple-git');
const git = simpleGit();

// Obtiene el token de acceso personal desde la variable de entorno
const githubToken = process.env.GITHUB_TOKEN;
const repoName = 'tu_repositorio';
const username = 'juanfranciscofernandezherreros';

if (!githubToken) {
  console.error('Error: No se ha encontrado el token de GitHub en las variables de entorno.');
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
    // Si el error es porque el repositorio no existe, continuamos con la creación
    if (error.response && error.response.status === 404) {
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
        console.error('Error creating repository on GitHub', creationError);
        throw creationError;
      }
    } else {
      console.error('Error checking repository existence on GitHub', error);
      throw error;
    }
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

    // Verificar si el remoto 'origin' ya existe y eliminarlo si es necesario
    const remotes = await git.getRemotes(true);
    const originRemote = remotes.find(remote => remote.name === 'origin');

    if (originRemote) {
      await git.removeRemote('origin');
      console.log('Removed existing remote origin');
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
