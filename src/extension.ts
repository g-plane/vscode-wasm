import * as vscode from 'vscode'
import type { LanguageClient, Location, Position } from 'vscode-languageclient/node.js'
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
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'wasmLanguageTools.showReferences',
      (uri: string, position: Position, locations: Location[]) => {
        if (!client) {
          return
        }
        vscode.commands.executeCommand(
          'editor.action.showReferences',
          vscode.Uri.parse(uri),
          client.protocol2CodeConverter.asPosition(position),
          locations.map((location) => client!.protocol2CodeConverter.asLocation(location)),
        )
      },
    ),
  )
}

export function deactivate() {
  client?.stop()
}
