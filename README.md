T.E.M.P.O. — Thermal Estimation and Milk Procurement Optimizer

An open-source decision-support simulation prototype for first-mile raw-milk collection in India. It estimates how much time each village's milk has before it spoils, then plans collection routes so milk reaches the chilling centre in time.

Built by Team TechZ for the COMMIT FOR GOOD hackathon (theme: AI for Resilient and Sustainable Supply Chains).

Live demo: https://tempo-techz-production.up.railway.app (Free hosting can sleep when idle. The first load may take up to a minute.)

Read this first. The villages are simulated and road distances are estimated, not measured on real roads. Several model parameters are guesses (marked as such below and in the app). T.E.M.P.O. shows a method, not a measured outcome.

The problem

Raw milk starts to degrade within a few hours at 25–35 °C. Milk from many small villages is collected by vehicles and taken to a chilling centre, where it must be cooled to 4 °C within about 2 hours. A route that is short can still be bad: if a village's milk sits on the vehicle too long, it passes its quality limit before it is cooled.

What T.E.M.P.O. does
Estimates thermal risk per village. For each village it computes a thermal buffer: the hours of margin left before the milk reaches its quality limit.
Plans routes around that risk. An optimiser turns each village's quality limit into a deadline, so milk that is closer to spoiling is collected earlier.
Compares methods honestly. Risk-based routing is compared against a fixed route and a nearest-neighbour route on the same villages, and against a distance-only variant in the sensitivity runs.
Tests its own conclusions. A sensitivity sweep shows where risk-based routing wins and where it does not.

The web app has a dashboard, a route view with comparison charts, an alert list and an analytics page. Users can run four scenarios (normal, heatwave, slow roads, cooler failure) and upload their own village list.

How it works

All decisions come from explicit, auditable formulas. There is no learned model in the decision path.

Step	Formula	Where
Milk cooling in an open can	T_m(t) = T_env + (T0 − T_env) · e^(−t/τ)	engine/tempo/risk.py
Bacterial growth rate (Ratkowsky square-root model)	μ = (b · (T − T_min))²	engine/tempo/risk.py
Time to quality limit	Integrate ln-growth in 0.05 h steps until it reaches ln(1e5 / 1e3)	engine/tempo/risk.py
Thermal buffer	buffer = hours to limit − hours on vehicle − cooling time	engine/tempo/risk.py
Risk bands	green > 2.5 h, yellow 0.5–2.5 h, red < 0.5 h. A breach is a buffer below 0.	engine/tempo/risk.py
Distance and time	haversine distance × 1.3 road factor; speed by road type; stop time per village	engine/tempo/generate.py

Optimiser. Routing uses Google OR-Tools. The route is solved backwards (centre → last village → … → first village → centre), so the clock at a village equals the hours its milk spends on the vehicle. That turns "buffer ≥ 0" into a soft per-village deadline, applied with SetCumulVarSoftUpperBound (penalty 100 per second), plus a hard route ceiling of 7 h. The search uses guided local search with a time limit, so results can vary slightly between runs. The result is reversed back into forward order.

Baselines. Fixed: villages sorted by id and split into equal chunks per vehicle. Nearest: vehicles take turns picking the closest unvisited village. Distance-only: the same optimiser with the deadlines switched off.

Explanation text. The plain-language summary in the app is filled from a template using the computed numbers. It is not written by a language model.

Data
Villages are generated, not real. generate(seed=42, n=30) places villages within a 15 km radius of a single chilling centre ("Anand Chilling Centre", 22.56 N, 72.95 E), with random volumes and initial milk temperatures, and about 35 % kaccha (unpaved) access roads.
Distances are straight-line (haversine) distance × 1.3, not routed road distances.
Uploads: you can upload your own villages as JSON (id, name, lat, lon, volume_l, milk_temp_c). Uploaded villages are assumed to have pakka road access. The app's "Show sample format" button shows the exact shape.
Everything is reproducible from a seed.
Assumptions (and which are guesses)

