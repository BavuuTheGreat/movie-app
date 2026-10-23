"use client";

import { use } from "react";
import { MovieGridPage } from "../features/MovieGridPage";

// /search?q=batman             → text search
// /search?genre=28&name=Action → browse by genre
export default function SearchPage({ searchParams }) {
    const { q, genre, name } = use(searchParams);

    let title = "Popular";
    let endpoint = "/movie/popular?language=en-US";

    if (q) {
        title = `Results for "${q}"`;
        endpoint = `/search/movie?language=en-US&query=${encodeURIComponent(q)}`;
    } else if (genre) {
        title = name ?? "Genre";
        endpoint = `/discover/movie?language=en-US&sort_by=popularity.desc&with_genres=${encodeURIComponent(genre)}`;
    }

    return <MovieGridPage key={endpoint} title={title} endpoint={endpoint} />;
}
