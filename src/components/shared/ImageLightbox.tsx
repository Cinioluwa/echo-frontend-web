/**
 * ImageLightbox
 * Full-screen image viewer triggered by clicking any post image.
 * - Click backdrop or × button to close
 * - ESC key closes
 * - Smooth open/close via framer-motion
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  src?: string;
  images?: string[];
  initialIndex?: number;
  alt?: string;
  onClose: () => void;
}

const ImageLightbox = ({ src, images = [], initialIndex = 0, alt = "Image", onClose }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const activeImages = src ? [src] : images;
  const currentSrc = activeImages[currentIndex];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < activeImages.length - 1) {
      setCurrentIndex(curr => curr + 1);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(curr => curr - 1);
    }
  };

  // Keyboard navigation & close on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && currentIndex < activeImages.length - 1) setCurrentIndex(prev => prev + 1);
      if (e.key === "ArrowLeft" && currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, currentIndex, activeImages.length]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!currentSrc) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-200 flex items-center justify-center bg-black/85 p-4 select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-201 rounded-full bg-white/10 p-2 text-white hover:bg-white/25 transition-colors cursor-pointer"
          aria-label="Close image"
        >
          <X size={22} />
        </button>

        {activeImages.length > 1 && currentIndex > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 lg:left-8 z-201 rounded-full bg-black/50 p-2 lg:p-3 text-white hover:bg-black/70 transition-colors cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        <motion.img
          key={currentSrc}
          src={currentSrc}
          alt={alt}
          className="max-h-[90vh] max-w-[90vw] w-auto h-auto rounded-[10px] object-contain shadow-2xl"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          draggable={false}
        />

        {activeImages.length > 1 && currentIndex < activeImages.length - 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 lg:right-8 z-201 rounded-full bg-black/50 p-2 lg:p-3 text-white hover:bg-black/70 transition-colors cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* Indicator dots */}
        {activeImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-201 bg-black/30 px-3 py-2 rounded-full backdrop-blur-sm">
            {activeImages.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? "bg-white scale-125" : "bg-white/50"
                  }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageLightbox;
