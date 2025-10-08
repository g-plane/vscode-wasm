import * as vscode from 'vscode'
import type { LanguageClient } from 'vscode-languageclient/node.js'
import { setupLspClient } from './lsp.js'

let client: LanguageClient | undefined

export async function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel('WebAssembly Language Tools')
  context.subscriptions.push(outputChannel)

  client = await setupLspClient(context, outputChannel)
  if (client) {
    client.start()
    context.subscriptions.push(client)
  }

  context.subscriptions.push(
    vscode.commands.registerCommand('wasmLanguageTools.restart', async () => {
      if (client?.isRunning()) {
        await client.restart()
      }
    }),
  )
}

export function deactivate() {
  client?.stop()
}
