# Debug Session: public-tenders-404 [OPEN]

## Symptom

- `GET http://localhost:3000/v1/public/tenders` returns `404 Not Found`.
- Failure originates from [src/lib/api/client.ts](file:///d:/nobs1/NE%20GIT%20ITEMS/care-atlas.fe/src/lib/api/client.ts) via [src/lib/api/tenders.ts](file:///d:/nobs1/NE%20GIT%20ITEMS/care-atlas.fe/src/lib/api/tenders.ts).

## Hypotheses

1. Public Laravel route `/v1/public/tenders` is not registered.
2. Frontend API base URL points to the frontend origin instead of Laravel.
3. Next.js proxy/rewrite rules for `/v1/*` are missing or incorrect.
4. Backend route registration is environment-conditional and excluded in local.
5. Middleware/prefix arrangement causes public tenders to be unreachable even though tender routes exist.

## Plan

1. Inspect frontend API client and route configuration.
2. Inspect Next.js rewrites/middleware.
3. Locate Laravel backend route definitions and startup behavior.
4. Reproduce with direct HTTP calls and capture evidence.
5. Implement targeted fix after evidence confirms root cause.
6. Add regression protection and verify end-to-end.

## Reproduction Steps

1. Load the tender board or call `getPublicTenders`.
2. Observe request URL built from `NEXT_PUBLIC_CARE_ATLAS_API_BASE_URL`.
3. Compare responses from `localhost:3000`, `localhost:8000`, and production API.

## Hypotheses & Verification

| ID  | Hypothesis                                                      | Likelihood | Effort | Evidence                                          |
| --- | --------------------------------------------------------------- | ---------- | ------ | ------------------------------------------------- |
| A   | Frontend env points to the frontend origin instead of Laravel   | High       | Low    | Confirmed                                         |
| B   | Next.js rewrites/proxy should forward `/v1/public/*` to Laravel | Medium     | Low    | Rejected                                          |
| C   | Public backend route does not exist                             | Medium     | Medium | Rejected in production; local backend unavailable |
| D   | Local backend is not running on the expected Laravel port       | High       | Low    | Confirmed                                         |
| E   | Backend route registration is conditional in local only         | Low        | High   | Inconclusive                                      |

## Log Evidence

- `.env` value: `NEXT_PUBLIC_CARE_ATLAS_API_BASE_URL=http://localhost:3000`
- `.env.example` value: `NEXT_PUBLIC_CARE_ATLAS_API_BASE_URL=http://localhost:8000`
- Direct call to `http://localhost:3000/v1/public/tenders` returned `404` with `x-powered-by: Next.js`
- Direct call to `http://localhost:8000/v1/public/tenders` returned connection refused
- Debug log line A: built URL `http://localhost:3000/v1/public/tenders`
- Debug log line B: `404`, `content-type=text/html`, `poweredBy=Next.js`
- Direct call to `https://api.orbitmirai.com/v1/public/tenders` returned `200 OK`

## Verification Conclusion

- Root cause confirmed: local frontend env misrouted public tender requests to the Next.js frontend app on port `3000`.
- Additional local environment issue: Laravel backend is not currently running on `localhost:8000`, so a correct local frontend config still requires the backend process to be started.

## Fix Applied

- Updated local frontend env from `http://localhost:3000` to `http://localhost:8000`
- Added route documentation in `docs/tender-api-routing.md`
- Added regression test in `src/lib/api/tenders.test.ts`
- Retained temporary instrumentation in `src/lib/api/client.ts` pending final verification

## Post-Fix Validation

- `npm run lint` ✅
- `npm run build` ✅
- `npx tsc --noEmit --pretty false` ✅
- `npm run test` ✅
- Live API helper verification against `https://api.orbitmirai.com` ✅ (`getPublicTenders` returned 56 tenders)
