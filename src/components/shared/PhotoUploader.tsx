import { useRef, type ChangeEvent } from "react";
import { FiPaperclip, FiX } from "react-icons/fi";

interface PhotoUploaderProps {
    photos: File[];
    onPhotosChange: (photos: File[]) => void;
    maxPhotos?: number;
    className?: string;
}

const PhotoUploader = ({
    photos,
    onPhotosChange,
    maxPhotos = 5,
    className = "",
}: PhotoUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        const totalFiles = photos.length + newFiles.length;

        if (totalFiles > maxPhotos) {
            alert(`You can only upload up to ${maxPhotos} photos`);
            return;
        }

        onPhotosChange([...photos, ...newFiles]);

        // Reset input so the same file can be selected again if removed and re-added
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemovePhoto = (indexToRemove: number) => {
        const updatedPhotos = photos.filter((_, index) => index !== indexToRemove);
        onPhotosChange(updatedPhotos);
    };

    const handleAddPhotoClick = () => {
        fileInputRef.current?.click();
    };

    const getPhotoUrl = (file: File): string => {
        return URL.createObjectURL(file);
    };

    // Show first 3 photos, then a "+N" badge for remaining
    const visiblePhotos = photos.slice(0, 3);
    const remainingCount = photos.length - 3;

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Add Photo Button */}
            <button
                type="button"
                onClick={handleAddPhotoClick}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEF5EA] hover:bg-[#f2e8d9] text-[#454545] rounded-lg transition-colors duration-200 text-sm font-medium"
                disabled={photos.length >= maxPhotos}
            >
                <FiPaperclip className="w-4 h-4" />
                <span>Add Photo</span>
            </button>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Photo Thumbnails */}
            {visiblePhotos.map((photo, index) => (
                <div
                    key={index}
                    className="relative group w-16 h-16 rounded-xs overflow-hidden border border-[#7D7D7D]"
                >
                    <img
                        src={getPhotoUrl(photo)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                    <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                        <FiX className="w-3 h-3" />
                    </button>
                </div>
            ))}

            {/* Remaining Photos Badge */}
            {remainingCount > 0 && (
                <div className="flex items-center justify-center w-16 h-16 rounded-xs bg-[#F49B31] text-white font-semibold text-sm border border-[#F49B31]">
                    +{remainingCount}
                </div>
            )}
        </div>
    );
};

export default PhotoUploader;
