# Cloudpeakify Backend

REST API pro blog a administraci, postavené na Node.js (Express) a PostgreSQL.

## Požadavky

- Node.js 18+
- PostgreSQL 14+

## Nastavení

1. Zkopírujte `.env.example` na `.env` a upravte hodnoty (zejména `DATABASE_URL`, `JWT_SECRET`, přístupové údaje pro admina).
2. Nainstalujte závislosti:

   ```bash
   npm install
   ```

3. Spusťte migrace databáze:

   ```bash
   npm run migrate
   ```

4. Vytvořte/aktualizujte admin účet podle proměnných `ADMIN_EMAIL` a `ADMIN_PASSWORD`:

   ```bash
   npm run seed-admin
   ```

5. Spusťte API server:

   ```bash
   npm start
   ```

Server naslouchá na portu z proměnné `PORT` (default 4000) a nabízí endpointy pod `/api`.

## API Přehled

- `POST /api/auth/login` – přihlášení, vrací JWT token.
- `GET /api/auth/me` – ověření přihlášení (nutný `Authorization: Bearer <token>`).
- `GET /api/posts` – veřejné příspěvky, administrátor může přidat `?includeDrafts=true`.
- `GET /api/posts/:id` – detail příspěvku (`403`, pokud není publikovaný a uživatel není přihlášený).
- `POST /api/posts` – vytvoření příspěvku (vyžaduje token).
- `PUT /api/posts/:id` – úprava příspěvku (vyžaduje token).
- `DELETE /api/posts/:id` – smazání příspěvku (vyžaduje token).

Token předejte v hlavičce `Authorization: Bearer <token>`. Návratové objekty používají shodná pole jako frontend: `title_cs`, `summary_cs`, `imageUrl`, ...
