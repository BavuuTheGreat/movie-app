"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "../../features/Header";
import { Footer } from "../../features/Footer";

const api_token = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;
const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";
const REGION = "US";

const pickTrailer = (videos) => {
    const youtube = videos.filter((video) => video.site === "YouTube");
    return (
        youtube.find((video) => video.type === "Trailer" && video.official) ||
        youtube.find((video) => video.type === "Trailer") ||
        youtube.find((video) => video.type === "Teaser") ||
        youtube[0] ||
        null
    );
};

const normalizeTitle = (title) =>
    String(title || "").toLowerCase().replace(/[^a-z0-9]/g, "");

// Looks for a full public-domain copy of this exact movie on the Internet Archive.
const findFreeCopy = async (movie) => {
    const year = Number(movie.release_date?.slice(0, 4));
    const cleanTitle = movie.title.replace(/[^\w\s]/g, " ").trim();
    const params = new URLSearchParams({
        q: `collection:feature_films AND mediatype:movies AND title:(${cleanTitle})`,
        rows: "25",
        output: "json",
        "sort[]": "downloads desc",
    });
    ["identifier", "title", "year"].forEach((field) => params.append("fl[]", field));

    const response = await fetch(`https://archive.org/advancedsearch.php?${params}`);
    if (!response.ok) return null;
    const jsonData = await response.json();

    return (
        (jsonData.response?.docs || []).find(
            (doc) =>
                normalizeTitle(doc.title) === normalizeTitle(movie.title) &&
                (!year || !doc.year || Math.abs(Number(doc.year) - year) <= 1)
        ) || null
    );
};

