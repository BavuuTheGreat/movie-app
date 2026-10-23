"use client";

import { useEffect, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MovieCard } from "./MovieCard";

const api_token = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

// Shared layout for any paginated TMDB list (category, search, genre).
// `endpoint` is a TMDB path + query string without the page param.
// Callers pass key={endpoint} so a new search starts back on page 1.
export const MovieGridPage = ({ title, endpoint }) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!endpoint) return;

        const separator = endpoint.includes("?") ? "&" : "?";
        fetch(`https://api.themoviedb.org/3${endpoint}${separator}page=${page}`, {
            headers: { Authorization: `Bearer ${api_token}` },
        })
            .then((response) => {
                if (!response.ok) throw new Error("TMDB request failed");
                return response.json();
            })
            .then((jsonData) => {
                setData(jsonData.results || []);
                // TMDB rejects pages above 500
                setTotalPages(Math.min(jsonData.total_pages || 1, 500));
            })
            .catch(() => setErrorMessage("MOVIE API ERROR"))
            .finally(() => setLoading(false));
    }, [endpoint, page]);

    const goToPage = (nextPage) => {
        setLoading(true);
        setErrorMessage("");
        setPage(nextPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div>
            <Header />

            <div className="w-full min-h-screen flex flex-col items-center overflow-x-hidden">
                <div className="w-full max-w-7xl flex flex-col gap-8 mt-13 px-4 md:px-8 pb-13">
                    <p className="font-inter font-semibold text-[24px] text-[#09090B] leading-8">
                        {title}
                    </p>

                    {loading && (
                        <p className="font-inter text-[14px] text-[#71717A]">Loading...</p>
                    )}

                    {errorMessage && (
                        <p className="font-inter text-[14px] text-red-500">{errorMessage}</p>
                    )}

                    {!loading && !errorMessage && data.length === 0 && (
                        <p className="font-inter text-[14px] text-[#71717A]">
                            No movies found.
                        </p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
                        {data.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4">
                            <button
                                type="button"
                                disabled={page <= 1 || loading}
                                onClick={() => goToPage(page - 1)}
                                className="h-9 px-4 rounded-md border border-[#E4E4E7] bg-white font-inter text-[14px] text-[#09090B] hover:bg-[#F4F4F5] disabled:opacity-40"
                            >
                                ‹ Previous
                            </button>
                            <p className="font-inter text-[14px] text-[#71717A]">
                                Page {page} of {totalPages}
                            </p>
                            <button
                                type="button"
                                disabled={page >= totalPages || loading}
                                onClick={() => goToPage(page + 1)}
                                className="h-9 px-4 rounded-md border border-[#E4E4E7] bg-white font-inter text-[14px] text-[#09090B] hover:bg-[#F4F4F5] disabled:opacity-40"
                            >
                                Next ›
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};
