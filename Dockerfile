# syntax=docker/dockerfile:1

# --- Frontend build stage -----------------------------------------------------
FROM node:20-alpine AS frontend
WORKDIR /build
COPY web/package.json web/package-lock.json* ./
RUN npm ci --no-audit --no-fund
COPY web/ ./
COPY contract/ ../contract/
RUN npm run build

# --- Backend + runtime stage --------------------------------------------------
FROM python:3.12-slim AS runtime
WORKDIR /app

# Install OS-level packages needed by the engine
RUN apt-get update && apt-get install -y --no-install-recommends \
        gcc && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY engine/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project preserving structure (engine/, web/, data/, contract/)
COPY . .

# Copy built frontend into web/dist so api.py can serve it
COPY --from=frontend /build/dist ./web/dist

EXPOSE 8000
CMD ["sh", "-c", "cd engine && uvicorn tempo.api:app --host 0.0.0.0 --port ${PORT:-8000}"]
