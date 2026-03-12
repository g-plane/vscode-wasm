export PATH := './node_modules/.bin:' + env_var('PATH')

build-server target:
  esbuild ./src/server/{{target}}.ts --bundle --minify --platform={{target}} --outfile=dist/server-{{target}}.js
  cp ./node_modules/@wasm-language-tools/wasm/binding_wasm_bg.wasm ./dist/wat_service_binding_bg.wasm

build-node:
  esbuild ./src/node.ts --bundle --minify --platform=node --outdir=dist --external:vscode
  touch dist/web.js

build-web:
  esbuild ./src/web.ts --bundle --minify --format=cjs --outdir=dist --external:vscode
  touch dist/node.js

clean:
  rm -rf bin binding/pkg dist

package-node: clean (build-server 'node') build-node
  vsce package

package-web: clean (build-server 'browser') build-web
  vsce package --target web

package platform vscode-platform: clean build-node
  wget https://github.com/g-plane/wasm-language-tools/releases/latest/download/wat_server-{{platform}}.zip
  unzip -o wat_server-{{platform}}.zip -d bin
  rm wat_server-{{platform}}.zip
  vsce package --target {{vscode-platform}}
