import * as vscode from 'vscode'
import { type Location, type Position, LanguageClient } from 'vscode-languageclient/browser'
import { showReferences } from './languages.js'

let client: LanguageClient | undefined

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel('WebAssembly Language Tools')
  context.subscriptions.push(outputChannel)

  const wasmPath = vscode.Uri.joinPath(context.extensionUri, './bin/wat_service_binding_bg.wasm')
    .toString()
  outputChannel.appendLine(`Using server: ${wasmPath}`)

  const worker = new Worker(
    vscode.Uri.joinPath(context.extensionUri, './dist/server-browser.js').toString(),
  )
  worker.addEventListener('message', () => {
    client = new LanguageClient(
      'wat',
      'WebAssembly Language Tools',
      {
        documentSelector: [{ language: 'wat' }],
        outputChannel,
      },
      worker,
    )
    client.start()
  }, { once: true })
  worker.postMessage(wasmPath)

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'wasmLanguageTools.showReferences',
      async (uri: string, position: Position, locations: Location[]) => {
        if (client) {
          await showReferences(client, uri, position, locations)
        }
      },
    ),
  )
}

export function deactivate() {
  return client?.stop()
}
