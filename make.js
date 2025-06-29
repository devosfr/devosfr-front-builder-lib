const entry = require('prompt-sync')({
  sigint: true
});
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
  }
];
// comment just before upload de code.
const Build = require('./index.js');

// mark uncomment just before upload de code.
// const Build = require('@oseiasdev/front-builder');
// const componentsList = require('./templates/components.json');


let value = null;
let main = null;
let type = null;
// let componentQuestionResponse = null;
let language;

async function init(){

  language = entry('Choose language, write en, pt or es: ');
  language && Build.setLanguage(language);
  
  
  main = entry(messages[1][language]?.targetPlace);
  console.log('Main folder: ' + main);

    // mark
    value =  entry(messages[0][language]?.folderName || messages[0].en.folderName);
    console.log('Hierarchy: ' + value);  
  
  type = entry(messages[2][language]?.chooseFileExtension);
  console.log('Type picked: ' + type);
  
  // TODO: mark content 
  // componentQuestionResponse = entry('Do you want generate with a content? (y/n): ');
  // if (componentQuestionResponse === 'y') {
  
  
  //   // Aqui entraria a IA perguntando qual o conteúdo e qual frame-work que o usuário quer usar para o componente 
  //   const choice = entry('Chose 1 to typescript and html in the same file or 2 to use in separate files: ');
  
  //   const component = componentsList.components.find(co => co.id === parseInt(choice));
  
  //   Build.makeByComponent({
  //     pageName: value,
  //     mainPage: main,
  //     componentChoice: component
  //   });
  
  //   return;
  // }
  
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