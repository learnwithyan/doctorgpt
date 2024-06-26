var vscode = require('vscode');
const fs = require('fs');
const path = require('path'); // Import the 'path' module

//extId
var extName = 'doctorgpt';
var extId = 'learnwithyan.' + extName;
let config = vscode.workspace.getConfiguration(extName);
var language = vscode.env.language;

//get user lng json for variables
// localizeVars.translations = require(`../translations/${language}/${language}.json`);

// TRANSLATE BY README.MD
function trnslReadmeHandler(flag) {
  if (flag == undefined) {
    //path of ext
    var extensionPath = vscode.extensions.getExtension(extId).extensionPath;

    const translationsPath = path.join(
      extensionPath,
      'translations',
      language,
      'README.md'
    );
    const defaultPath = path.join(extensionPath, 'README.md');
    let readmeContent;
    try {
      readmeContent = fs.readFileSync(translationsPath, 'utf8');
    } catch (error) {
      readmeContent = fs.readFileSync(defaultPath, 'utf8');
    }
    //convert text to html
    readmeContentObj = markdownToObject(readmeContent);
    let htmlCode = '<div id="main">';
    //read texts
    const entriesText = Object.entries(readmeContentObj.texts);
    entriesText.forEach(function ([key, value], i) {
      if (i == 0) {
        htmlCode = htmlCode + key + value;
      } else if (i > 0) {
        htmlCode = htmlCode + key + value;
      }
      return htmlCode;
    });
    // const mediaPath = vscode.Uri.file(
    //   path.join(extensionPath, '/translations')
    // ).with({ scheme: 'vscode-resource' });
    // Construct the URI for the image
    // const imageUrl = mediaPath.with({
    //   path: path.join(mediaPath.path, '/demo.gif'),
    // });
    const imageUrl =
      'https://raw.githubusercontent.com/learnwithyan/doctorgpt/main/translations/demo.gif';
    htmlCode = htmlCode + '<img style="width: 640px;" src="' + imageUrl + '">';
    console.log(htmlCode);
    //read video
    // htmlCode =
    //   htmlCode +
    //   '	<video width="640" height="360" controls><source src="' +
    //   imageUrl +
    //   '" type="video/mp4"></video>';
    // read lists
    const entriesList = Object.entries(readmeContentObj.lists);
    entriesList.forEach(([key, value]) => {
      // console.log(key, value); // Output: key1 value1, key2 value2, key3 value3
      htmlCode = htmlCode + key + value;
    });
    htmlCode = htmlCode + '</div>';
    //update readmew
    const panel = vscode.window.createWebviewPanel(
      'translatedReadme',
      'Translated README',
      vscode.ViewColumn.One,
      { enableScripts: true, retainContextWhenHidden: true }
    );
    // console.log(
    //   path.join(extensionPath, 'translations', language, `${language}.json`)
    // );

    const htmlContent = fs.readFileSync(
      path.join(extensionPath, '/translations/translreadme.html')
    );
    // Replace a placeholder in the HTML content with the dynamic value
    const finalHtml = htmlContent
      .toString()
      .replace('{{translatedReadme}}', htmlCode);
    // Set the HTML content in the webview panel
    panel.webview.html = finalHtml;
  }
}

//read markdown text
function markdownToObject(markdownText) {
  const regexblocks = /#(.*?)#/gs;
  const matches = markdownText.match(regexblocks);

  //check for regular text we used first symbol as "- "
  const regexchecktext = /#(.+?)\n\n((?![\-|]).*)/;
  const regexgettext = /#(.+?)\n\n((?![\-|]).*)/;

  //check for list we used first symbol as "- "
  const regexchecklist = /#.+?\n\n*?- /;
  const regexgetlist = /# (.+?)\n\n([\s\S]+?)#/;
  //check for table (not used) we used first symbol as "|"
  const regexchecktable = /#.+?\n\n*?\|/;
  const regexgettable = /# (.+?)\n\n([\s\S]+?)#/;

  let obj = {};

  if (matches) {
    matches.forEach((match) => {
      let block = match.trim();
      if (regexchecklist.test(block) === true) {
        const matchlist = block.match(regexgetlist);
        const matchlistTitle = matchlist[1].trim();
        const matchlistArr = matchlist[2].split('\n- ').map((line) => {
          line = line.replace('- ', '').trim();
          return '<li>' + line.replace(',') + '</li>';
        });
        obj.lists = [];
        obj.lists['<h3>' + matchlistTitle + '</h3>'] =
          '<ul>' + matchlistArr.join(' ') + '</ul>';
      }
      if (regexchecktext.test(block) === true) {
        const matchtext = block.match(regexgettext);
        const matchtextTitle = matchtext[1].trim();
        const matchtextArr = matchtext[2].trim();
        if (obj.hasOwnProperty('texts')) {
          obj.texts['<h2>' + matchtextTitle + '</h2>'] =
            '<p>' + matchtextArr + '</p>';
        } else {
          obj.texts = [];
          obj.texts['<h1>' + matchtextTitle + '</h1>'] =
            '<p>' + matchtextArr + '</p>';
        }
      }
      //work with table
      // if (regexchecktable.test(block) === true) {
      //   const matchtable = block.match(regexgettable);
      //   // console.log(matchtable);
      // }
    });
    return obj;
  }
}

// INFO MSGS
function infoMsg(vscode, msg, counter = '') {
  vscode.window.showInformationMessage(msg);
}
function warnMsg(vscode, msg, counter = '') {
  vscode.window.showWarningMessage(msg);
}

// READ ANY FILE
function readFile(folder, filePath) {
  let fileContent;
  try {
    var extensionPath = vscode.extensions.getExtension(extId).extensionPath;
    // var language = extensionPathvscode.env.language;

    const filePathContent = path.join(extensionPath, 'files', folder, filePath);

    fileContent = fs.readFileSync(filePathContent, 'utf8');
  } catch (error) {
    fileContent = 'error reading file' + error;
  }
  return fileContent;
}

function setSettings(key, value) {
  config
    .update(key, value, vscode.ConfigurationTarget.Global)
    .then(() => {
      infoMsg(
        vscode,
        vscode.l10n.t(key + vscode.l10n.t(' set successfully', language))
      );
      return 'success';
    })
    .catch((error) => {
      warnMsg(
        vscode,
        vscode.l10n.t(
          key + vscode.l10n.t(' not set. Please try again', language)
        )
      );
      return 'fail';
    });
}

module.exports = {
  extName,
  infoMsg,
  warnMsg,
  readFile,
  trnslReadmeHandler,
  setSettings,
};
