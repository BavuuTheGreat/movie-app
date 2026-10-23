import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";


const api_token = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export const Upcoming = () => {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const getData = async () => {
        const response = await fetch (
            "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
            {
                headers: {
                    Authorization: `Bearer ${api_token}`
                },
            }
        );

        if (!response.ok) {
            throw new Error("TMDB request failed");
        }
        const jsonData = await response.json();
        return jsonData.results;
    };

    useEffect(() => {
        getData()
            .then((data) => setData(data))
            .catch(() => setErrorMessage("MOVIE API ERROR"))
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="w-full flex flex-col px-4 md:px-8 gap-8">
            <div className="w-full h-9 flex justify-between items-center">
                <p className="font-inter font-semibold text-[24px] text-[#09090B] leading-8">
                    Upcoming
                </p>
                <div
                    onClick={() => router.push("/category/upcoming")}
                    className="w-40 h-9 rounded-md flex justify-center items-center gap-2 bg-[#FFFFFF] border border-[#E4E4E7] hover:bg-[#F4F4F5]"
                    style={{ cursor: "pointer" }}
                    >
                        <p className="font-inter font-medium text-[14px] text-[#09090B] leading-5">
                            See more
                        </p>
                    </div>
            </div>

            {loading && (
                <p className="font-inter text-[14px] text-[#fafafa]">Loading...</p>
            )}

            {errorMessage && (
                <p className="font-inter text-[14px] text-red-500">{errorMessage}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
                {data.slice(0, 10).map((movie) => (
                    <div
                        key={movie.id}
                        onClick={() => router.push(`/detail/${movie.id}`)}
                        className="w-full rounded-lg overflow-hidden bg-[#F4F4F5]"
                        style={{ cursor: "pointer" }}>
                            <img
                                src={
                                    movie.poster_path
                                        ? `${IMG_BASE}${movie.poster_path}`
                                        : "https://placehold.co/500x750?text=No+Image"
                                }
                                alt={movie.title}
                                className="w-full aspect-[2/3] object-cover"
                                />
                            <div className="p-2 flex flex-col gap-1">
                                <p className="font-inter text-[12px] text-[#09090B]">
                                    ⭐ {movie.vote_average?.toFixed(1)}
                                    <span className="text-[#71717A]">/10</span>
                                </p>
                                <p className="font-inter text-[14px] text-[#09090B] leading-5">
                                    {movie.title}
                                </p>
                            </div>
                        </div>
                ))}
            </div>





        </div>
    )
}