[working-directory: 'binding']
build-binding target:
  cargo build --target=wasm32-unknown-unknown --release
  wasm-bindgen --out-dir=pkg --target={{ if target == "node" { "nodejs" } else { "web" } }} \
    --omit-default-module-path target/wasm32-unknown-unknown/release/wat_service_binding.wasm

build-server target: (build-binding target)
  pnpm esbuild ./src/server/{{target}}.ts --bundle --minify --platform={{target}} --outfile=dist/server-{{target}}.js
  cp ./binding/pkg/wat_service_binding_bg.wasm ./dist/wat_service_binding_bg.wasm

build-node:
  pnpm esbuild ./src/node.ts --bundle --minify --platform=node --outdir=dist --external:vscode

build-web: (build-server "browser")
  pnpm esbuild ./src/web.ts --bundle --minify --format=cjs --outdir=dist --external:vscode

clean:
  rm -rf bin
  rm -rf binding/pkg
  rm -rf dist
