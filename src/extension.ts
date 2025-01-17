import * as vscode from 'vscode'
import { download } from './download.js'
import { getDownloadedExePath, setupLspClient } from './lsp.js'

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
  context.subscriptions.push(vscode.commands.registerCommand(
    'wasmLanguageTools.downloadServer',
    async () => {
      await download(context, getDownloadedExePath(context), async () => {
        if (client) {
          await client.stop()
          await client.dispose()
        }
      })
      client = await setupLspClient(context, outputChannel)
      if (client) {
        client.start()
        context.subscriptions.push(client)
      }
    }
  ))
}

export function deactivate() {}