Every parameter lives in engine/tempo/params.py with a value, a status (sourced or guessed) and a note. The app shows the same table from GET /api/assumptions.

Parameter	Value	Note
Cooling target	4 °C within 2 h	domain requirement
Route ceiling	7 h	modelling choice
Initial milk temperature range	28–37 °C	assumption
Speeds	pakka 40 km/h, kaccha 20 km/h	modelling choice
Stop time	10 min	assumption
Quality limit / starting count	1e5 / 1e3 CFU/ml	assumption
Open-can cooling constant τ	1.5 h	assumption
Growth coefficient b, minimum growth temperature T_min	0.03, 2 °C	guessed
Fleet size	5 vehicles (default)	modelling choice
Village radius, kaccha share, road factor	15 km, 35 %, 1.3	guessed modelling choices

Because these are partly guesses, the Analytics page sweeps vehicles, ambient temperature, kaccha speed, cooling time and growth coefficient over three seeds (42, 43, 44) and reports where risk-based routing wins. It reports "wins" only when risk-based has strictly fewer breaches than the best of the baselines.

Scenarios
Scenario	What changes
Normal	Defaults (ambient 36 °C)
Heatwave	Ambient 42 °C
Slow roads	Pakka speed × 0.8, kaccha speed × 0.5
Cooler failure	Cooling time at the centre 3.5 h instead of 2 h
Repository layout
engine/      Python engine and API (FastAPI, OR-Tools) and tests
  tempo/     params, generate, risk, baselines, optimise, scenarios, explain, sensitivity, api
  tests/     pytest suite
contract/    Sample JSON for every API response (generated from real engine output)
data/cache/  Saved sensitivity results used by the Analytics page
web/         React + TypeScript + Vite app
Dockerfile   Builds the web app and serves it from the API
Run it locally

Engine and API (Python 3.12):

bash
cd engine
pip install -r requirements.txt
python -m pytest                      # on Windows: py -m pytest
python -m uvicorn tempo.api:app --port 8000

Web app (Node 20+), in a second terminal:

bash
cd web
npm install
npm run dev                           # http://localhost:5173

The dev server proxies /api to port 8000. Set VITE_USE_MOCK=1 in web/.env to run the web app on the saved sample files without the engine, or 0 to use the live engine.

Regenerate saved data (optional):

bash
cd engine
python run_sensitivity.py             # about 7 minutes; writes data/cache/sensitivity.json
python make_sample.py                 # rewrites contract/*.sample.json
API
Endpoint	Purpose
GET /api/health	Engine status and contract version
GET /api/sample	A valid village list in the upload format
GET /api/assumptions	Every parameter with value, status and note
POST /api/simulate	Runs fixed, nearest and risk-based routing. Body: seed, scenario, optional ambient_c, vehicles (1–12), villages
GET /api/sensitivity	Saved sensitivity sweep (503 with a message if not generated)

Errors always return HTTP 422 with {"detail": "<plain message>"}.

Deploy

The root Dockerfile builds the web app and serves it, together with the API, from one container. The project is deployed on Railway. Pushes to main redeploy through .github/workflows/deploy.yml, or run railway up from the repo root.

Limitations
Simulated villages and estimated distances. No real road network, traffic or collection data.
Several parameters are guesses, so absolute numbers should not be read as predictions. The sensitivity page exists to show how much the conclusions depend on them.
The sensitivity sweep uses three seeds. It is evidence, not proof.
The optimiser has a time limit, so repeated runs can differ slightly.
No validation against measured bacterial counts or real temperatures.
Explanation text is template-based.
Next steps
Real road distances and travel times (for example OSRM routing).
Real chilling-centre and village data from a dairy partner.
Calibrate the growth and cooling parameters against lab measurements.
More seeds and wider sweeps; compare against the operator's current routes.
Team

Team TechZ: Aryaman Sharma, Priyam Raj — Python engine and API; web app.

Licence

MIT. See LICENSE.
