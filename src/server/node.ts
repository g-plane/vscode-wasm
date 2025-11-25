import { createConnection } from 'vscode-languageserver/node'
import { LanguageService } from '../../binding/pkg/wat_service_binding.js'
import { bindConnection } from './common.js'

const connection = createConnection()
const service = new LanguageService()
bindConnection(service, connection)
connection.listen()
