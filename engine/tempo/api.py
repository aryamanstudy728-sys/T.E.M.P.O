"""HTTP layer: exposes the engine to the web app. Start with:
uvicorn tempo.api:app --port 8000
"""
import json
import pathlib
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from tempo import generate, params, scenarios

API_TIME_LIMIT_S = 6  # seconds the optimiser may search per request
SENSITIVITY_FILE = pathlib.Path(__file__).resolve().parents[2] / "data" / "cache" / "sensitivity.json"

app = FastAPI(title="T.E.M.P.O. engine")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class SimulateRequest(BaseModel):
    seed: int = 42
    scenario: str = "normal"
    ambient_c: Optional[float] = None
    vehicles: Optional[int] = Field(default=None, ge=1, le=12)
    villages: Optional[List[dict]] = None


@app.exception_handler(RequestValidationError)
async def _validation_message(request: Request, exc: RequestValidationError):
    """Always answer 422 with {"detail": "<one plain message>"}."""
    first = exc.errors()[0]
    where = ".".join(str(p) for p in first.get("loc", []) if p != "body")
    return JSONResponse(status_code=422,
                        content={"detail": f"{where}: {first.get('msg', 'invalid input')}"})


@app.get("/api/health")
def health():
    """Tell the web app the engine is running."""
    return {"status": "ok", "version": scenarios.VERSION}


@app.get("/api/sample")
def sample():
    """A valid villages list: the format the upload button accepts."""
    keep = ("id", "name", "lat", "lon", "volume_l", "milk_temp_c")
    villages = [{k: v[k] for k in keep} for v in generate.generate()["villages"]]
    return {"villages": villages}


@app.get("/api/assumptions")
def assumptions():
    """Every parameter with its value and whether it is sourced or guessed."""
    return {"version": scenarios.VERSION, "items": [
        {"name": name, "value": entry["value"],
         "status": entry.get("status", "guessed"), "note": entry.get("note", "")}
        for name, entry in params.PARAMS.items()
    ]}


@app.post("/api/simulate")
def simulate(req: SimulateRequest):
    """Run fixed, nearest-neighbour and risk-based routing for one scenario."""
    try:
        return scenarios.run(req.scenario, req.seed, req.ambient_c, req.vehicles,
                             req.villages, time_limit_s=API_TIME_LIMIT_S)
    except (ValueError, RuntimeError) as err:
        raise HTTPException(status_code=422, detail=str(err))


@app.get("/api/sensitivity")
def sensitivity():
    """Saved sweep results: where risk-based routing wins and where it does not."""
    if not SENSITIVITY_FILE.exists():
        raise HTTPException(
            status_code=503,
            detail="Sensitivity results not generated yet. Run: py run_sensitivity.py")
    return json.loads(SENSITIVITY_FILE.read_text(encoding="utf-8"))


# ---------------------------------------------------------------------------
# Static file serving (production): serve the built React frontend from /api-free
# paths so the whole app works from a single origin.
# ---------------------------------------------------------------------------
WEB_DIST = pathlib.Path(__file__).resolve().parents[2] / "web" / "dist"
if WEB_DIST.exists():
    from fastapi.staticfiles import StaticFiles
    app.mount("/", StaticFiles(directory=str(WEB_DIST), html=True), name="frontend")
