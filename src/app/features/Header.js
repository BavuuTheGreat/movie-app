"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// TMDB genre ids — https://developer.themoviedb.org/reference/genre-movie-list
const GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 16, name: "Animation" },
  { id: 99, name: "Documentary" },
];

const Logo = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
);

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

export const Header = () => {
  const router = useRouter();
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [search, setSearch] = useState("");
  const [isDark, setIsDark] = useState(false);
  const genreRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genreRef.current && !genreRef.current.contains(event.target)) {
        setIsGenreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-8 py-3 dark:border-gray-800 dark:bg-gray-900">
      <div
        onClick={() => router.push("/")}
        className="flex cursor-pointer items-center gap-1.5 text-gray-900 dark:text-white"
      >
        <span className="text-indigo-600">
          <Logo />
        </span>
        <span className="text-xl font-bold italic">
          Movie<span className="text-indigo-600">Z</span>
        </span>
      </div>

      <div className="flex flex-1 items-center justify-center gap-3">
        <div className="relative" ref={genreRef}>
          <button
            type="button"
            onClick={() => setIsGenreOpen((open) => !open)}
            className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {selectedGenre ?? "Genre"}
            <ChevronIcon />
          </button>

          {isGenreOpen && (
            <ul className="absolute left-0 top-full z-10 mt-2 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
              {GENRES.map((genre) => (
                <li key={genre.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGenre(genre.name);
                      setIsGenreOpen(false);
                      router.push(
                        `/search?genre=${genre.id}&name=${encodeURIComponent(genre.name)}`
                      );
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    {genre.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            const query = search.trim();
            if (query) router.push(`/search?q=${encodeURIComponent(query)}`);
          }}
          className="flex w-full max-w-sm items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-500 focus-within:border-indigo-500 dark:border-gray-700 dark:text-gray-400"
        >
          <SearchIcon />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search.."
            className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
          />
        </form>
      </div>

      <button
        type="button"
        onClick={() => setIsDark((dark) => !dark)}
        aria-label="Toggle dark mode"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  );
};
