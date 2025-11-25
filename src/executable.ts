import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import * as vscode from 'vscode'
import which from 'which'

export async function findExecutable(context: vscode.ExtensionContext) {
  const configuration = vscode.workspace.getConfiguration('wasmLanguageTools')
  const exePath = os.platform() === 'win32'
    ? (configuration.get<string>('executablePath.win') || 'wat_server.exe')
    : (configuration.get<string>('executablePath.unix') || 'wat_server')
  try {
    return await which(exePath)
  } catch {
    // fall through
  }

  const bundledExePath = getBundledExePath(context)
  try {
    await fs.stat(bundledExePath)
    return bundledExePath
  } catch {
    // fall through
  }

  vscode.window.showErrorMessage(
    `No prebuilt wat_server executable exists for your platform; please install it manually.`,
  )
}

function getBundledExePath(context: vscode.ExtensionContext) {
  const name = os.platform() === 'win32' ? 'wat_server.exe' : 'wat_server'
  return vscode.Uri.joinPath(context.extensionUri, 'bin', name).fsPath
}
