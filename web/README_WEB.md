# T.E.M.P.O. web app

1. Start the engine (separate terminal):  cd engine ; py -m uvicorn tempo.api:app --port 8000
2. In this folder:  npm install ; npm run build ; npm test ; npm run dev
3. Open http://localhost:5173

VITE_USE_MOCK=0 (in .env.local) uses the real engine. VITE_USE_MOCK=1 uses the files in ../contract.
Map tiles need internet; markers, routes, fonts and icons work offline.
Design decision: Map-led Dispatch direction for all four pages.
