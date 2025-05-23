# geo-processor

A full-stack monorepo for geospatial processing:

1. **geo-python**: FastAPI service for centroid and bounding box calculations  
2. **api-nest**: NestJS gateway for validation, caching, and request forwarding  
3. **web-next**: Next.js + Tailwind frontend with Leaflet map visualization  
4. **libs/dto**: Shared TypeScript interfaces (`Point`, `ProcessRequest`, `ProcessResponse`)

---

## 📁 Repository Structure

```
geo-processor/
├── apps/
│   ├── geo-python/   # Python FastAPI service
│   ├── api-nest/     # NestJS gateway
│   └── web-next/     # Next.js frontend
├── libs/
│   └── dto/          # Shared DTO interfaces
├── nx.json           # Nx workspace config
├── tsconfig.base.json# Root TypeScript config (path aliases)
├── package.json      # Workspace dependencies & scripts
└── README.md         # This file
```

---

## ⚙️ Design Decisions

- **Monorepo with Nx**:  
  Centralizes all services and shared code, enabling orchestration and caching.

- **Python FastAPI (`geo-python`)**:  
  - Stateless microservice  
  - Exposes `/process` POST endpoint  
  - Validates input, computes bounding box and centroid

- **NestJS Gateway (`api-nest`)**:  
  - Validates JSON body (`class-validator`)  
  - Forwards requests to FastAPI via Axios  
  - Caches responses in-memory for 5 minutes  
  - Shares types from `@geo/dto`

- **Next.js Frontend (`web-next`)**:  
  - Uses React 19, Tailwind CSS, and Leaflet  
  - Form for entering lat/lng points  
  - Calls `/api/points` (proxied to NestJS)  
  - Visualizes bounding box & centroid on map

- **TypeScript Shared Library (`libs/dto`)**:  
  - Exports `Point`, `ProcessRequest`, `ProcessResponse`  
  - Used by both NestJS and Next.js

- **No Webpack for backend**:  
  - Uses Nx’s `run-commands` with `ts-node`  
  - Faster dev loop, avoids loader issues

- **Path Mapping**:  
  - `@geo/dto` → `libs/dto/src/index.ts` via `tsconfig.base.json`

---

## 🚀 Getting Started

Follow these steps from the repo root (`geo-processor/`):

### 1. Install prerequisites

- Node.js ≥ 18  
- pnpm: `npm install -g pnpm`  
- Python ≥ 3.9  
- FastAPI & Uvicorn: `pip install fastapi uvicorn`

### 2. Clone & install dependencies

```bash
git clone https://github.com/JuanLozada97/geo-processor geo-processor
cd geo-processor
pnpm install
```

### 3. Start the services

#### Start FastAPI service

```bash
pnpm nx serve geo-python
# Listens on http://localhost:8000
# Exposes POST /process
```

#### Start NestJS gateway

```bash
pnpm nx serve api-nest
# Listens on http://localhost:3000
# Exposes POST /points, forwards to FastAPI and caches
```

#### Start Next.js frontend

```bash
pnpm nx serve web-next
# Opens on http://localhost:4200 (default)
# UI for entering points and visualizing results
```

---

## 🧪 Quick End-to-End Test (Optional)

With all services running, test the pipeline:

```bash
curl -X POST http://localhost:3000/points \
  -H "Content-Type: application/json" \
  -d '{
    "points":[
      { "lat":40.7128, "lng":-74.0060 },
      { "lat":34.0522, "lng":-118.2437 }
    ]
  }'
```

You should receive a JSON response with `centroid` and `bounds`.

---

With these three terminals running, you have the Python service, NestJS gateway, and Next.js frontend all wired together. Enjoy!
