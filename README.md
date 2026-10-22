# Scout — AI Website Data Extractor

Scout turns a public webpage into organised, structured data. Paste a page URL, describe what you want in plain English, and get a JSON result you can review, copy, or download.

Built with Next.js, TypeScript, Cheerio, and the Groq API.

## What it does

- Extracts requested information from a public HTML webpage.
- Uses natural-language instructions instead of complicated filters.
- Returns structured JSON with a summary, extracted items, and notes.
- Includes starter prompts, a readable results preview, copy, and JSON download.
- Keeps the Groq API key on the server, never in browser code.
- Includes basic URL validation, private-network address checks, response-size limits, and request timeouts.

## Deploy on Vercel

1. Push this repository to GitHub (the project is already hosted there).
2. In Vercel, choose **Add New → Project** and import `Tejas-pandey1/ai-web-scraper`.
3. Keep the project root as the repository root. Vercel should detect **Next.js** automatically.
4. In **Project Settings → Environment Variables**, add:
   - Name: `GROQ_API_KEY`
   - Value: your Groq API key
   - Environments: Production (and Preview/Development if needed)
5. Deploy. After changing environment variables, redeploy the project.

Do not put the key in a `NEXT_PUBLIC_...` variable, in source code, or in a public repository. Never share the key in screenshots or client messages.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
```

Copy `.env.example` to `.env.local` and replace the placeholder with your own Groq API key. Then run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For a production build:

```bash
npm run build
```

## How to use Scout

1. Paste a public webpage URL.
2. Choose a starter prompt or describe the fields you want.
3. Click **Extract my data**.
4. Review the JSON output, copy it, or download it.

## Important limitations

- Scout reads accessible HTML text. It cannot reliably extract content that only appears after client-side JavaScript runs, behind logins, or inside blocked pages.
- Use it only on pages you are allowed to access. Respect site terms, copyright, privacy, and rate limits.
- AI output can be incomplete or incorrect. Check important information before relying on it.
- The API route has basic safeguards, but this is a starter project, not a complete anti-abuse system. Add rate limiting and monitoring before opening a high-traffic public service.
- A live deployment still needs a valid `GROQ_API_KEY` configured in Vercel.

## Tech stack

- Next.js App Router + TypeScript
- React
- Groq API using `qwen/qwen3.8-27b`
- Cheerio for HTML cleanup
- Vercel serverless functions