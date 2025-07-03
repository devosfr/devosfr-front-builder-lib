
const fs = require('fs');
const path = require('path');
module.exports = function generateComponent(componentType, folderName) {
  let dirPath;
  
if (componentType) {
  const componentTemplate = fs.readFileSync(path.join(__dirname, './templates/prime-vue/Button.vue'), 'utf-8');

  const isSubFolder = folderName.indexOf('/') > -1;
  let mainPage = 'components';
  if (isSubFolder) {
    var folders = folderName.split('/');
    count = folders.length;
    
    folders.reduce((acc, folder) => {
       switch (true) {
          case acc !== null:
             try {
                dirPath = path.join(`${mainPage}/${acc}/${folder}/`);
                fs.mkdirSync(dirPath);
                
             } catch (error) {
                if (error.code === 'EEXIST') {
                   
                   console.log(`❌ ${messages[1][language]?.alreadyExistsMessage}`);
                   return 'folder-exists'
                }
             }

             break;

          default:
             dirPath = path.join(`${mainPage}/${folder}`);
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
    
    fs.writeFileSync(dirPath, componentTemplate, 'utf8');
 } else {
  const dirPath = path.join(process.cwd(), `components/${folderName}`);
  // mark
  const targetPath = path.join(dirPath, `index.vue`);

  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(targetPath, componentTemplate);
 }


} else {


  console.log(`❌ Erro ao gerar componente`);
}

}
