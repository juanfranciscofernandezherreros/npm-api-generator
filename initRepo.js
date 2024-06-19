const fs = require('fs');
const axios = require('axios');
const simpleGit = require('simple-git');
const git = simpleGit();

// Configura tu token de acceso personal
const githubToken = process.env.GITHUB_TOKEN; // Usa una variable de entorno para el token
const repoName = process.argv[2];
const username = process.argv[3];

if (!githubToken) {
  console.error('Error: No se ha encontrado el token de GitHub.');
  process.exit(1);
}

if (!repoName || !username) {
  console.error('Error: Debes proporcionar el nombre del repositorio y el nombre de usuario.');
  console.log('Uso: node initRepo.js <repoName> <username>');
  process.exit(1);
}

async function createRepo() {
  try {
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
        console.error('Error creating repository on GitHub:', creationError.response.data);
        throw creationError;
      }
    } else {
      console.error('Error checking repository existence on GitHub:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
}

async function initRepo(remoteUrl) {
  try {
    await git.init();
    console.log('Initialized empty Git repository');

    fs.writeFileSync('README.md', '# Proyecto\n\nEste es el README del proyecto.');
    console.log('Created README.md file');

    await git.add('.');
    console.log('Added files to repository');

    await git.commit('Initial commit');
    console.log('Committed files');

    await git.branch(['-M', 'master']);
    await git.addRemote('origin', remoteUrl);
    await git.push('origin', 'master');
    console.log('Pushed master branch to remote repository');

    await git.checkoutLocalBranch('develop');
    await git.push('origin', 'develop');
    console.log('Pushed develop branch to remote repository');
  } catch (error) {
    console.error('Error initializing repository or pushing branches:', error);
  }
}

async function main() {
  try {
    const remoteUrl = await createRepo();
    await initRepo(remoteUrl);
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

main();
