// Server-side proxy to TMDB so the API token never reaches the browser.
// /api/tmdb/movie/popular?page=1 → https://api.themoviedb.org/3/movie/popular?page=1

const TMDB_BASE = "https://api.themoviedb.org/3";
// Only the endpoints the app uses, so this can't be used as an open proxy.
const ALLOWED_ROOTS = ["movie", "search", "discover", "genre"];

export async function GET(request, { params }) {
    const { path } = await params;

    if (!ALLOWED_ROOTS.includes(path[0])) {
        return Response.json({ error: "Not found" }, { status: 404 });
    }

    const { search } = new URL(request.url);
    const response = await fetch(
        `${TMDB_BASE}/${path.map(encodeURIComponent).join("/")}${search}`,
        { headers: { Authorization: `Bearer ${process.env.TMDB_API_TOKEN}` } }
    );

    return new Response(response.body, {
        status: response.status,
        headers: {
            "Content-Type": "application/json",
            // Let Vercel's CDN reuse responses for 10 minutes
            "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
        },
    });
}
