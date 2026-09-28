# Mera Hisab

An offline-first Android-focused shop companion for billing, khata, customer records, products, stock, payments, and local backups.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/mera-hisab run dev` — run the Expo mobile preview
- `pnpm --filter @workspace/mera-hisab run typecheck` — typecheck the mobile app
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Expo 57, React Native 0.86, Expo Router, AsyncStorage
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/mera-hisab/context/AppContext.tsx` — local-only business state and persistence
- `artifacts/mera-hisab/app/(tabs)/` — Home, Khata, Bills, Stock, and More mobile screens
- `artifacts/mera-hisab/components/` — shared mobile UI and quick-entry sheets
- `artifacts/mera-hisab/constants/colors.ts` — Mera Hisab visual tokens

## Architecture decisions

- The first app build is frontend-only and stores all business records in AsyncStorage on the device.
- Money is represented as integer rupees in the local store and formatted at the display boundary.
- Saving a sale atomically updates the invoice list, product stock, and customer ledger state together.
- WhatsApp sharing uses the device share sheet/deep link; the app never sends messages automatically.

## Product

Mera Hisab provides a mobile dashboard, quick sale entry, customer khata, customer payments, product inventory, stock top-ups, expenses, invoice detail sharing, UPI business details, demo data, and local JSON backup sharing.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
