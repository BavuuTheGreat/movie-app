"use client";

import { use } from "react";
import { MovieGridPage } from "../../features/MovieGridPage";

const CATEGORIES = {
    upcoming: { title: "Upcoming", path: "/movie/upcoming" },
    popular: { title: "Popular", path: "/movie/popular" },
    toprated: { title: "Top Rated", path: "/movie/top_rated" },
    nowplaying: { title: "Now Playing", path: "/movie/now_playing" },
};

export default function CategoryPage({ params }) {
    const { type } = use(params);
    const category = CATEGORIES[type] ?? CATEGORIES.popular;
    const endpoint = `${category.path}?language=en-US`;

    return (
        <MovieGridPage key={endpoint} title={category.title} endpoint={endpoint} />
    );
}
