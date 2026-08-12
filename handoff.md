# Jellyfin Seerr blank-page handoff

## User-visible issue

Jellyfin's custom **Discover** and **My Requests** routes render their page shell,
but no Seerr content appears on the user's iPhone. On Discover, the search field
and blue Search button are visible while the title, description, loading state,
result cards, and errors are absent. My Requests previously showed the same
blank body. Closing and reopening Jellyfin did not change the behavior.

The latest supplied screenshot was taken around 7:59 PM on 2026-08-11 and shows
`Rick` in the Discover search field with an otherwise blank page.

## Evidence and diagnosis

- Seerr itself is healthy and works for the user outside Jellyfin.
- The bridge CORS allowlist was corrected to include the Jellyfin origin
  `http://homelab.tail861ffd.ts.net:8096`.
- Using the active iPhone Jellyfin session server-side, the bridge returns HTTP
  200 with three results for `Rick and Morty`. My Requests returns HTTP 200 with
  two requests, including Rick and Morty.
- The iPhone opened Jellyfin twice after the previous deployment. Jellyfin's
  WebSocket log records connections from `100.96.181.51` at approximately
  7:58 PM and 7:59 PM.
- The served HTML is `no-cache`, the Discover and Requests chunks are
  content-hashed, and Jellyfin's service worker has no fetch/cache handler. A
  stale service-worker cache is therefore not the cause.
- Earlier failures rendered the red MUI alert icon without its message. The
  current screenshot leaves the expected title/description area blank while
  MUI input and button controls remain visible. This isolates the remaining
  symptom to theme-dependent MUI text/card rendering in Jellyfin's stable
  layout on the iPhone, rather than an empty Seerr response.
- The custom routes also omitted Jellyfin's standard `mainAnimatedPage` class.
- A network request previously had no deadline, so a browser-specific fetch
  stall could leave the route pending without a useful terminal state.

## Fixes made

Previous deployed fixes:

- `38c5f4b84a`: exposed Discover and My Requests in the stable Jellyfin routes.
- `1c16d517b2`: made Seerr queries use the active Jellyfin API client's token,
  removed the token-dependent query disable, added explicit query states, and
  added redacted client diagnostics.

Current fix (`97d5a9eea1`):

- Replaces theme-dependent MUI typography, alerts, cards, and request buttons
  with semantic HTML and explicit Seerr-scoped colors.
- Shows a visible state for every outcome: loading, an error, no results, or an
  exact result/request count.
- Adds a 15-second bridge timeout so loading cannot remain silent indefinitely.
- Uses `cache: 'no-store'` for bridge calls.
- Adds `mainAnimatedPage` to both custom routes.
- Keeps MUI only for the Discover search input/button, which are the controls
  already proven visible in the supplied screenshots.

## Verification and deployment status

- `npm test -- --run`: 166 tests passed.
- Focused ESLint for all changed TypeScript/React files: passed.
- Full-repository ESLint still reports two pre-existing errors in
  `src/components/playback/playbackDebug.js`; the Seerr patch adds no lint
  errors.
- `npm run build:check`: passed.
- `npm run stylelint`: passed.
- `npm run build:production`: passed with only the repository's existing
  bundle-size and stale Browserslist warnings.
- Commit `97d5a9eea1` was pushed to both `main` and `custom-ui`.
- `homelab` rebuilt and deployed that commit. `media-jellyfin` is healthy, the
  served HTML returns HTTP 200 with `Cache-Control: no-cache`, and the served
  hashed Discover JavaScript/CSS contain the new status and card code.
- A post-deploy probe using the most recent Safari-iPhone Jellyfin session
  returned CORS preflight 204, Discover HTTP 200 with 14 `Rick` results, and My
  Requests HTTP 200 with two requests. The token was not printed or stored.
- The migration runner completed and the migration check reports both
  migrations applied. The app web, Postgres, and worker containers are healthy.

The remaining check requires the user's iPhone: reopen Discover. The page must
now show at least one of `Loading Seerr results…`, `N results from Seerr`, `No
movies or TV shows found.`, or a concrete error. A completely blank state is no
longer a valid render path.

## If the user still cannot load results

The exact visible status text is the next diagnostic signal. If a timeout or
network error appears, inspect the bridge's successful-request access telemetry
and the request's `Origin`; do not guess from the Jellyfin server response. If
the new title and status are still absent, verify that the iPhone received the
new Discover JavaScript and Seerr stylesheet assets from port 8096.

Do not put Jellyfin access tokens, authenticated WebSocket URLs, or credentials
in this file or in logs. No browser/screenshot verification was performed, in
accordance with the repository instructions.
