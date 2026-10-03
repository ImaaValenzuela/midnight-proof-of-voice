import asyncio
import importlib.util
import json
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("verifier_app", Path(__file__).parents[1] / "app.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


async def request(method, path):
    messages = []

    async def receive():
        raise AssertionError("Scaffold endpoints must not read biometric input")

    async def send(message):
        messages.append(message)

    await module.app({"type": "http", "asgi": {"version": "3.0"}, "http_version": "1.1",
                      "method": method, "scheme": "http", "path": path, "raw_path": path.encode(),
                      "query_string": b"", "root_path": "", "headers": [],
                      "client": ("127.0.0.1", 1), "server": ("127.0.0.1", 8000)}, receive, send)
    return messages[0]["status"], json.loads(b"".join(m.get("body", b"") for m in messages[1:]))


class VerifierBoundaryTests(unittest.TestCase):
    def test_liveness_is_separate_from_readiness(self):
        self.assertEqual(asyncio.run(request("GET", "/health/live"))[0], 200)
        status, body = asyncio.run(request("GET", "/health/ready"))
        self.assertEqual(status, 503)
        self.assertFalse(body["ready"])

    def test_biometric_endpoints_fail_closed_without_reading_audio(self):
        for path in ["/voice/enroll", "/voice/verify"]:
            status, body = asyncio.run(request("POST", path))
            self.assertEqual(status, 501)
            self.assertEqual(body["error"], "NOT_IMPLEMENTED")
            self.assertFalse(body["ready"])
