const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const {
   join
} = require('node:path');
const vueFileContentHtmlBody = require('./templates/js/html.json');
const vueFileContentJsBody = require('./templates/js/js.json');
// console.log('TEST: ', JSON.stringify(vueFileContentHtmlBody.body));
const {
   writeFile
} = require('fs/promises');
const newPageDir = "pages/test.vue";
const entry = require('prompt-sync')({
   sigint: true
});
let vueFile = 'index.vue';
// js
let vueFileContent = vueFileContentHtmlBody.body;
let jsFile = 'script.js';
let jsFileContent = vueFileContentJsBody.body;

// ts
let tsVueFileContentWithScript = '<script setup lang="ts">\n\n</script>\n\n<template>\n\n\t<h1>Just a simple text</h1>\n\n</template>\n\n<style scoped type="text/css" src="./style.css" />';
let tsVueFileContent = '<template>\n\n\t<h1>Just a simple text</h1>\n\n</template>\n\n<script lang="ts" src="./script.ts" />\n\n<style scoped type="text/css" src="./style.css" />';
let tsFile = 'script.ts';
let tsFileContent = "import { defineComponent } from 'vue';\n\n export default defineComponent({})";

let styleFile = 'style.css';
let language;
let value;
let formattedVue;
let formattedJs;
let formattedTs;

const messages = [
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
         alreadyExistsMessage: 'A folder with that name already exists, please choose another name.'
      },
      pt: {
         alreadyExistsMessage: 'Já existe uma pasta com esse nome, por favor escolha outro nome.'
      },
      es: {
         alreadyExistsMessage: 'Ya existe una carpeta con ese nombre, elija otro nombre.'
      }
   }
];

module.exports.setLanguage = (currentlanguage) => {
   language = currentlanguage
}

module.exports.jsMakePageOld = async (pageName, mainPage) => {
   var path;
   var lastPosition;
   var lastFolder;
   // var count;
   console.log(mainPage);
   if (mainPage !== 'pages' && mainPage !== 'components') {
      console.log(`❌ ${messages[0][language]?.message}`);
      return 'invalid-folder-name'
   }

   // When have more than one folder
   if (pageName.indexOf('/') > -1) {
      var folders = pageName.split('/');
      count = folders.length;
      folders.forEach(async (folder, index) => {
         switch (true) {
            case index > lastPosition:
               path = join(`${mainPage}/${lastFolder}/${folder}/`);
               fs.mkdirSync(path);

               formattedVue = await prettier.format(vueFileContent, { parser: 'vue' });
               formattedJs = await prettier.format(jsFileContent, { parser: 'babel' });

               writeFile(path + vueFile, formattedVue);
               writeFile(path + jsFile, formattedJs);
               writeFile(path + styleFile, '');
               break;

            default:
               path = join(`${mainPage}/${folder}/`);
               fs.mkdirSync(path);
               formattedVue = await prettier.format(vueFileContent, { parser: 'vue' });
               formattedJs = await prettier.format(jsFileContent, { parser: 'babel' });

               writeFile(path + vueFile, formattedVue);
               writeFile(path + jsFile, formattedJs);
               writeFile(path + styleFile, '');
               break;
         }

         lastPosition = index;
         lastFolder = folder
      });
   } else {
      try {
         path = join(`${mainPage}/${pageName}/`);
         fs.mkdirSync(path);
         formattedVue = await prettier.format(vueFileContent, { parser: 'vue' });
         formattedJs = await prettier.format(jsFileContent, { parser: 'babel' });

         writeFile(path + vueFile, formattedVue);
         writeFile(path + jsFile, formattedJs);
         writeFile(path + styleFile, '');
      } catch (error) {
         if (error.code === 'EEXIST') {
            console.log(`❌ ${messages[1][language]?.alreadyExistsMessage}`);
         }
         return 'folder-exists'
      }

   }

};

module.exports.jsMakePage = async (pageName, mainPage, sameFile) => {

   const _tsVueFileContent = sameFile === '1' ? tsVueFileContentWithScript : tsVueFileContent;

   var dirPath;
   console.log(mainPage);
   if (mainPage !== 'pages' && mainPage !== 'components') {
      console.log(messages[0][language]?.message);
      return null
   }
   const isSubFolder = pageName.indexOf('/') > -1;

   // When have more than one folder
   if (isSubFolder) {
      var folders = pageName.split('/');
      count = folders.length;
      folders.reduce((acc, folder) => {
         switch (true) {
            case acc !== null:
               try {
                  dirPath = join(`${mainPage}/${acc}/${folder}/`);
                  fs.mkdirSync(dirPath);
               } catch (error) {
                  if (error.code === 'EEXIST') {
                     
                     console.log(`❌ ${messages[1][language]?.alreadyExistsMessage}`);
                     return 'folder-exists'
                  }
               }

               break;

            default:
               dirPath = join(`${mainPage}/${folder}`);
               const exists = fs.existsSync(dirPath);
               // console.log('Existe?', exists) // Deve imprimir true se existir
               if (!exists) {
                  
                  fs.mkdirSync(dirPath);
               }
               break;
         }
         return folder
      }, null);

    
      dirPath = path.join(mainPage, folders[0], folders[1], 'index.vue');
      const exists = fs.existsSync(dirPath);
      if (exists) {
         return 'folder-exists'
      }
      
      fs.writeFileSync(dirPath, _tsVueFileContent, 'utf8');

      dirPath = path.join(mainPage, folders[0], folders[1], 'script.ts')
      fs.writeFileSync(dirPath, tsFileContent, 'utf8');

      dirPath = path.join(mainPage, folders[0], folders[1], 'style.css')
      fs.writeFileSync(dirPath, '', 'utf8');
   } else {
      try {
         dirPath = join(`${mainPage}/${pageName}/`);
         fs.mkdirSync(dirPath);

         formattedVue = await prettier.format(_tsVueFileContent, { parser: 'vue' });
         formattedTs = await prettier.format(tsFileContent, { parser: 'babel' });

         writeFile(dirPath + vueFile, formattedVue);
         (sameFile === '2') && (writeFile(dirPath + tsFile, formattedTs));
         writeFile(dirPath + styleFile, '');
      } catch (error) {
         if (error.code === 'EEXIST') {
            console.log(`❌ ${messages[1][language]?.alreadyExistsMessage}`);
         }
         return 'folder-exists'

      }
   }
};



