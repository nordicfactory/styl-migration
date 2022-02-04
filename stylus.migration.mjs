//     "migrate": "npx zx --shell=C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe ./stylus.migration.mjs"


const fs = require('fs').promises;

const targetDirectory = await question('Enter the target directory: ');
const regex = await question('Enter regex pattern (e.g. apps/**/*.component.styl): ');
const stylePaths = await globby([regex], {cwd: targetDirectory, ignore: ['node_modules']});

let updateComponentQ = await question('Update components? (true/false) ', {choices: ['true', 'false']});
const updateComponent = updateComponentQ === 'true';

console.log(chalk.cyan('Total files found:', stylePaths.length));

for (const filePath of stylePaths) {
    const fullFilePath = `${targetDirectory}/${filePath}`;
    const file = await fs.readFile(fullFilePath, {encoding: 'utf-8'});
    console.log(chalk.cyan('📄 Migrating stylesheet', filePath));

    // empty file, just rename
    if (!file.trim()) {
        await renameStylusFileToScss(fullFilePath);
    } else {
        await convertStylusToScss(filePath);
        await copyFileContentAndRename(fullFilePath);
    }

    if (updateComponent){
        await updateStylePathInComponent(filePath);
    }

}


// Only format if we found files
if (stylePaths.length){
    console.log(chalk.green(`\n🚀 Your Stylus files should have been migrated to SCSS! \n`));
    console.log(chalk.green(`\nPrettifying them now \n`));
    await formatFilesWithPrettier();
}

async function formatFilesWithPrettier() {
    await $`npx prettier --write "**/*.component.scss"`;
}

async function convertStylusToScss(filePath) {
    await $`npx stylus-conver -i ${filePath} -o ${filePath.replace('.styl', '.scss')}`;
}

async function renameStylusFileToScss(filePath) {
    const newFilePath = filePath.replace('.styl', '.scss');
    await $`git mv ${filePath} ${newFilePath}`;
}

async function updateStylePathInComponent(filePath) {
    const componentTsPath = filePath.replace('.styl', '.ts');
    try {
        let component = await fs.readFile(componentTsPath, {encoding: 'utf-8'});
        component = component.replace('component.styl', 'component.scss');
        await fs.writeFile(componentTsPath, component);
    } catch (e) {
        console.error('Could not update style for: ' + componentTsPath);
        console.error(e.message);
    }

}

async function copyFileContentAndRename(stylusFilePath) {
    const scssFilePath = stylusFilePath.replace('.styl', '.scss');
    const tempFile = await fs.readFile(scssFilePath, {encoding: 'utf-8'});
    tempFile.replace('component.styl', 'component.scss');
    await fs.unlink(scssFilePath);
    await renameStylusFileToScss(stylusFilePath);
    await fs.writeFile(scssFilePath, tempFile, {encoding: 'utf-8'});
}
