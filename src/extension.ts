import * as vscode from 'vscode'
import { setupLspClient } from './lsp.js'

export async function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel('WebAssembly Language Tools')
  context.subscriptions.push(outputChannel)

  let client = await setupLspClient(context, outputChannel)
  if (client) {
    client.start()
    context.subscriptions.push(client)
  }

  context.subscriptions.push(
    vscode.commands.registerCommand('wasmLanguageTools.restart', async () => {
      if (client?.isRunning()) {
        await client.restart()
      }
    })
  )
}

export function deactivate() {}
