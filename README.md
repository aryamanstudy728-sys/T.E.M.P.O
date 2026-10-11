# T.E.M.P.O.

**Milk-collection routing and thermal-risk simulator.**

Milk collected from small villages warms up while it travels to the chilling centre, and bacteria multiply as it does. If a truck takes too long, the milk can spoil before it is cooled. T.E.M.P.O. estimates how much safety time each village's milk has left, then compares three ways of planning the collection routes so you can see which one protects the most milk.

> **Note:** All village data is **simulated** (a seeded generator centred on a sample chilling centre). Most model parameters are **guesses** that still need to be verified against FSSAI / NDDB standards. See the Assumptions page in the app. This is a planning and demo tool, not a food-safety certification.

---

## What it does

- **Thermal safety buffer.** For each village it calculates the hours left before the milk reaches its quality limit, after subtracting transit and cooling time.
- **Risk bands.** Green: buffer above 2.5 h. Yellow: between 0.5 h and 2.5 h. Red: below 0.5 h.
- **Three routing methods, compared side by side:**
  - **Fixed**: a predefined route, like many cooperatives use today.
  - **Nearest-neighbour**: always drive to the closest unvisited village.
  - **Risk-based**: an optimiser (Google OR-Tools) that orders pickups so the most urgent milk is collected first.
- **Four scenarios:** `normal`, `heatwave`, `slow_roads`, `cooler_failure`. You can also change the number of vehicles (1-12) or upload your own village list.
- **Alerts** for villages with low buffer (`warning` / `critical`), and a plain-language explanation of the result.
- **Assumptions page** showing every parameter and whether it is *sourced* or *guessed*.
- **Sensitivity page** showing where risk-based routing wins and where it does not.

---

## Project structure

```
T.E.M.P.O TechZ's/
├── engine/                 Python backend (FastAPI + optimiser)
│   ├── tempo/              api.py, generate.py, risk.py, baselines.py,
│   │                       optimise.py, scenarios.py, sensitivity.py,
│   │                       explain.py, params.py
│   ├── tests/              pytest suite (31 tests)
│   ├── make_sample.py      regenerates contract/simulate.sample.json
│   ├── run_sensitivity.py  regenerates data/cache/sensitivity.json
│   └── requirements.txt
├── web/                    React + TypeScript frontend (Vite)
│   ├── src/api/            API client, types, React Query hooks
│   ├── src/pages/          Dashboard, Routes, Alerts, Analytics
│   ├── src/components/     tables, map, controls, upload, etc.
│   └── src/lib/            helper logic (+ tests)
├── contract/               Sample JSON for every API response (the agreed data shape)
├── data/cache/             Saved sensitivity results used by the API
└── .kombai/                Original UI design mockups (reference only)
```

---UPDATE NOW A DEPLOYED WEBSITE IS AVAILABLE - https://tempo-techz-production.up.railway.app/

## Tech stack

| Part | Technology |
|------|------------|
| Backend | Python, FastAPI, Uvicorn, Pydantic, NumPy |
| Optimiser | Google OR-Tools |
| Risk model | Exponential cooling model + Ratkowsky bacterial-growth model |
| Frontend | React 19, TypeScript, Vite |
| Data fetching / routing | TanStack React Query, React Router |
| Map | Leaflet + react-leaflet (needs internet for map tiles) |
| UI | Tabler icons, DM Sans, IBM Plex Mono |
| Testing | pytest (backend), Vitest (frontend), oxlint (lint) |
| UI design | Designed with Kombai, built into data-driven pages |

---

## Getting started

### Requirements

- Python 3.12 or newer
- Node.js 20 or newer (with npm)

On Windows use `py`. On macOS or Linux use `python3` instead.

### 1. Start the backend

```powershell
cd engine
py -m pip install -r requirements.txt
py -m uvicorn tempo.api:app --port 8000
```

Check that it works: open <http://localhost:8000/api/health>. You should see `{"status":"ok","version":1}`. Interactive API docs are at <http://localhost:8000/docs>.

### 2. Start the frontend

In a second terminal:

```powershell
cd web
npm install
npm run dev
```

Open the address Vite prints (normally <http://localhost:5173>).

During development, Vite forwards every `/api` request to `http://localhost:8000` (see `web/vite.config.ts`), so the two servers connect without extra setup.

### Environment variable

`web/.env.local` controls whether the frontend uses the real engine or built-in sample data:

```
VITE_USE_MOCK=0    # use the real backend (default for normal use)
VITE_USE_MOCK=1    # use the sample JSON from contract/ (works without the backend)
```

`web/.env.example` ships with `VITE_USE_MOCK=1`. If you copy it as-is, the app will show sample data and will not talk to the engine. Set it to `0` for real use.

---

## API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Confirms the engine is running |
| GET | `/api/sample` | A valid village list (the format the upload accepts) |
| GET | `/api/assumptions` | Every parameter, its value, and sourced / guessed status |
| POST | `/api/simulate` | Runs all three routing methods for one scenario |
| GET | `/api/sensitivity` | Saved results of the sensitivity sweep |

**`POST /api/simulate` body** (all fields optional):

```json
{
  "seed": 42,
  "scenario": "heatwave",
  "ambient_c": 42,
  "vehicles": 5,
  "villages": [
    { "id": "V01", "name": "Village 01", "lat": 22.6, "lon": 72.9, "volume_l": 400, "milk_temp_c": 33 }
  ]
}
```

**Response** includes `meta`, `centre`, `villages` (each with `buffer_h` and `band`), `methods` (`fixed`, `nearest`, `risk_based`, each with routes, breaches and volume at risk), `best_method`, `alerts`, and `explanation`. A call can take up to about 6 seconds because the optimiser searches within a time limit.

**Errors** come back as `{"detail": "<plain message>"}` with status `422` (bad input) or `503` (sensitivity results not generated yet).

The exact response shapes are in [`contract/`](contract/).

---

## Testing

```powershell
# Backend (31 tests)
cd engine
py -m pytest -q

# Frontend
cd web
npm test
npm run lint
npm run build
```

### Regenerating saved data

```powershell
cd engine
py make_sample.py        # rewrites contract/simulate.sample.json from the real engine
py run_sensitivity.py    # rewrites data/cache/sensitivity.json
```

---

## Troubleshooting

| Problem | Likely cause and fix |
|---------|----------------------|
| UI shows sample data even though the backend is running | `VITE_USE_MOCK` is `1`. Set it to `0` in `web/.env.local` and restart `npm run dev`. |
| Requests fail or the page shows an error | The backend is not running on port 8000. Start it and check `/api/health`. |
| A simulation takes several seconds | Normal. The optimiser searches for up to about 6 seconds per request. |
| `/api/sensitivity` returns 503 | Run `py run_sensitivity.py` from `engine/`. |
| Map shows grey squares | Leaflet map tiles need an internet connection. |
| Browser blocks API calls when not using `npm run dev` | The backend only allows requests from `localhost:5173` / `127.0.0.1:5173`. Add your origin in `engine/tempo/api.py` (CORS settings). |

---

## Limitations

- Village data is simulated, not live telemetry.
- Most parameters (cooling targets, growth model, speeds, bands) are marked as guesses and need verification.
- The explanation text is currently template-based.
- Risk bands are model estimates, not a guarantee of milk safety.

---

## Team

**T.E.M.P.O TechZ's**
