# AI Interview Question Generator

A clean Next.js App Router MVP that generates interview questions from a role, skill, or topic using the Gemini API.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Gemini API via `@google/genai`
- Ready for Vercel deployment

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.local.example .env.local
```

3. Add your Gemini API key to `.env.local`:

```bash
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

4. Start the development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## API

The app exposes a single backend route:

```http
POST /api/generate-questions
```

Request body:

```json
{
  "topic": "Frontend Developer"
}
```

Response:

```json
{
  "questions": [
    "Question one",
    "Question two",
    "Question three",
    "Question four",
    "Question five"
  ]
}
```

## Vercel Deployment

Add `GEMINI_API_KEY` in your Vercel project environment variables, then deploy the repository. You can also add `GEMINI_MODEL=gemini-2.5-flash` or leave it unset to use the default. Vercel will run `npm run build` automatically.
