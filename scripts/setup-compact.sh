#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [[ "$(uname -s)-$(uname -m)" != "Linux-x86_64" ]]; then
  echo 'This bootstrap targets Linux x86_64. See docs/development.md for other platforms.' >&2
  exit 1
fi
mkdir -p .tools/bin .tools/compactc
task_tmp=$(mktemp -d)
trap 'rm -rf "$task_tmp"' EXIT
curl -fL --retry 3 https://github.com/midnightntwrk/compact/releases/download/compact-v0.5.1/compact-x86_64-unknown-linux-musl.tar.xz -o "$task_tmp/cli.tar.xz"
curl -fL --retry 3 https://github.com/midnightntwrk/compact/releases/download/compactc-v0.31.1/compactc_v0.31.1_x86_64-unknown-linux-musl.zip -o "$task_tmp/compiler.zip"
(cd "$task_tmp" && printf '%s\n' \
  '684c6b3d2eef9484aabba7a0820c166ae5c169f3aecf28cbea2074840263ba66  cli.tar.xz' \
  'e291b4bab4d4e857707008f8b1c25c2b8e0c843f6c737d0ee6c0d9ac69a6bbfb  compiler.zip' | sha256sum -c -)
tar -xJf "$task_tmp/cli.tar.xz" -C "$task_tmp"
cp "$task_tmp/compact-x86_64-unknown-linux-musl/compact" .tools/bin/compact
python3 - "$task_tmp/compiler.zip" <<'PY'
import sys, zipfile
with zipfile.ZipFile(sys.argv[1]) as archive:
    archive.extractall('.tools/compactc')
PY
chmod +x .tools/bin/compact .tools/compactc/*
.tools/bin/compact --version
.tools/compactc/compactc.bin --version
