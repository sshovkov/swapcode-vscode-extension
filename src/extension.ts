import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('swaptext.swap', () => {
		// Get active text editor
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		// Get the current selection of text
		const selection = editor.selection;
		const text = editor.document.getText(selection);

		// Get the text from the clipboard
		vscode.env.clipboard.readText().then((clipboardText) => {

			// Replace the text in the editor with the text from the clipboard
			editor.edit((editBuilder) => {
				editBuilder.replace(selection, clipboardText);
			}).then(() => {
				// Replace the text in the clipboard with the text from the editor
				vscode.env.clipboard.writeText(text);
			});
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