const ProviderRow = ({ label, providers, link }) => {
    if (!providers?.length) return null;

    return (
        <div className="flex flex-col gap-2">
            <p className="font-inter text-[13px] font-medium text-[#71717A]">
                {label}
            </p>
            <div className="flex flex-wrap gap-3">
                {providers.map((provider) => (
                    <a
                        key={provider.provider_id}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Watch on ${provider.provider_name}`}
                        className="flex flex-col items-center gap-1 w-14 hover:opacity-80"
                    >
                        <img
                            src={`${IMG_BASE}${provider.logo_path}`}
                            alt={provider.provider_name}
                            className="w-12 h-12 rounded-lg object-cover"
                        />
                        <p className="font-inter text-[10px] text-center text-[#71717A] leading-tight">
                            {provider.provider_name}
                        </p>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default function MovieDetail() {
    const { id } = useParams();
    const router = useRouter();

    const [movie, setMovie] = useState(null);
    const [providers, setProviders] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [freeCopy, setFreeCopy] = useState(null);
    // null | "trailer" | "movie"
    const [playing, setPlaying] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchDetail = async () => {
            const [movieRes, providersRes, videosRes] = await Promise.all([
                fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
                    headers: { Authorization: `Bearer ${api_token}` },
                }),
                fetch(
                    `https://api.themoviedb.org/3/movie/${id}/watch/providers`,
                    { headers: { Authorization: `Bearer ${api_token}` } }
                ),
                fetch(`https://api.themoviedb.org/3/movie/${id}/videos`, {
                    headers: { Authorization: `Bearer ${api_token}` },
                }),
            ]);

            if (!movieRes.ok) {
                throw new Error("TMDB request failed");
            }

            const movieData = await movieRes.json();
            const providersData = providersRes.ok
                ? await providersRes.json()
                : { results: {} };
            const videosData = videosRes.ok
                ? await videosRes.json()
                : { results: [] };

            return {
                movie: movieData,
                providers: providersData.results?.[REGION] ?? null,
                trailer: pickTrailer(videosData.results || []),
            };
        };

        fetchDetail()
            .then(({ movie, providers, trailer }) => {
                setMovie(movie);
                setProviders(providers);
                setTrailer(trailer);
                findFreeCopy(movie)
                    .then(setFreeCopy)
                    .catch(() => setFreeCopy(null));
            })
            .catch(() => setErrorMessage("MOVIE API ERROR"))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <div>
            <Header />

            <div className="w-full min-h-screen flex flex-col items-center overflow-x-hidden">
                {loading && (
                    <p className="font-inter text-[14px] text-[#71717A] mt-13">
                        Loading...
                    </p>
                )}

                {errorMessage && (
                    <p className="font-inter text-[14px] text-red-500 mt-13">
                        {errorMessage}
                    </p>
                )}

                {movie && (
                    <div className="w-full max-w-7xl flex flex-col gap-8 mt-8 px-4 md:px-8 pb-13">
                        <div
                            onClick={() => router.push("/")}
                            className="font-inter text-[14px] text-[#71717A] cursor-pointer w-fit"
                        >
                            ← Back
                        </div>

                        {(playing === "trailer" && trailer) || (playing === "movie" && freeCopy) ? (
                            <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-black">
                                <iframe
                                    className="h-full w-full"
                                    src={
                                        playing === "movie"
                                            ? `https://archive.org/embed/${freeCopy.identifier}?autoplay=1`
                                            : `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`
                                    }
                                    title={`${movie.title} ${playing === "movie" ? "full movie" : "trailer"}`}
                                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                                    allowFullScreen
                                />
                                <button
                                    type="button"
                                    onClick={() => setPlaying(null)}
                                    aria-label="Close player"
                                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            movie.backdrop_path && (
                                <div className="relative w-full">
                                    <img
                                        src={`${BACKDROP_BASE}${movie.backdrop_path}`}
                                        alt={movie.title}
                                        className="w-full aspect-[16/6] object-cover rounded-lg"
                                    />
                                    {(freeCopy || trailer) && (
                                        <button
                                            type="button"
                                            onClick={() => setPlaying(freeCopy ? "movie" : "trailer")}
                                            aria-label={freeCopy ? "Play full movie" : "Play trailer"}
                                            className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-2xl text-black shadow-lg transition hover:scale-105 hover:bg-white"
                                        >
                                            ▶
                                        </button>
                                    )}
                                </div>
                            )
                        )}

                        <div className="flex flex-col md:flex-row gap-8">
                            <img
                                src={
                                    movie.poster_path
                                        ? `${IMG_BASE}${movie.poster_path}`
                                        : "https://placehold.co/500x750?text=No+Image"
                                }
                                alt={movie.title}
                                className="w-48 shrink-0 rounded-lg object-cover aspect-[2/3]"
                            />

                            <div className="flex flex-col gap-4">
                                <div>
                                    <p className="font-inter font-semibold text-[28px] text-[#09090B] leading-9">
                                        {movie.title}
                                    </p>
                                    <p className="font-inter text-[14px] text-[#71717A]">
                                        {movie.release_date?.slice(0, 4)} ·{" "}
                                        {movie.runtime ? `${movie.runtime} min` : "—"} ·{" "}
                                        ⭐ {movie.vote_average?.toFixed(1)}/10
                                    </p>
                                </div>

                                {movie.genres?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {movie.genres.map((genre) => (
                                            <span
                                                key={genre.id}
                                                className="font-inter text-[12px] text-[#09090B] bg-[#F4F4F5] rounded-full px-3 py-1"
                                            >
                                                {genre.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <p className="font-inter text-[14px] text-[#09090B] leading-6 max-w-2xl">
                                    {movie.overview}
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    {freeCopy && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPlaying("movie");
                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                            }}
                                            className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 h-10 font-inter text-[14px] font-medium text-white hover:bg-indigo-700"
                                        >
                                            ▶ Watch Full Movie (Free)
                                        </button>
                                    )}
                                    {trailer && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPlaying("trailer");
                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                            }}
                                            className="flex items-center gap-2 rounded-md bg-[#18181B] px-4 h-10 font-inter text-[14px] font-medium text-white hover:bg-[#27272A]"
                                        >
                                            ▶ Watch Trailer
                                        </button>
                                    )}
                                    {providers?.link && (
                                        <a
                                            href={providers.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 rounded-md border border-[#E4E4E7] bg-white px-4 h-10 font-inter text-[14px] font-medium text-[#09090B] hover:bg-[#F4F4F5]"
                                        >
                                            Stream on Netflix, Prime & more ↗
                                        </a>
                                    )}
                                </div>

                                <div className="flex flex-col gap-4 mt-2">
                                    <p className="font-inter font-semibold text-[18px] text-[#09090B]">
                                        Where to Watch
                                    </p>

                                    {providers ? (
                                        <div className="flex flex-col gap-4">
                                            <ProviderRow
                                                label="Stream"
                                                providers={providers.flatrate}
                                                link={providers.link}
                                            />
                                            <ProviderRow
                                                label="Rent"
                                                providers={providers.rent}
                                                link={providers.link}
                                            />
                                            <ProviderRow
                                                label="Buy"
                                                providers={providers.buy}
                                                link={providers.link}
                                            />

                                            {providers.link && (
                                                <a
                                                    href={providers.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-inter text-[14px] text-indigo-600 hover:underline w-fit"
                                                >
                                                    See all watch options →
                                                </a>
                                            )}

                                            <p className="font-inter text-[11px] text-[#A1A1AA]">
                                                Watch data provided by JustWatch.
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="font-inter text-[14px] text-[#71717A]">
                                            No streaming, rental, or purchase options found
                                            for this region yet.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
