# MovieZ

A movie browsing app built with Next.js and the [TMDB API](https://developer.themoviedb.org/).

- Browse Upcoming, Popular and Top Rated movies
- Search by title or browse by genre
- Movie detail pages with trailers, where-to-stream info, and full playback of public-domain films (via the Internet Archive)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a free TMDB account and copy your **API Read Access Token** from <https://www.themoviedb.org/settings/api>.

3. Copy `.env.example` to `.env.local` and paste the token in:

   ```bash
   cp .env.example .env.local
   ```

4. Start the dev server and open <http://localhost:3000>:

   ```bash
   npm run dev
   ```

## Deploying

On Vercel (or any host), add `NEXT_PUBLIC_TMDB_API_TOKEN` as an environment variable before building.
