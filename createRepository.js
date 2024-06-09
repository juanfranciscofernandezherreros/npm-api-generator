const axios = require('axios');

const token = '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';
const repoName = 'nombre-del-repositorio';
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
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log('Repositorio creado:', response.data.html_url);
  } catch (error) {
    console.error('Error al crear el repositorio:', error.message);
  }
};

createRepo();
