"use client";

import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star } from "lucide-react";

export type Review = {
    author_name: string;
    rating: number;
    text: string;
    profile_photo_url: string;
};

export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

    useEffect(() => {
        if (emblaApi) {
            // Auto-play simple (opcional)
            const interval = setInterval(() => emblaApi.scrollNext(), 5000);
            return () => clearInterval(interval);
        }
    }, [emblaApi]);

    return (
        <div className="overflow-hidden w-full max-w-6xl mx-auto py-8" ref={emblaRef}>
            <div className="flex touch-pan-y">
                {reviews.map((review, index) => (
                    <div
                        key={index}
                        className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4"
                    >
                        <div className="bg-white/5 border border-gray-200/20 p-6 rounded-2xl h-full flex flex-col gap-4 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <img
                                    src={review.profile_photo_url}
                                    alt={review.author_name}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <h4 className="font-semibold text-white">{review.author_name}</h4>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-500"}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm line-clamp-4 flex-grow">
                                "{review.text}"
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}