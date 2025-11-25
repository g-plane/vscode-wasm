import {
  BrowserMessageReader,
  BrowserMessageWriter,
  createConnection,
} from 'vscode-languageserver/browser'
import init, { LanguageService } from '../../bin/wat_service_binding.js'
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
