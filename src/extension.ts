// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as Path from 'path';
import kebabCase from '@queso/kebab-case';

export const findEmberComponent = (type : string = 'component') => () => {
	// if not workspaces , useless
	if (!vscode.workspace.workspaceFolders) { return; }
	
	// take the first wp at the moment , if you have ideas to find the current workspace ...
	const basepath : string = vscode.workspace.workspaceFolders[0].uri.fsPath;
	const editor = vscode.window.activeTextEditor;

	if (!editor) { return; } 

	const text : string = editor.document.getText(editor.selection);
	const parts : string[] = text.split("::"); // for namespaced components , delimiter is '::'

	if (text) {
		let usePods : boolean;
		let file : string;

		try {
			usePods = require(basepath + "/.ember-cli").usePods; // load 
		}catch(e) {
			usePods = false;
		}

		if(usePods) {
			const fileName = type === "component" ? `template.hbs` : `component.js`;
			file = Path.join(`${basepath}`,'app/pods/components',parts.map(p => kebabCase(p)).join('/'),fileName);
		}else{
			const extension : string = type === "component" ? `hbs` : `js`;
			if (parts.length > 1) {
				const last : string = parts.pop() as string; //never undefined
				parts.map(p => kebabCase(p)).join('/');
				file = Path.join(`${basepath}`,'app/components',parts.map(p => kebabCase(p)).join('/'),`${kebabCase(last)}.${extension}`);
			}else{
				file = Path.join(`${basepath}`,'app/components',`${kebabCase(text)}.${extension}`);
			}
		}

		//open in workspace asynchronously
		vscode.workspace.openTextDocument(file)
			.then(
			(doc) => {
				vscode.window.showTextDocument(doc);
			},
			(err) => {
				vscode.window.showErrorMessage(`Cannot find component ${kebabCase(text)}`);
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
