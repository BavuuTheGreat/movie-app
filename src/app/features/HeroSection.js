"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const api_token = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;
const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";
const SLIDE_COUNT = 6;
const AUTOPLAY_MS = 6000;

export const HeroSection = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [playingId, setPlayingId] = useState(null);
  const [trailerKeys, setTrailerKeys] = useState({});
  const touchStartX = useRef(null);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
          { headers: { Authorization: `Bearer ${api_token}` } }
        );
        const jsonData = await response.json();
        setMovies((jsonData.results || []).slice(0, SLIDE_COUNT));
      } catch {
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, []);

  const goTo = useCallback(
    (nextIndex) => {
      setPlayingId(null);
      setIndex((prev) => {
        const len = movies.length;
        if (!len) return prev;
        return (nextIndex + len) % len;
      });
    },
    [movies.length]
  );

  useEffect(() => {
    if (movies.length < 2 || playingId !== null) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [movies.length, playingId]);

  const playTrailer = async (movie) => {
    if (trailerKeys[movie.id]) {
      setPlayingId(movie.id);
      return;
    }
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`,
        { headers: { Authorization: `Bearer ${api_token}` } }
      );
      const jsonData = await response.json();
      const results = jsonData.results || [];
      const trailer =
        results.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
        results.find((v) => v.site === "YouTube");
      if (trailer) {
        setTrailerKeys((prev) => ({ ...prev, [movie.id]: trailer.key }));
        setPlayingId(movie.id);
      }
    } catch {
      
    }
  };

  const onTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event) => {
    if (touchStartX.current === null || playingId !== null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      goTo(index + (delta < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  if (loading) {
    return (
      <div className="h-[320px] w-full animate-pulse bg-[#E4E4E7] sm:h-[420px] md:h-[520px] lg:h-[600px]" />
    );
  }

  if (!movies.length) {
    return <HeroImage src="/images/upcoming.png" alt="Now Playing: Wicked" />;
  }

  return (
    <div
      className="relative h-[320px] w-full overflow-hidden bg-black sm:h-[420px] md:h-[520px] lg:h-[600px]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="relative h-full w-full shrink-0">
            {playingId === movie.id && trailerKeys[movie.id] ? (
              <>
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${trailerKeys[movie.id]}?autoplay=1&rel=0`}
                  title={`${movie.title} trailer`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
                <button
                  type="button"
                  onClick={() => setPlayingId(null)}
                  aria-label="Close trailer"
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <img
                  src={
                    movie.backdrop_path
                      ? `${BACKDROP_BASE}${movie.backdrop_path}`
                      : "/images/upcoming.png"
                  }
                  alt={movie.title}
                  className="h-full w-full object-cover object-[30%_center]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-4 right-4 flex flex-col gap-3 text-white sm:bottom-10 sm:left-10 sm:right-10">
                  <p className="text-xs font-medium uppercase tracking-wide text-white/70">
                    Popular Now
                  </p>
                  <h2 className="max-w-xl text-2xl font-bold sm:text-4xl">
                    {movie.title}
                  </h2>
                  <button
                    type="button"
                    onClick={() => playTrailer(movie)}
                    className="flex w-fit items-center gap-2 rounded-full bg-white/90 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white"
                  >
                    ▶ Watch Trailer
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {playingId === null && movies.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous movie"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next movie"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {movies.map((movie, i) => (
              <button
                key={movie.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 w-2 rounded-full transition ${
                  i === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

function HeroImage({ src, alt }) {
  return (
    <div className="hero-image">
      <img
        src={src}
        alt={alt}
        className="h-[320px] w-full object-cover object-[30%_center] sm:h-[420px] md:h-[520px] lg:h-[600px]"
      />
    </div>
  );
}
