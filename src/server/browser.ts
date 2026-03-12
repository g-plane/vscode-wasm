import init, { LanguageService } from '@wasm-language-tools/wasm'
import {
  BrowserMessageReader,
  BrowserMessageWriter,
  createConnection,
} from 'vscode-languageserver/browser'
import { bindConnection } from './common.js'

self.addEventListener('message', async (event) => {
  await init(event.data)
  const service = new LanguageService()
  const connection = createConnection(
    new BrowserMessageReader(self),
    new BrowserMessageWriter(self),
  )
  bindConnection(service, connection)
  connection.listen()
  self.postMessage('loaded')
}, { once: true })
