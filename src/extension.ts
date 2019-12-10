// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as Path from 'path';
import kebabCase from '@queso/kebab-case';

export const findEmberComponent = (type : string = 'component') => () => {
	// The code you place here will be executed every time your command is executed
	if (!vscode.workspace.workspaceFolders) { return; }
	
	const basepath = vscode.workspace.workspaceFolders[0].uri.fsPath;

	const editor = vscode.window.activeTextEditor;

	if (!editor) { return; } 

	const text = editor.document.getText(editor.selection);

	if (text) {
		const emberCLIconfig = require(basepath + "/.ember-cli");
		const kebabText = kebabCase(text);
		let file;

		if(emberCLIconfig.usePods === true) {
			const fileName = type === "component" ? `template.hbs` : `component.js`;
			file = Path.join(`${basepath}`,'app/pods/components',kebabText,fileName);
		}else{
			const extension = type === "component" ? `hbs` : `js`;
			file = Path.join(`${basepath}`,'app/components',`${kebabText}.${extension}`);
		}

		vscode.workspace.openTextDocument(vscode.Uri.parse("file:///" + file))
			.then(
			(doc) => {
				vscode.window.showTextDocument(doc);
			},
			(err) => {
				vscode.window.showErrorMessage(`Cannot find component ${kebabText}`);
			}
		);
	}
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ember-component-jumper" is now active!');

	const disposableECComponent = vscode.commands.registerCommand('extension.findEmberComponentTemplate',findEmberComponent('component'));
	const disposableECControler = vscode.commands.registerCommand('extension.findEmberComponentClass',findEmberComponent('class'));

	context.subscriptions.push(disposableECComponent);
	context.subscriptions.push(disposableECControler);
}

// this method is called when your extension is deactivated
export function deactivate() {}
