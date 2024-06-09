const axios = require('axios');

const token = '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';
const repoName = 'CryptoPortfolioManager';
const repoDescription = 'Descripción del repositorio';

const createRepo = async () => {
  const url = 'https://api.github.com/user/repos';
  const headers = {
    Authorization: `token ${token}`,
    'Content-Type': 'application/json',
  };
  const data = {
    name: repoName,
    description: repoDescription,
    private: false,
    auto_init: true, // Inicializa el repositorio con un README.md básico
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log('Repositorio creado:', response.data.html_url);

    // Obtener el SHA del README.md inicial
    const getReadmeUrl = `https://api.github.com/repos/${response.data.owner.login}/${repoName}/contents/README.md`;
    const getReadmeResponse = await axios.get(getReadmeUrl, { headers });
    const sha = getReadmeResponse.data.sha;

    // Actualizar el README.md
    const readmeUrl = getReadmeUrl;
    const readmeData = {
      message: "Actualizar README.md",
      content: Buffer.from(`# ${repoName}\n\n${repoDescription}`).toString('base64'),
      sha: sha // Utiliza el SHA del archivo existente
    };

    const readmeResponse = await axios.put(readmeUrl, readmeData, { headers });
    console.log('README.md actualizado:', readmeResponse.data.content.html_url);
  } catch (error) {
    console.error('Error al crear el repositorio:', error.message);
  }
};

createRepo();
