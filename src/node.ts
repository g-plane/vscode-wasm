import * as vscode from 'vscode'
import {
  type Location,
  type Position,
  type ServerOptions,
  LanguageClient,
} from 'vscode-languageclient/node'
import { findExecutable } from './executable.js'
import { showReferences } from './languages.js'

let client: LanguageClient | undefined

export async function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel('WebAssembly Language Tools', {
    log: true,
  })
  context.subscriptions.push(outputChannel)

  let serverOptions: ServerOptions
  const executablePath = await findExecutable(context)
  if (executablePath) {
    const args = vscode.workspace.getConfiguration('wasmLanguageTools').get<string[]>(
      'executableArgs',
      [],
    )
    outputChannel.appendLine(
      `Starting server: ${executablePath}${args.map((arg) => ` ${arg}`).join('')}`,
    )
    serverOptions = { command: executablePath, args }
  } else {
    outputChannel.appendLine(
      `Using server: ${context.asAbsolutePath('dist/wat_service_binding_bg.wasm')}`,
    )
    serverOptions = {
      module: context.asAbsolutePath('dist/server-node.js'),
      args: [context.asAbsolutePath('dist/wat_service_binding_bg.wasm')],
    }
  }

  client = new LanguageClient(
    'wat',
    serverOptions,
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
