const simpleGit = require('simple-git');
const path = require('path');

// Reemplaza esto con tu token de acceso personal y la URL de tu repositorio
const GIT_USER = 'jnfz92';
const GIT_TOKEN = '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';
const REPO_URL = `https://${GIT_USER}:${GIT_TOKEN}@github.com/jnf92/books-q.git`;

async function uploadToGitRepo() {
  const projectPath = path.resolve(__dirname, 'LibraryProject');
  const git = simpleGit(projectPath);

  try {
    // Inicializar el repositorio si no lo está
    await git.init();

    // Verificar si el origen remoto 'origin' existe
    const remotes = await git.getRemotes(true);
    const originRemote = remotes.find(remote => remote.name === 'origin');

    if (!originRemote) {
      // Agregar el repositorio remoto si no existe
      await git.addRemote('origin', REPO_URL);
      console.log('Origin remoto agregado');
    } else {
      console.log('Origin remoto ya existe');
    }

    // Crear y cambiar a una nueva rama llamada 'feature'
    await git.checkoutLocalBranch('sdasdasddsa');

    // Agregar todos los archivos
    await git.add('.');

    // Hacer commit
    await git.commit('Initial commit on feature branch');

    // Subir la rama 'feature' al repositorio remoto
    await git.push('origin', 'feature');
-
    console.log('Proyecto subido exitosamente a la rama feature');
  } catch (error) {
    console.error('Error al subir el proyecto:', error);
  }
}

uploadToGitRepo();
