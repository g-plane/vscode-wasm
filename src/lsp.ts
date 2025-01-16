import got from 'got'
import jszip from 'jszip'
import { createWriteStream } from 'node:fs'
import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import * as path from 'node:path'
import { pipeline } from 'node:stream/promises'
import * as vscode from 'vscode'
import {
  LanguageClient,
  type LanguageClientOptions,
  type ServerOptions,
} from 'vscode-languageclient/node'
import which from 'which'

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

  const isWindows = os.platform() === 'win32'
  // For example, on Linux, it will be
  // ~/.config/Code/User/globalStorage/gplane.wasm-language-tools/wat_server
  const downloadedExePath = path.join(
    context.globalStorageUri.fsPath,
    isWindows ? 'wat_server.exe' : 'wat_server'
  )
  try {
    await fs.stat(downloadedExePath)
    return downloadedExePath
  } catch {
    // fall through
  }

  const answer = await vscode.window.showWarningMessage(
    `Could not find executable "${exePath}". Would you like to download it?`,
    'Yes',
    'No'
  )
  if (answer !== 'Yes') {
    return
  }
  const zipPath = path.join(os.tmpdir(), 'wat_server.zip')
  await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'Downloading WebAssembly Language Tools',
    cancellable: true,
  }, async (progress, token) => {
    const abortController = new global.AbortController()
    token.onCancellationRequested(() => abortController.abort())

    const stream = got.stream(getReleaseURL(), { signal: abortController.signal })
    await new Promise((resolve, reject) => {
      stream.on('response', resolve)
      stream.once('error', reject)
    })
    let lastPercent = 0
    stream.on('downloadProgress', ({ total, percent }) => {
      if (total > 0) {
        progress.report({ increment: (percent - lastPercent) * 100 })
        lastPercent = percent
      }
    })
    progress.report({ increment: 0 })
    await pipeline(stream, createWriteStream(zipPath), { signal: abortController.signal })
  })

  const zip = await jszip.loadAsync(await fs.readFile(zipPath))
  await fs.mkdir(context.globalStorageUri.fsPath, { recursive: true })
  await pipeline(
    zip.file(isWindows ? 'wat_server.exe' : 'wat_server')!.nodeStream(),
    createWriteStream(downloadedExePath)
  )
  if (!isWindows) {
    await fs.chmod(downloadedExePath, 0o755)
  }
  await fs.unlink(zipPath)
  return downloadedExePath
}

function getReleaseURL() {
  switch (os.platform()) {
    case 'linux':
      return 'https://github.com/g-plane/wasm-language-tools/releases/latest/download/wat_server-x86_64-linux.zip'
    case 'darwin':
      return os.arch() === 'x64'
        ? 'https://github.com/g-plane/wasm-language-tools/releases/latest/download/wat_server-x86_64-macos.zip'
        : 'https://github.com/g-plane/wasm-language-tools/releases/latest/download/wat_server-arm-macos.zip'
    case 'win32':
      return 'https://github.com/g-plane/wasm-language-tools/releases/latest/download/wat_server-x86_64-windows.zip'
  }
}
