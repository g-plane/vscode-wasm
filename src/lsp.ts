import * as os from 'node:os'
import * as vscode from 'vscode'
import {
  LanguageClient,
  type LanguageClientOptions,
  type ServerOptions,
} from 'vscode-languageclient/node'
import which from 'which'

export async function setupLspClient(outputChannel: vscode.OutputChannel) {
  const executablePath = await findExecutable()
  outputChannel.appendLine(`Using server: ${executablePath}`)
  const serverOptions: ServerOptions = {
    run: {
      command: executablePath,
      args: [],
    },
    debug: {
      command: executablePath,
      args: ['--debug'],
    },
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ language: 'wat' }],
    outputChannel,
  }
  return new LanguageClient('wat', serverOptions, clientOptions)
}

async function findExecutable() {
  const configuration = vscode.workspace.getConfiguration('wasmLanguageTools')
  const path = os.platform() === 'win32'
    ? (configuration.get<string>('executablePath.win') || 'wat_server.exe')
    : (configuration.get<string>('executablePath.unix') || 'wat_server')
  return which(path)
}
