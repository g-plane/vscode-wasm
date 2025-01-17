import { spawn } from 'cross-spawn'
import got from 'got'
import jszip from 'jszip'
import { createWriteStream } from 'node:fs'
import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import * as path from 'node:path'
import { pipeline } from 'node:stream/promises'
import * as vscode from 'vscode'

export async function download(
  context: vscode.ExtensionContext,
  downloadedExePath: string,
  beforeWriteExe?: () => Promise<void>,
) {
  const isWindows = os.platform() === 'win32'
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
  await beforeWriteExe?.()
  await pipeline(
    zip.file(isWindows ? 'wat_server.exe' : 'wat_server')!.nodeStream(),
    createWriteStream(downloadedExePath)
  )
  if (!isWindows) {
    await fs.chmod(downloadedExePath, 0o755)
  }
  await fs.unlink(zipPath)
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

export async function checkUpdate(downloadedExePath: string) {
  const process = spawn(downloadedExePath, ['-v'])
  const current = await new Promise<string>((resolve, reject) => {
    let stdout = ''
    process.stdout.setEncoding('utf8')
    process.stdout.on('data', (data) => stdout += data)
    process.stdout.on('end', () => resolve(stdout.trim().replace(/^wat_server /, '')))
    process.stdout.on('error', reject)
  })
  const { tag_name: latest } = await got.get(
    'https://api.github.com/repos/g-plane/wasm-language-tools/releases/latest'
  ).json<{ tag_name: string }>()
  if (current !== latest) {
    vscode.commands.executeCommand('wasmLanguageTools.downloadServer')
  }
}
