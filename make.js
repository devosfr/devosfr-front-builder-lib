const entry = require('prompt-sync')({
  sigint: true
});
const inquirer = require('inquirer');
const generateComponent = require('./generate-component.js');

const primeVueComponents = [
  'Button',
  'Card',
  'Dialog',
  'InputText',
  'Dropdown',
  'Table',
  'Toast',
  'Calendar',
  'Avatar',
  'ProgressBar'
];
const messages = [
  {
    en: {
      folderName: '📁 Give a name to the main folder\n\n Note: You can also create it inside an existing and empty directory, example: \'name-of-existing-directory/your-new-directory\': '
    },
    pt: {
      folderName: '📁 Digite um nome para o seu diretório principal\n\n Obs: Você também pode criá-lo dentro de um diretório vazio já existente, exemplo: \'nome-do-diretorio-existente/seu-novo-diretorio\': '
    },
    es: {
      folderName: '📁 Introduzca un nombre para la carpeta principal::\n\n Nota: También puedes crearlo dentro de un directorio existente, ejemplo: \'nombre-del-directorio-existente/tu-nuevo-directorio\': '
    }
  },
  {
    en: {
      targetPlace: 'Where do you want to create? (for example pages, components...): '
    },
    pt: {
      targetPlace: 'Onde você gostaria de criar? (por exemplo em pages, components...): '
    },
    es: {
      targetPlace: '¿Dónde desea crearlo? (por ejemplo, en páginas, componentes...):'
    }
  },
  {
    en: {
      chooseFileExtension: '🧑‍💻 Write js to javascript or ts to typescript (js/ts): '
    },
    pt: {
      chooseFileExtension: '🧑‍💻 Escreva js para javascript ou ts para typescript (js/ts): '
    },
    es: {
      chooseFileExtension: '🧑‍💻 Escribe js para javascript o ts para typescript (js/ts): '
    }
  },
  {
    en: {
      chooseSeparateOrJustOneFile: '🤔 Do you want script and html in the same file? (y/n) '
    },
    pt: {
      chooseSeparateOrJustOneFile: '🤔 Quer script e html no mesmo arquivo? (y/n) '
    },
    es: {
      chooseSeparateOrJustOneFile: '🤔 ¿Quieres script y html en el mismo archivo? (t/n) '
    }
  },
  {
    en: {
      errorMessage1: 'Please, insert 1 or 2 value'
    },
    pt: {
      errorMessage1: 'Por favor, insira 1 ou 2'
    },
    es: {
      errorMessage1: 'Por favor, introduzca 1 o 2'
    }
  },
  {
    en: {
      errorMessage2: '🤔 Chose a correct type...'
    },
    pt: {
      errorMessage2: '🤔 Escolha o tipo correto...'
    },
    es: {
      errorMessage2: '🤔 Elija el tipo adecuado...'
    }
  },
  {
    en: {
      message: 'Invalid name for the directory, please type pages or components.'
    },
    pt: {
      message: 'Nome inválido para o diretório, por favor digite pages ou components.'
    },
    es: {
      message: 'Nombre inválido para el directorio, por favor introduzca páginas o componentes.'
    }
  },
  {
    en: {
      choiceQuestion: 'Would you like to create a prime-vue component? (y/n): '
    },
    pt: {
      choiceQuestion: 'Gostaria de criar um componente prime-vue? (y/n): '
    },
    es: {
      choiceQuestion: '¿Te gustaría crear un componente prime-vue? (y/n): '
    }
  },
   {
    en: {
      componentChosen: 'You chose the component'
    },
    pt: {
      componentChosen: 'Você escolheu o componente'
    },
    es: {
      componentChosen: 'Tu elegiste el componente'
    }
  },
   {
    en: {
      selectThePrimeVueComponent: 'Select the PrimeVue component:'
    },
    pt: {
      selectThePrimeVueComponent: 'Selecione o componente PrimeVue:'
    },
    es: {
      selectThePrimeVueComponent: 'Seleccione el componente PrimeVue:'
    }
  }
];

const Build = require('./index.js');
const { register } = require('module');
let value = null;
let main = null;
let type = null;
let language;

async function init() {

  language = entry('Choose language, write en, pt or es: ');
  language && Build.setLanguage(language);

let choice = entry(messages[7][language]?.choiceQuestion || messages[7].en.choiceQuestion);

if (choice === 'y') {
 const folderName = entry(messages[0][language]?.folderName || messages[0].en.folderName);

  inquirer
  .prompt([
    {
      type: 'list',
      name: 'component',
      message: `${messages[9][language]?.selectThePrimeVueComponent || messages[9].en.selectThePrimeVueComponent}:`,
      choices: primeVueComponents
    }
  ])
  .then((answers) => {
    console.log(`${messages[8][language]?.componentChosen || messages[8].en.componentChosen}: ${answers.component}`);
    generateComponent(answers.component, folderName);
    console.log('🤓 Criado com sucesso!');
  });
  
  return;
}
  main = entry(messages[1][language]?.targetPlace);
  console.log('Main folder: ' + main);


  value = entry(messages[0][language]?.folderName || messages[0].en.folderName);
 
  type = entry(messages[2][language]?.chooseFileExtension);
  

  if (type === 'js') {
    const sameFile = entry(messages[3][language]?.chooseSeparateOrJustOneFile);
    console.log('Chosed: ' + sameFile);
    switch (true) {
      case sameFile.toLocaleLowerCase() === 'y' || sameFile.toLocaleLowerCase() === 'n':
        //  TODO: jsMakePage needs be generic
        const response = await Build.jsMakePage(value, main, sameFile);
        if (response !== 'folder-exists' && response !== 'invalid-folder-name') {

          console.log('🤓 Criado com sucesso!');
        }
        break;
    }

  } else if (type === 'ts') {
    // TODO: Chose 1 to typescript and html in the same file or 2 to use in separate files
    const sameFile = entry(messages[3][language]?.chooseSeparateOrJustOneFile);
    console.log('Chosed: ' + sameFile);

    switch (true) {
      case sameFile.toLocaleLowerCase() === 'y' || sameFile.toLocaleLowerCase() === 'n':
        const path = require('path');

        const currentFileDir = __dirname; // diretório do arquivo atual

        const newFolderPath = path.join(currentFileDir, 'templates', 'vue');

        console.log(newFolderPath);
        //  TODO: tsMakePage needs be generic  
        const response = await Build.tsMakePage(value, main, sameFile);
        if (response !== 'folder-exists' && response !== 'invalid-folder-name') {

          console.log('🤓 Criado com sucesso!');
        }
        break;
    }

  } else {
    console.log(messages[5][language]?.errorMessage2);
    type = entry(messages[2][language]?.chooseFileExtension);
    console.log('Type picked: ' + type);
  }
}


init();
