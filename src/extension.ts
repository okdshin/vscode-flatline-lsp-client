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

	let extConfig = workspace.getConfiguration("flatline-lsp-client");

	const serverExe: string = extConfig.get<string>("flatline_lsp_bin", "flatline-lsp");
	const argsStr: string = extConfig.get<string>("args_str", "");
	const args: Array<string> = argsStr.split(" ");

	// サーバーの設定
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
	var documentTypeList = Array<any>();
	for(let lang of languageList) {
		documentTypeList.push({language: lang});
	}
	let sel: DocumentSelector = documentTypeList;
	const clientOptions: LanguageClientOptions = {
		documentSelector: sel,
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