import { useRouter } from "next/navigation";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export const MovieCard = ({ movie }) => {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/detail/${movie.id}`)}
            className="w-full rounded-lg overflow-hidden bg-[#F4F4F5]"
            style={{ cursor: "pointer" }}
        >
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
    );
};
