import * as vscode from 'vscode'
import type { BaseLanguageClient, Location, Position } from 'vscode-languageclient'

export function showReferences(
  client: BaseLanguageClient,
  uri: string,
  position: Position,
  locations: Location[],
) {
  return vscode.commands.executeCommand(
    'editor.action.showReferences',
    vscode.Uri.parse(uri),
    client.protocol2CodeConverter.asPosition(position),
    locations.map((location) => client.protocol2CodeConverter.asLocation(location)),
  )
}
