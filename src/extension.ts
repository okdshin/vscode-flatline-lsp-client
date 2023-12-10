'use strict';

import { ExtensionContext, StatusBarAlignment, commands, languages, window, workspace} from 'vscode';
import {
	DocumentSelector,
	LanguageClient,
	LanguageClientOptions,
	RevealOutputChannelOn,
	ServerOptions,
	TransportKind } from 'vscode-languageclient/node';

let client: LanguageClient;

export async function activate(context: ExtensionContext) {
	console.debug("Flatline-LSP started", new Date());

	const statusBar = window.createStatusBarItem(StatusBarAlignment.Right);
	statusBar.text = "$(light-bulb)";
	statusBar.tooltip = `Flatline-LSP - Ready`;
	statusBar.show();

	let extConfig = workspace.getConfiguration("flatlineLspClient");

	const serverExe: string = extConfig.get<string>("flatlineLspBin", "flatline-lsp");
	const argsStr: string = extConfig.get<string>("argsStr", "");
	const args: Array<string> = argsStr.split(" ");

	const serverOptions: ServerOptions = {
		run: {
			command: serverExe,
			args: args,
			transport: TransportKind.stdio,
			options: { cwd: process.cwd() }
		},
		debug: {
			command: serverExe,
			args: args,
			transport: TransportKind.stdio,
			options: { cwd: process.cwd() },
		},
	};

	const languageList: string = extConfig.get<string>("languages", "plaintext");
	const selector: DocumentSelector = languageList.split(",").map(lang => {
		return {
			language: lang.trim(),
			scheme: "file",
		};
	});

	const clientOptions: LanguageClientOptions = {
		documentSelector: selector,
		diagnosticCollectionName: 'flatline-lsp',
		revealOutputChannelOn: RevealOutputChannelOn.Never,
		initializationOptions: {},
		progressOnInitialization: true,
	};

	try {
		client = new LanguageClient('flatline-lsp-client', serverOptions, clientOptions);
	} catch (err) {
		await window.showErrorMessage('Failed to start extension. Please refer to the output panel for details.');
		return;
	}
	client.start().catch((error: any) => client.error(`Starting the server failed.`, error, 'force'));
}

export async function deactivate(): Promise<void> {
	if (client) {
		await client.stop();
	}
}