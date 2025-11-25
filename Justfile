[working-directory: 'binding']
build-binding:
  cargo build --target=wasm32-unknown-unknown --release
  wasm-bindgen --out-dir=../bin --target=web --omit-default-module-path target/wasm32-unknown-unknown/release/wat_service_binding.wasm

build-server: build-binding
  pnpm esbuild ./src/server/browser.ts --bundle --minify --outfile=dist/server-browser.js

build-electron:
  pnpm esbuild ./src/electron.ts --bundle --minify --platform=node --outdir=dist --external:vscode

build-web:
  pnpm esbuild ./src/web.ts --bundle --minify --format=cjs --outdir=dist --external:vscode