module.exports.tsMakePage = async (pageName, mainPage, sameFile) => {

   const _tsVueFileContent = sameFile === '1' ? tsVueFileContentWithScript : tsVueFileContent;

   var dirPath;
   console.log(mainPage);
   if (mainPage !== 'pages' && mainPage !== 'components') {
      console.log(messages[0][language]?.message);
      return null
   }
   const isSubFolder = pageName.indexOf('/') > -1;

   // When have more than one folder
   if (isSubFolder) {
      var folders = pageName.split('/');
      count = folders.length;
      folders.reduce((acc, folder) => {
         switch (true) {
            case acc !== null:
               try {
                  dirPath = join(`${mainPage}/${acc}/${folder}/`);
                  fs.mkdirSync(dirPath);
               } catch (error) {
                  if (error.code === 'EEXIST') {
                     
                     console.log(`❌ ${messages[1][language]?.alreadyExistsMessage}`);
                     return 'folder-exists'
                  }
               }

               break;

            default:
               dirPath = join(`${mainPage}/${folder}`);
               const exists = fs.existsSync(dirPath);
               // console.log('Existe?', exists) // Deve imprimir true se existir
               if (!exists) {
                  
                  fs.mkdirSync(dirPath);
               }
               break;
         }
         return folder
      }, null);

    
      dirPath = path.join(mainPage, folders[0], folders[1], 'index.vue');
      const exists = fs.existsSync(dirPath);
      if (exists) {
         return 'folder-exists'
      }
      
      fs.writeFileSync(dirPath, _tsVueFileContent, 'utf8');

      dirPath = path.join(mainPage, folders[0], folders[1], 'script.ts')
      fs.writeFileSync(dirPath, tsFileContent, 'utf8');

      dirPath = path.join(mainPage, folders[0], folders[1], 'style.css')
      fs.writeFileSync(dirPath, '', 'utf8');
   } else {
      try {
         dirPath = join(`${mainPage}/${pageName}/`);
         fs.mkdirSync(dirPath);

         formattedVue = await prettier.format(_tsVueFileContent, { parser: 'vue' });
         formattedTs = await prettier.format(tsFileContent, { parser: 'babel' });

         writeFile(dirPath + vueFile, formattedVue);
         (sameFile === '2') && (writeFile(dirPath + tsFile, formattedTs));
         writeFile(dirPath + styleFile, '');
      } catch (error) {
         if (error.code === 'EEXIST') {
            console.log(`❌ ${messages[1][language]?.alreadyExistsMessage}`);
         }
         return 'folder-exists'

      }
   }
};

module.exports.makeByComponent = async ({
   pageName,
   mainPage,
   componentChoice
}) => {
   var path;
   console.log(mainPage);
   if (mainPage !== 'pages' && mainPage !== 'components') {
      console.log(messages[0][language]?.message);
      return null
   }

   // When have more than one folder
   if (pageName.indexOf('/') > -1) {

      // var folders = pageName.split('/');
      // count = folders.length;
      // folders.forEach((folder, index) => {
      //    switch (true) {
      //       case index > lastPosition:
      //          // console.log('TESTE 1');
      //          path = join(`${mainPage}/${lastFolder}/${folder}/`);
      //          fs.mkdirSync(path);
      //          writeFile(path + vueFile, vueFileContent);
      //          writeFile(path + jsFile, jsFileContent);
      //          writeFile(path + styleFile, '');
      //          break;

      //       default:
      //          // Está caindo aqui
      //          // console.log('TESTE 2');
      //          path = join(`${mainPage}/${folder}/`);
      //          fs.mkdirSync(path);
      //          writeFile(path + vueFile, vueFileContent);
      //          writeFile(path + jsFile, jsFileContent);
      //          writeFile(path + styleFile, '');
      //          break;
      //    }

      //    lastPosition = index;
      //    lastFolder = folder
      // });
   } else {

      path = join(`${mainPage}/${pageName}/`);
      fs.mkdirSync(path);
      formattedVue = await prettier.format(componentChoice.content, { parser: 'vue' });
      formattedTs = await prettier.format(jsFileContent, { parser: 'babel' });

      writeFile(path + vueFile, formattedVue);
      writeFile(path + jsFile, formattedTs);
      writeFile(path + styleFile, '');
   }

};

