# Seeker Studio

Public studio website and portfolio for seeker-studio.games (games, tools and plugins), hosted on Cloudflare. Static HTML, CSS and JavaScript with self-hosted fonts, SVG illustrations and supplied game artwork. No analytics, cookies, external embeds or build dependencies.

Pages: `index.html` (featured projects), `studio.html` (about me and contact links), `support.html` (Ko-fi and crypto tips), `games.html`, `tools.html`, `companions.html`, and `plugins.html` (complete category catalogues), and `ackshually.html` (download and installation). Standalone product pages: `ai-connections/`, `atelier/` and `lockbox/` (`lockbox.html` redirects to it). AI Connections setup lives at `ai-connections/install/`; its pinned source preview and checksum live in `ai-connections/downloads/`.

Every public page except `support.html` and the Vaultkeeper app carries a floating Ko-fi button: a `kofi.css` stylesheet link and an `<a class="kofi-float">` before `</body>`, with the cup from Ko-fi's brand kit in `assets/ko-fi-cup.svg`. Add both to new pages. `vaultkeeper/index.html` is built from the Vaultkeeper repository, so a rebuild drops the button until its source includes it.

Category indexes are static HTML so every item can be read without JavaScript. The header navigation is the only category switcher. Shared `catalogue.js` adds filter chips with counts and a search field to catalogues whose page includes `.catalogue-controls`; short catalogues such as Games and Companions omit the controls. `catalogue.css` provides the toolbar and the responsive card layout. Counts are never written by hand: `catalogue.js` counts the cards on each catalogue page, and `site.js` fills the homepage counts (elements with `data-count-src`) from those pages. When adding a project, add a catalogue card to its category page; the counts follow. The homepage tools carousel (`tools-carousel.js`) builds its buttons and position label from its slides, and adds a slide built from the catalogue card for any tool on `tools.html` that has no hand-written slide in `index.html`. Write a fuller slide in `index.html` when there is more to say than the card. Keep status labels accurate.

`downloads/` contains the standalone Lockbox app ZIP and its SHA-256 checksum. It contains no vaults, user files, or preferences. Lockbox source remains in its separate repository.

Preview with `python3 -m http.server 4330 --bind 127.0.0.1`. Code lives at github.com/seeker24601/seeker-studio, with a weekly backup copy at gitlab.com/seeker24601/seeker-studio (see `C:\AI\_git-hosts`). Publish with `npx wrangler deploy` from the repository root: `scripts/build-site.mjs` copies everything except repo-only files (`.git`, `AGENTS.md`, `README.md`, `CNAME`, `scripts/`, `wrangler.toml`) into `dist/`, and Cloudflare serves `dist/` at seeker-studio.games and www.seeker-studio.games. Pages answer at extensionless URLs (`/tools`); `/tools.html` redirects there.

The website repository contains presentation assets and public tool downloads only. Seekers of the Deep remains a separate private project. Fonts in `assets/fonts/` retain their SIL Open Font License notices. Artwork and studio content are not licensed for redistribution.

## Domain

seeker-studio.games and www.seeker-studio.games are Workers custom domains on the `seeker-studio` Worker (`routes` in `wrangler.toml`). Cloudflare creates and manages their DNS records and HTTPS certificates; there are no hand-made A or CNAME records for the site.
