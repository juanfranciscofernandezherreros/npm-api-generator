const inquirer = require('inquirer');

const options = [
  'Generar archivo de propiedades de Kafka',
  'Generar servicio productor de Kafka',
  'Generar servicio consumidor de Kafka',
  'Salir'
];

const askUser = async () => {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: 'Seleccione una opción:',
      choices: options
    }
  ]);

  switch (answer.option) {
    case 'Generar archivo de propiedades de Kafka':
      console.log('Generando archivo de propiedades de Kafka...');
      // Llama a tu función para generar el archivo de propiedades de Kafka
      break;
    case 'Generar servicio productor de Kafka':
      console.log('Generando servicio productor de Kafka...');
      // Llama a tu función para generar el servicio productor de Kafka
      break;
    case 'Generar servicio consumidor de Kafka':
      console.log('Generando servicio consumidor de Kafka...');
      // Llama a tu función para generar el servicio consumidor de Kafka
      break;
    case 'Salir':
      console.log('Saliendo...');
      process.exit();
      break;
    default:
      console.log('Opción no válida');
      break;
  }

  // Volver a mostrar el menú después de ejecutar la opción
  askUser();
};

askUser();
