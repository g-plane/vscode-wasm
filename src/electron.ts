import * as vscode from 'vscode'
import { type Location, type Position, LanguageClient } from 'vscode-languageclient/node'
import { findExecutable } from './executable.js'
import { showReferences } from './languages.js'

let client: LanguageClient | undefined

export async function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel('WebAssembly Language Tools')
  context.subscriptions.push(outputChannel)

  const executablePath = await findExecutable(context)
  if (!executablePath) {
    return
  }

  outputChannel.appendLine(`Using server: ${executablePath}`)
  client = new LanguageClient(
    'wat',
    {
      run: {
        command: executablePath,
        args: [],
      },
      debug: {
        command: executablePath,
        args: ['--debug'],
      },
    },
    {
      documentSelector: [{ language: 'wat' }],
      outputChannel,
    },
  )
  client.start()

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
        if (client) {
          showReferences(client, uri, position, locations)
        }
      },
    ),
  )
}

export function deactivate() {
  return client?.stop()
}
