# Seeker Studio

Public studio website and portfolio for seeker-studio.games (games, tools and plugins), hosted on GitHub Pages. Static HTML, CSS and JavaScript with self-hosted fonts, SVG illustrations and supplied game artwork. No analytics, cookies, external embeds or build dependencies.

Pages: `index.html` (games, tools, companions, studio), `plugins.html` (DeepSeek Harness plugins), and `lockbox.html` (Lockbox download and installation).

`downloads/` contains the standalone Lockbox app ZIP and its SHA-256 checksum. It contains no vaults, user files, or preferences. Lockbox source remains in its separate repository.

Preview with `python3 -m http.server 4330 --bind 127.0.0.1`. Publish from the main branch root through GitHub Pages.

The website repository contains presentation assets and public tool downloads only. Seekers of the Deep remains a separate private project. Fonts in `assets/fonts/` retain their SIL Open Font License notices. Artwork and studio content are not licensed for redistribution.

## Domain

Cloudflare DNS is configured with apex A records 185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153, and www CNAME to seeker24601.github.io. All are DNS only. GitHub Pages is configured for seeker-studio.games through the CNAME file. GitHub issued the certificate on 25 September 2026 and HTTPS is enforced.
