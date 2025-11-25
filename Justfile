export PATH := './node_modules/.bin:' + env_var('PATH')

[working-directory('binding')]
build-binding target:
  cargo build --target=wasm32-unknown-unknown --release
  wasm-bindgen --out-dir=pkg --target={{ if target == 'node' { 'nodejs' } else { 'web' } }} \
    --omit-default-module-path target/wasm32-unknown-unknown/release/wat_service_binding.wasm

build-server target: (build-binding target)
  esbuild ./src/server/{{target}}.ts --bundle --minify --platform={{target}} --outfile=dist/server-{{target}}.js
  cp ./binding/pkg/wat_service_binding_bg.wasm ./dist/wat_service_binding_bg.wasm

build-node:
  esbuild ./src/node.ts --bundle --minify --platform=node --outdir=dist --external:vscode

build-web: (build-server 'browser')
  esbuild ./src/web.ts --bundle --minify --format=cjs --outdir=dist --external:vscode

clean:
  rm -rf bin binding/pkg dist

package-node: clean (build-server 'node') build-node
  pnpx @vscode/vsce package

package-web: clean build-web
  pnpx @vscode/vsce package --target web

package platform vscode-platform: clean build-node
  wget https://github.com/g-plane/wasm-language-tools/releases/latest/download/wat_server-{{platform}}.zip
  unzip -o wat_server-{{platform}}.zip -d bin
  rm wat_server-{{platform}}.zip
  pnpx @vscode/vsce package --target {{vscode-platform}}
