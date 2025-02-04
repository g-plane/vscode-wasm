#!/usr/bin/env bash
set -ex

pnpx @vscode/vsce package

wget https://github.com/g-plane/wasm-language-tools/releases/latest/download/wat_server-x86_64-linux.zip
unzip -o wat_server-x86_64-linux.zip -d bin
rm wat_server-x86_64-linux.zip
pnpx @vscode/vsce package --target linux-x64
rm -r bin

wget https://github.com/g-plane/wasm-language-tools/releases/latest/download/wat_server-x86_64-macos.zip
unzip -o wat_server-x86_64-macos.zip -d bin
rm wat_server-x86_64-macos.zip
pnpx @vscode/vsce package --target darwin-x64
rm -r bin

wget https://github.com/g-plane/wasm-language-tools/releases/latest/download/wat_server-arm-macos.zip
unzip -o wat_server-arm-macos.zip -d bin
rm wat_server-arm-macos.zip
pnpx @vscode/vsce package --target darwin-arm64
rm -r bin

wget https://github.com/g-plane/wasm-language-tools/releases/latest/download/wat_server-x86_64-windows.zip
unzip -o wat_server-x86_64-windows.zip -d bin
rm wat_server-x86_64-windows.zip
pnpx @vscode/vsce package --target win32-x64
rm -r bin
