# Lily Letter

A mobile-first keepsake built with Vite, React, TypeScript, and CSS. Original baby-blue SVG lilies, light-pink accents, warm ivory paper, and printed photographs frame your own photos and words. Welcome lilies slowly grow and bloom, then their pollen tips glow with a gentle five-second pulse. Reduced-motion preferences show the flowers fully grown with a static soft glow. No backend or animation library is required.

## The experience

Welcome → manually controlled photos → **Read My Letter** on the final photo → envelope opening → letter and attached photograph.

Photos never advance automatically. Use the previous/next buttons, swipe horizontally, or press the left/right arrow keys while focused in the slideshow. The letter is not rendered before the slideshow is completed. The progress strip is an indicator, not a shortcut past the photos. “Revisit our memories” returns to the last viewed photo.

The current screen, photo index, and envelope state survive refreshes in the same browser tab using `sessionStorage`. A new browsing session starts at the welcome screen. If browser storage is unavailable, the experience still works, but refresh starts over. Changing the ordered photo IDs starts a fresh session. This gate controls the experience; it is not authentication.

## Project structure

- `public/` — static files that should be served unchanged.
- `src/assets/images/` — lilies, paper textures, photos, and other image assets.
- `src/assets/fonts/` — local font files, if needed later.
- `src/components/` — small reusable UI components.
- `src/sections/` — the page's larger, ordered sections.
- `src/content/` — letter copy and other content kept separate from presentation.
- `src/styles/` — global styles, design tokens, and shared CSS.
- `src/App.tsx` — the single-page composition root.
- `src/main.tsx` — the React application entry point.

Key files:

```text
src/components/Lilies.tsx       Decorative SVG lily illustration
src/components/Photo.tsx        Image rendering and load-error handling
src/components/Envelope.tsx     Envelope-opening transition
src/sections/Welcome.tsx        Welcome screen
src/sections/Slideshow.tsx      Photo navigation and swipes
src/sections/Letter.tsx         Letter paper and attached photo
src/content/photos.ts          Ordered images, alt text, captions, letter photo
src/content/letter.txt          Your approved English letter text
src/styles/global.css          Fonts, base styles, accessibility helpers
src/styles/experience.css      Layout, components, responsive styles, animation
```

## Add your content

### Slideshow photographs and captions

Your seven supplied files are already connected from `src/assets/images/` in numeric order: `image1.jpg`, `image2.jpg`, `image3.jpg`, `image4.jpg`, `image5.jpg`, `6.jpg`, `image7.jpg`.

1. Put additional or replacement photographs in `src/assets/images/`.
2. Open `src/content/photos.ts` and import each new file, just like the existing imports.
3. Set the corresponding entry's `src` to that import. Move entries in the `photos` array to choose their display order. Keep each `id` unique and stable.
4. Update `alt` with a brief description of what is actually visible, and optionally fill in `caption`. An empty caption is omitted. No names, dates, or memories have been invented.

Example of a new entry, after importing your file as `myPhoto`:

```ts
{ id: 'photo-08', src: myPhoto, alt: 'Describe this actual photo here.', caption: '' }
```

You can also replace an existing file while keeping its filename. Rebuild after editing any content. File names and import capitalization must match exactly on the publishing server.

### Photo attached to the letter

The separate `letterPhoto` entry at the bottom of `src/content/photos.ts` controls this print independently. It currently uses your `image3.jpg`; change its `src`, `alt`, and optional `caption` to select another photo. To use a new dedicated photo, put it in `src/assets/images/`, import it, and set `letterPhoto.src` to that import. Tapping the print opens the full image in a new tab.

### Your letter

Paste the complete final letter into **`src/content/letter.txt`**, including your greeting, paragraph breaks, and sign-off exactly as you want them displayed. Save it as UTF-8. It is plain text, not Markdown or HTML; punctuation and line breaks are preserved and text is rendered safely without interpreting HTML.

The file contains your approved English letter. Edit it here whenever you want to change the wording. If you empty the file, the paper shows “Your letter will be placed here.”

## Run locally

Use Node.js 24 LTS (the runtime used to check this project), then run from this folder:

```sh
npm install
npm run dev
```

Open the local address printed by Vite. For a phone on the same Wi-Fi, use `npm run dev -- --host 0.0.0.0` and open the computer's LAN address and Vite port on the phone. This is a local preview, not a public sharing URL.

On this Windows machine, Node is installed at `C:\Program Files\nodejs`. If PowerShell says `npm` is not recognized, add it to that terminal's path, then use `npm.cmd`:

```powershell
$env:Path = 'C:\Program Files\nodejs;' + $env:Path
npm.cmd run dev
```

## Build and publish

```sh
npm run build
npm run preview
```

`build` checks TypeScript and creates the production site in `dist/`. `preview` serves that build for a local final check. Publish the **contents of `dist/`** to a static host with HTTPS. For a host that builds from your repository, set the build command to `npm run build` and the output directory to `dist`. Use `npm ci` when installing from the committed lockfile in CI.

Vite uses relative asset URLs, so the build also supports a subdirectory. There are no client-side routes requiring a server rewrite. No QR code is generated here. Once you have the final public HTTPS address, use that address for your QR code and test it on her phone.

Personal photos and letter text are included in the built site. Anyone with access to the published files can view them. `noindex` asks search engines not to index the site but does not make it private; use your host's access controls if privacy is needed.

## Design and performance

- Supplied photographs are about 65–149 KB each, so they are used without another lossy conversion. The slideshow loads the current photo and preloads only the next one. Letter images render only in the letter screen.
- Images use `object-fit: contain` or their natural ratio, preserving portrait and landscape photos. Existing borders inside source photos are preserved.
- For future large files, export compressed WebP or JPEG at roughly 1,200–1,600 pixels on the longest edge, check faces for quality, and aim for a few hundred KB per image. Vite fingerprints assets but does not automatically compress new photos.
- Fonts use Google Fonts with `display=swap` and serif/sans-serif fallbacks. For self-hosted fonts, place licensed font files in `src/assets/fonts/` and replace the import in `global.css` with `@font-face`.
- Controls have at least 44px touch targets. The site includes focus outlines, a skip link, photo alt text, slide announcements, and reduced-motion styles. No audio, tracking, or permission prompts are included.

## Browser checks

After building, `npm run test:smoke` starts a temporary local production preview and a hidden Chromium browser. It checks the photo sequence, keyboard navigation, touch swipes, refresh restoration, envelope, reduced motion, storage fallback, and overflow at 320, 390, 768, and 1440 pixels. Screenshots are saved to the ignored `.checks/` folder. No test library is installed. Chrome or Edge must be installed; set `CHROME_PATH` if the script cannot find your browser. Ports 5179 and 9227 must be free.

Before sharing, test all photos, captions, letter text, the attached photo, swipes, arrow keys, refresh on every screen, and the final public URL on a narrow phone.
