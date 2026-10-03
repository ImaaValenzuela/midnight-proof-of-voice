"""Smoke-test both real HTTP servers; requires permission to bind loopback ports."""
import json
from pathlib import Path
import subprocess
import sys
import time
import urllib.error
import urllib.request

root = Path(__file__).resolve().parents[1]


def request(port, path, method="GET"):
    req = urllib.request.Request(f"http://127.0.0.1:{port}{path}", method=method)
    try:
        response = urllib.request.urlopen(req, timeout=2)
    except urllib.error.HTTPError as error:
        response = error
    with response:
        return response.status, json.load(response)


commands = [
    (3000, ["node", "services/api/dist/server.js"], "/v1/generations"),
    (8000, [sys.executable, "-m", "uvicorn", "app:app", "--app-dir", "services/voice-verifier",
            "--host", "127.0.0.1", "--port", "8000", "--no-access-log"], "/voice/verify"),
]
for port, command, operation in commands:
    process = subprocess.Popen(command, cwd=root)
    try:
        deadline = time.monotonic() + 10
        while True:
            if process.poll() is not None:
                raise RuntimeError(f"Server on port {port} exited before becoming live")
            try:
                assert request(port, "/health/live")[0] == 200
                break
            except (urllib.error.URLError, ConnectionError):
                if time.monotonic() >= deadline:
                    raise RuntimeError(f"Server on port {port} did not become live")
                time.sleep(0.1)
        for path, method, expected in [("/health/ready", "GET", 503), (operation, "POST", 501)]:
            status, body = request(port, path, method)
            assert status == expected and body["ready"] is False, (port, path, status)
        print(f"HTTP boundary passed on port {port}")
    finally:
        process.terminate()
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait()
