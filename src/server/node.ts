import { LanguageService, initSync } from '@wasm-language-tools/wasm'
import * as fs from 'node:fs/promises'
import { createConnection } from 'vscode-languageserver/node'
import { bindConnection } from './common.js'

async function main() {
  const bytes = await fs.readFile(process.argv[2]!)
  initSync({ module: await WebAssembly.compile(new Uint8Array(bytes)) })
  const connection = createConnection()
  const service = new LanguageService()
  bindConnection(service, connection)
  connection.listen()
}
main()
