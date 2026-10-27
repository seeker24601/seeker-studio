# Seeker Studio website

Public studio website. Canonical repository: github.com/seeker24601/seeker-studio (gitlab.com/seeker24601/seeker-studio is a weekly backup copy; don't push there directly). Hosted on Cloudflare (a static-assets Worker named `seeker-studio`); deploy with `npx wrangler deploy`, which copies the public files into `dist/` via `scripts/build-site.mjs` first. Domain: seeker-studio.games. Keep game source, credentials and saved campaigns out of this repository.

Static HTML, CSS and JavaScript, no build step. Preserve keyboard navigation, mobile layout, reduced-motion support and no-JavaScript reading. Verify locally before publishing. Do not claim a game is available until a public release exists. Font licenses live beside the assets.
