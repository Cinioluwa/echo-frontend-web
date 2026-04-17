import React, { useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import ImageLightbox from "./ImageLightbox";

interface ImageCarouselProps {
    images: { id: number | string; url: string; }[];
    altText?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, altText = "Image" }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    if (!images || images.length === 0) return null;

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const width = scrollContainerRef.current.clientWidth;
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        // Adding a small buffer to index calculation to ensure smooth snapping indicators
        const index = Math.round(scrollLeft / width);
        if (index !== activeIndex && index >= 0 && index < images.length) {
            setActiveIndex(index);
        }
    };

    const scrollToIndex = (index: number) => {
        if (!scrollContainerRef.current) return;
        const width = scrollContainerRef.current.clientWidth;
        scrollContainerRef.current.scrollTo({
            left: index * width,
            behavior: "smooth"
        });
        setActiveIndex(index);
    };

    const next = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (activeIndex < images.length - 1) {
            scrollToIndex(activeIndex + 1);
        }
    };

    const prev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (activeIndex > 0) {
            scrollToIndex(activeIndex - 1);
        }
    };

    const openLightbox = (url: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setLightboxSrc(url);
    };

    return (
        <div className="relative mt-3 w-full group overflow-hidden rounded-[14px] border border-black/10 bg-[#F8F7F3]" onClick={(e) => e.stopPropagation()}>
            <div 
                ref={scrollContainerRef}
                className="flex w-full overflow-x-auto snap-x snap-mandatory aspect-video [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-x-none"
                onScroll={handleScroll}
            >
                {images.map((img) => (
                    <div 
                        key={img.id} 
                        className="w-full flex-none snap-center cursor-zoom-in flex items-center justify-center bg-black/5"
                        onClick={(e) => openLightbox(img.url, e)}
                    >
                        <img
                            src={img.url}
                            alt={altText}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>

            {images.length > 1 && (
                <>
                    {activeIndex > 0 && (
                        <button 
                            type="button"
                            onClick={prev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 z-10 cursor-pointer"
                            aria-label="Previous image"
                        >
                            <FaChevronLeft className="w-[14px] h-[14px] pr-[2px]" />
                        </button>
                    )}
                    {activeIndex < images.length - 1 && (
                        <button 
                            type="button"
                            onClick={next}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 z-10 cursor-pointer"
                            aria-label="Next image"
                        >
                            <FaChevronRight className="w-[14px] h-[14px] pl-[2px]" />
                        </button>
                    )}
                    
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-[5px] z-10 bg-black/20 px-2 py-1.5 rounded-full backdrop-blur-sm">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={(e) => { e.stopPropagation(); scrollToIndex(i); }}
                                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                                    i === activeIndex ? "bg-white scale-125" : "bg-white/60"
                                }`}
                                aria-label={`Go to image ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}

            {lightboxSrc !== null && (
                <ImageLightbox
                    images={images.map((img) => img.url)}
                    initialIndex={Math.max(0, images.findIndex((img) => img.url === lightboxSrc))}
                    alt={altText}
                    onClose={() => setLightboxSrc(null)}
                />
            )}
        </div>
    );
};

export default ImageCarousel;
