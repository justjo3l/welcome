# Joel's Portfolio

An expressive, Persona-inspired portfolio built with plain HTML, CSS and JavaScript. It has no runtime dependencies and includes a small Node server for Railway.

## Run locally

```bash
npm start
```

Open `http://localhost:3000`.

## Deploy to Railway

1. Push this folder to a GitHub repository.
2. Create a new Railway project from that repository.
3. Railway will detect `npm start` automatically.
4. Generate a public domain from the service settings.

The server reads Railway's `PORT` environment variable automatically.

## Before publishing

- Replace `add-your-email@example.com` in `public/index.html`.
- Add approved GitHub, LinkedIn and CV links when available.
- Confirm which Nexfolio, Ecosense/Sift and Themis details can be shared.
- Add a licensed or original music file and connect it to the sound control.

## Structure

- `public/index.html` — content and page structure
- `public/styles.css` — visual system and responsive layout
- `public/script.js` — loader, transitions and interactions
- `server.js` — production static server
