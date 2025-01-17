import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import * as path from 'node:path'
import * as vscode from 'vscode'
import {
  LanguageClient,
  type LanguageClientOptions,
  type ServerOptions,
} from 'vscode-languageclient/node'
import which from 'which'
import { checkUpdate, download } from './download.js'

export async function setupLspClient(
  context: vscode.ExtensionContext,
  outputChannel: vscode.OutputChannel,
) {
  const executablePath = await findExecutable(context)
  if (!executablePath) {
    return
  }

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

async function findExecutable(context: vscode.ExtensionContext) {
  const configuration = vscode.workspace.getConfiguration('wasmLanguageTools')
  const exePath = os.platform() === 'win32'
    ? (configuration.get<string>('executablePath.win') || 'wat_server.exe')
    : (configuration.get<string>('executablePath.unix') || 'wat_server')
  try {
    return await which(exePath)
  } catch {
    // fall through
  }

  const downloadedExePath = getDownloadedExePath(context)
  try {
    await fs.stat(downloadedExePath)
    void checkUpdate(downloadedExePath)
    return downloadedExePath
  } catch {
    // fall through
  }

  const answer = await vscode.window.showWarningMessage(
    `Could not find executable "${exePath}". Would you like to download it?`,
    'Yes',
    'No'
  )
  if (answer === 'Yes') {
    await download(context, downloadedExePath)
    return downloadedExePath
  }
}

export function getDownloadedExePath(context: vscode.ExtensionContext) {
  const isWindows = os.platform() === 'win32'
  // For example, on Linux, it will be
  // ~/.config/Code/User/globalStorage/gplane.wasm-language-tools/wat_server
  return path.join(context.globalStorageUri.fsPath, isWindows ? 'wat_server.exe' : 'wat_server')
}
