#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
python_bin="${PYTHON:-python3.11}"
"$python_bin" -c 'import sys; assert sys.version_info[:2] == (3, 11), "Python 3.11 is required"'
"$python_bin" -m venv "$root/.tools/venv"
"$root/.tools/venv/bin/python" -m pip install --require-hashes -r "$root/services/voice-verifier/requirements.lock"
