var vscode = require('vscode');
const fs = require('fs');
const path = require('path'); // Import the 'path' module
const { exec } = require('child_process');

const extFuncs = require('./files/funcs.js');
var language = vscode.env.language;
let config = vscode.workspace.getConfiguration(extFuncs.extName);
let panel;
let htmlAnswers = [];

function activate(context) {
  let flag;
  let text;

  context.subscriptions.push(
    vscode.commands.registerCommand(extFuncs.extName + '.com1', function () {
      extFuncs.trnslReadmeHandler(flag);
    }),
    vscode.commands.registerCommand(extFuncs.extName + '.com2', function () {
      setApiKey(flag, text);
    }),
    vscode.commands.registerCommand(extFuncs.extName + '.com3', function () {
      requestHandler(flag, text);
      // Help me find mistakes in the following code <paste code below>.
      // I want to <prompt>. Can you provide an example of how to do that?
      // Please continue writing this code <post code below>
      // I need to create <prompt>. Can you provide an example of how to do that using <prompt>?
      // Find the bug with this code: <post code below>
      // Generate <prompt> examples of <prompt>
      // Write a regex for <prompt>
      // I’m making a <prompt>. I need ideas on <prompt>.
    })
  );
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;

// function helpers
function appendContentToEditor(response) {
  // Find the editor in ViewColumn.Two
  const existingEditor = vscode.window.visibleTextEditors.find(
    (editor) => editor.viewColumn === vscode.ViewColumn.Two
  );

  if (existingEditor) {
    // If an editor in ViewColumn.Two exists, append content to it
    const currentPosition = existingEditor.document.lineAt(
      existingEditor.document.lineCount - 1
    ).range.end;
    const newPosition = new vscode.Position(
      existingEditor.document.lineCount,
      0
    );
    existingEditor.edit((editBuilder) => {
      editBuilder.insert(currentPosition, '\n' + response);
    });
    // Move cursor to the end of the appended content
    existingEditor.selection = new vscode.Selection(newPosition, newPosition);
  } else {
    // If not, open a new editor with the content
    vscode.workspace
      .openTextDocument({ content: response })
      .then((document) => {
        vscode.window.showTextDocument(document, vscode.ViewColumn.Two, {
          preserveFocus: true,
          preview: false,
          viewColumn: vscode.ViewColumn.Two,
        });
      });
  }
}

//send request
function setApiKey(flag, text) {
  vscode.window
    .showInputBox({
      prompt: vscode.l10n.t('Paste Api key from chat GPT', language),
    })
    .then((userInput) => {
      console.log('User input:', userInput);
      if (userInput) {
        extFuncs.setSettings('api-key', 'Bearer ' + userInput);
      }
    });
}
function requestHandler(flag, text) {
  if (flag == undefined) {
    var editor = vscode.window.activeTextEditor;
    var language = vscode.env.language;

    if (!editor) {
      return;
    }
    // console.log(editor);
    var selection = editor.selection;
    var text = editor.document.getText(selection);
    text = text.replace(/\n/g, ' '); // Replace all occurrences of \n with a space
    // Get a specific value from the configuration
    config = vscode.workspace.getConfiguration(extFuncs.extName);

    const apiKey = config.get('api-key');
    console.log(apiKey); // Log the value of api-key
    if (apiKey != null) {
      let response = null;
      let userPrompt = text;
      const requestData = {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
      };
      const headers = {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      };
      response = sendRequest(
        'https://api.openai.com/v1/chat/completions',
        'POST',
        headers,
        requestData
      );
    } else {
      extFuncs.warnMsg(
        vscode,
        vscode.l10n.t(
          'No API key found. Please set it in settings.json',
          language
        )
      );
    }
  }
}

function loadHtmlToView(codePrompts = null) {
  codePrompts.reverse();
  let replacedCode = codePrompts.join('<hr>');
  // Get a specific value from the configuration
  config = vscode.workspace.getConfiguration(extFuncs.extName);
  let codeLang = 'common';
  codeLang = config.get('code-lang');

  let bgBodyColor = '#000';
  bgBodyColor = config.get('bg-chat-color');

  let bgTextSize = '14';
  bgTextSize = config.get('bg-text-size');

  let textPrimaryColor = '#00a67d';
  textPrimaryColor = config.get('text-primary-color');

  let textSecondaryColor = '#2e95d3';
  textSecondaryColor = config.get('text-secondary-color');
  // Define the keywords to be highlighted
  let keys = extFuncs.readFile(codeLang, 'keywords.txt');
  const keywords = keys.split('\n');
  // Replace each keyword with a <span> element with the keyword itself as the class name
  keywords.forEach((keyword) => {
    const regExp = new RegExp(`\\b${keyword}\\b`, 'g');
    replacedCode = replacedCode.replace(
      regExp,
      `<span class="keyword-${keyword}">${keyword}</span>`
    );
  });
  //get styles
  let styles = extFuncs.readFile(codeLang, 'css.txt');
  styles = styles
    .replace(/\n/g, ' ')
    .replace(/primary/g, textPrimaryColor)
    .replace(/secondary/g, textSecondaryColor);
  const cssStyles = '`' + styles + '`';
  replacedCode = replacedCode
    .replace(/\n/g, '<br>')
    .replace(/}<br>}/g, '<span style="margin-left:10px;">}</span><br>}')
    .replace(/```[a-z]+/g, '')
    .replace(/```/g, '');
  // Example HTML content
  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
  <style>
    ${cssStyles}
  </style>
  <title>Doctor GPT</title>
      
  </head>
  <body style='font-size: ${bgTextSize}px; background-color: ${bgBodyColor}'>
  ${replacedCode}
  </body>
  </html>
  `;
  console.log(htmlContent);

  if (!panel) {
    panel = vscode.window.createWebviewPanel(
      'webViewPanel', // Identifies the type of the webview. Used internally
      'Doctor GPT', // Title of the panel displayed to the user
      vscode.ViewColumn.Two, // Editor column to show the new webview panel in
      {} // Webview options
    );
    panel.webview.html = htmlContent;
  }

  try {
    // Attempt to access a property or method of the webview panel
    // This will throw an error if the panel has been disposed
    console.log(panel.title);
    panel.webview.html = htmlContent;
  } catch (error) {
    console.error('Webview panel is disposed');
    // Handle the error gracefully, e.g., recreate the webview panel
    panel = vscode.window.createWebviewPanel(
      'webViewPanel', // Identifies the type of the webview. Used internally
      'Doctor GPT', // Title of the panel displayed to the user
      vscode.ViewColumn.Two, // Editor column to show the new webview panel in
      {} // Webview options
    );
    panel.webview.html = htmlContent;
  }
}

function sendRequest(url, method, headers = null, requestData = null) {
  if (method == 'POST') {
    const options = {
      method: method,
      headers: headers,
      body: JSON.stringify(requestData),
    };
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
      <style>
    #demo{height:100%;position:relative}.box{width:50px;height:50px;position:relative;border-radius:6px;margin-top:4px;display:inline-block;line-height:50px;text-align:center;color:#333}.green{background-color:#6fb936}.orange{background-color:#f38630}.grey{background-color:#989898}.box{animation:myAnimation 4s linear infinite}@keyframes myAnimation{0%{transform:translateX(0)}25%{transform:translateX(100px)}37.5%{background-color:#6fb936}62.5%{background-color:#f38630}75%{transform:translateX(100px) rotate(0deg)}100%{transform:translateX(0) rotate(-360deg);background-color:#f38630}}body{margin:30px}
      </style>
      <title>Doctor GPT</title>
      </head>
      <body style='font-size: 14px; background-color: #000'>
    <div class="box green"></div>
      </body>
      </html>
      `;
    if (!panel) {
      panel = vscode.window.createWebviewPanel(
        'webViewPanel', // Identifies the type of the webview. Used internally
        'Doctor GPT', // Title of the panel displayed to the user
        vscode.ViewColumn.Two, // Editor column to show the new webview panel in
        {} // Webview options
      );
      panel.webview.html = htmlContent;
    }

    try {
      // Attempt to access a property or method of the webview panel
      // This will throw an error if the panel has been disposed
      console.log(panel.title);
      panel.webview.html = htmlContent;
    } catch (error) {
      console.error('Webview panel is disposed');
      // Handle the error gracefully, e.g., recreate the webview panel
      panel = vscode.window.createWebviewPanel(
        'webViewPanel', // Identifies the type of the webview. Used internally
        'Doctor GPT', // Title of the panel displayed to the user
        vscode.ViewColumn.Two, // Editor column to show the new webview panel in
        {} // Webview options
      );
      panel.webview.html = htmlContent;
    }
    return fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          try {
            // console.log(response);
            extFuncs.warnMsg(
              vscode,
              vscode.l10n.t(
                'Check if balance on https://platform.openai.com is positive?',
                language
              )
            );
            extFuncs.warnMsg(
              vscode,
              vscode.l10n.t('Check if Internet working?', language)
            );
            extFuncs.warnMsg(
              vscode,
              vscode.l10n.t('Check if you set GPT Api Key?', language)
            );
          } catch {
            throw new Error('Network response was not ok');
          }
        }
        return response.json();
      })
      .then((data) => {
        return data; // Return the response data if needed
      })
      .then((resolvedData) => {
        // console.log('resolvedData:', resolvedData); // Log the resolved data
        const jsonObj = JSON.stringify(resolvedData);
        const parsedObj = JSON.parse(jsonObj); // Convert jsonObj back to a JavaScript object
        const choicesArray = parsedObj.choices;
        let concatenatedChoices = '';
        choicesArray.forEach((choice) => {
          concatenatedChoices += choice.message.content; // Add each choice and a newline
        });

        // const choicesLines = concatenatedChoices.split('\n');
        const choicesLines = concatenatedChoices;
        htmlAnswers.push(choicesLines);
        loadHtmlToView(htmlAnswers);
        // appendContentToEditor(choicesLines);
      })
      .catch((error) => {
        console.error('Error:', error);
        throw error; // Rethrow the error to handle it outside this function
      });
  }
  if (method === 'GET') {
    fetch(url, {
      method: 'GET',
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) {
          try {
            // console.log(response);
            extFuncs.warnMsg(
              vscode,
              vscode.l10n.t(
                'Check if balance on https://platform.openai.com is positive?',
                language
              )
            );
            extFuncs.warnMsg(
              vscode,
              vscode.l10n.t('Check if Internet working?', language)
            );
            extFuncs.warnMsg(
              vscode,
              vscode.l10n.t('Check if you set GPT Api Key?', language)
            );
          } catch {
            throw new Error('Network response was not ok');
          }
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        throw error; // Rethrow the error to handle it outside this function
      });
  }
}
// module.exports = {
//   base64Handler,
//   remDuplicatesHandler,
//   shuffleHandler,
//   emptyLinesHandler,
//   capitalizeHandler,
// };
