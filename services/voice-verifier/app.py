"""Private verifier boundary. No audio is read, stored, or scored yet."""
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI(title="VoiceProof private verifier", version="0.0.0", docs_url=None, redoc_url=None, openapi_url=None)


@app.get("/health/live")
async def live():
    return {"service": "voiceproof-verifier", "live": True}


@app.get("/health/ready")
async def ready():
    return JSONResponse(status_code=503, content={
        "service": "voiceproof-verifier", "stage": "scaffold", "ready": False,
        "missing": ["service-authentication", "speaker-model", "phrase-check", "anti-spoofing", "attestation-signing"],
    })


@app.post("/voice/enroll")
@app.post("/voice/verify")
async def unavailable():
    return JSONResponse(status_code=501, content={
        "error": "NOT_IMPLEMENTED", "message": "Biometric verification is not implemented.", "ready": False,
    })
