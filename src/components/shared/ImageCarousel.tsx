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

    // Single image: Twitter/X-style (ambient blurred backdrop for gaps, sharp uncropped foreground)
    if (images.length === 1) {
        const singleImg = images[0];
        return (
            <>
                <div 
                    className="relative mt-3 w-full rounded-[14px] overflow-hidden border border-black/15 bg-black/90 flex items-center justify-center cursor-zoom-in group max-h-[520px]"
                    onClick={(e) => openLightbox(singleImg.url, e)}
                >
                    {/* Ambient blurred backdrop fills any vertical or horizontal gaps */}
                    <img
                        src={singleImg.url}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-2xl scale-120 opacity-60 pointer-events-none select-none"
                    />
                    <img
                        src={singleImg.url}
                        alt={altText}
                        className="relative z-10 w-full h-auto max-h-[520px] object-contain rounded-[14px] transition-opacity duration-200 hover:opacity-95"
                        loading="lazy"
                    />
                </div>
                {lightboxSrc !== null && (
                    <ImageLightbox
                        images={[singleImg.url]}
                        initialIndex={0}
                        alt={altText}
                        onClose={() => setLightboxSrc(null)}
                    />
                )}
            </>
        );
    }

    // Multiple images: smooth scrollable carousel with ambient blurred backdrops
    return (
        <>
            <div className="relative mt-3 w-full group overflow-hidden rounded-[14px] border border-black/15 bg-black/90" onClick={(e) => e.stopPropagation()}>
                <div 
                    ref={scrollContainerRef}
                    className="flex w-full overflow-x-auto snap-x snap-mandatory max-h-[500px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-x-none"
                    onScroll={handleScroll}
                >
                    {images.map((img) => (
                        <div 
                            key={img.id} 
                            className="relative w-full flex-none snap-center cursor-zoom-in flex items-center justify-center overflow-hidden max-h-[480px]"
                            onClick={(e) => openLightbox(img.url, e)}
                        >
                            {/* Ambient blurred backdrop fills gaps */}
                            <img
                                src={img.url}
                                alt=""
                                aria-hidden="true"
                                className="absolute inset-0 w-full h-full object-cover blur-2xl scale-120 opacity-60 pointer-events-none select-none"
                            />
                            <img
                                src={img.url}
                                alt={altText}
                                className="relative z-10 w-full h-auto max-h-[480px] object-contain rounded-[10px] transition-opacity duration-200 hover:opacity-95"
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
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10 cursor-pointer shadow-sm"
                                aria-label="Previous image"
                            >
                                <FaChevronLeft className="w-3.5 h-3.5 pr-[1px]" />
                            </button>
                        )}
                        {activeIndex < images.length - 1 && (
                            <button 
                                type="button"
                                onClick={next}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10 cursor-pointer shadow-sm"
                                aria-label="Next image"
                            >
                                <FaChevronRight className="w-3.5 h-3.5 pl-[1px]" />
                            </button>
                        )}
                        
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-xs">
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
            </div>

            {lightboxSrc !== null && (
                <ImageLightbox
                    images={images.map((img) => img.url)}
                    initialIndex={Math.max(0, images.findIndex((img) => img.url === lightboxSrc))}
                    alt={altText}
                    onClose={() => setLightboxSrc(null)}
                />
            )}
        </>
    );
};

export default ImageCarousel;
