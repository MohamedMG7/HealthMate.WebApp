# HealthMate.WebApp

HealthMate.WebApp is the Angular 21 provider-facing frontend for HealthMate. The .NET 10 API lives in the separate `HealthMate.Api` repository.

## Quick Start
```bash
npm ci
npm start
```

Open `http://localhost:4200/`.

## API URL
The API base URL is currently configured in `src/app/services/config.ts`.

Default local API: `http://localhost:8080/api/`

## Build
```bash
npm run build
```

## Test
```bash
npm test
```

## Stack
Angular 21, TypeScript 5.9, Tailwind CSS 4, ApexCharts, JWT auth.

## License
MIT. See `LICENSE`.
