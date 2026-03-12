/**
 * InlinePingCreator
 * Figma ref: 3843:8597 (desktop 3 variants), 3912:9408 (mobile 3 variants)
 * Phase: 2
 *
 * Expandable inline form that replaces the modal-first ping creation approach.
 * State 1 — Collapsed: avatar + "What's the problem?" clickable bar
 * State 2 — Expanded: title + body inputs + category chips + attach + Post button
 * State 3 — Expanded with images: same as State 2 + photo thumbnails
 */

import { useState, useRef } from "react";
import { useAuthStore, useCategoriesStore, usePingsStore } from "../stores";
import { pingService, uploadService } from "../api/services";

type ExpansionState = "collapsed" | "expanded" | "with-photos";

const CATEGORIES = ["General", "Academics", "Chapel", "Finance", "Hall", "Sport", "Welfare"] as const;
type Category = typeof CATEGORIES[number];

const InlinePingCreator = () => {
    const user = useAuthStore((state) => state.user);
    const [state, setState] = useState<ExpansionState>("collapsed");
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [photos, setPhotos] = useState<File[]>([]);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const userInitials = user
        ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
        : "?";

    const handleCollapsedClick = () => {
        setState("expanded");
    };

    const handleCancel = () => {
        setState("collapsed");
        setTitle("");
        setBody("");
        setSelectedCategory(null);
        setPhotos([]);
        setIsAnonymous(false);
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setPhotos((prev) => [...prev, ...files].slice(0, 5));
        if (files.length > 0) setState("with-photos");
    };

    const handleRemovePhoto = (index: number) => {
        setPhotos((prev) => {
            const updated = prev.filter((_, i) => i !== index);
            if (updated.length === 0) setState("expanded");
            return updated;
        });
    };

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !selectedCategory) return;
        setIsPosting(true);
        setError(null);
        try {
            let mediaIds: number[] = [];
            if (photos.length > 0) {
                const uploaded = await uploadService.uploadFiles(photos, "ping");
                mediaIds = uploaded.map((m) => m.id);
            }

            const categories = useCategoriesStore.getState().categories;
            const categoryId = categories.find((c) => c.label === selectedCategory)?.id;
            if (!categoryId) throw new Error("Category not found");

            await pingService.createPing({
                title: title.trim(),
                content: body.trim(),
                categoryId,
                isAnonymous,
                mediaIds: mediaIds.length > 0 ? mediaIds : undefined,
            });

            usePingsStore.getState().invalidateCache();
            usePingsStore.getState().fetchPings({ sort: "trending" });

            handleCancel();
        } catch (err) {
            console.error("Failed to create ping:", err);
            setError("Failed to create ping. Please try again.");
        } finally {
            setIsPosting(false);
        }
    };

    /* ─── Collapsed State ─────────────────────────────────── */
    if (state === "collapsed") {
        return (
            <div className="bg-white rounded-[10px] px-5 py-[15px] flex items-center gap-[13px] cursor-pointer w-full" onClick={handleCollapsedClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") handleCollapsedClick(); }}>
                <Avatar initials={userInitials} />
                <div className="flex-1 h-[50px] border-2 border-[#FFC37B] rounded-[20px] flex items-center pl-[27px]">
                    <span className="font-['Poppins',sans-serif] font-semibold italic text-[14px] text-black/70 select-none">
                        What's the problem?
                    </span>
                </div>
            </div>
        );
    }

    /* ─── Expanded States (with and without photos) ─────── */
    return (
        <form
            onSubmit={handlePost}
            className="bg-white rounded-[10px] px-5 py-[15px] flex flex-col gap-[13px] w-full"
        >
            {/* Row 1: Avatar + Title */}
            <div className="flex items-center gap-[13px]">
                <Avatar initials={userInitials} />
                <div className="flex-1 h-[50px] border-2 border-[#FFC37B] rounded-[20px] flex items-center pl-[27px] pr-5 bg-white">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title..."
                        required
                        autoFocus
                        className="flex-1 font-['Poppins',sans-serif] font-semibold italic text-[14px] text-black/70 bg-transparent outline-none"
                    />
                </div>
            </div>

            {/* Row 2: Body textarea */}
            <div className="border-2 border-[#FFC37B] rounded-[20px] flex items-center pl-[27px] pr-5 py-3 bg-white min-h-[50px]">
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Body..."
                    rows={2}
                    className="flex-1 font-['Poppins',sans-serif] font-semibold italic text-[14px] text-black/70 bg-transparent outline-none resize-none leading-snug"
                />
            </div>

            {/* Anonymous toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 accent-[#F49B31]"
                />
                <span className="font-['Poppins',sans-serif] text-[13px] text-black/70">Post anonymously</span>
            </label>

            {/* Row 3: Attach + Category selector + Post */}
            <div className="flex items-center gap-[30px]">
                {/* Attach */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Attach photos"
                    className="shrink-0 cursor-pointer"
                >
                    <svg width="35" height="36" viewBox="0 0 35 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <circle cx="17.5" cy="18" r="16.5" stroke="#F49B31" strokeWidth="2" />
                        <path d="M17.5 11v14M11 18h13" stroke="#F49B31" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoSelect}
                    className="hidden"
                    aria-label="Upload photos"
                />

                {/* Category chips - scrollable */}
                <div className="flex-1 overflow-x-auto">
                    <div className="flex items-center min-w-max">
                        {CATEGORIES.map((cat, i) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                                className={`font-['Poppins',sans-serif] font-medium text-[14px] px-5 py-2.5 border-2 border-[#454545] cursor-pointer transition-colors ${selectedCategory === cat
                                    ? "bg-[#F49B31] text-white border-[#F49B31]"
                                    : "bg-[#FEF5EA] text-black"
                                    } ${i === 0 ? "rounded-l-[25px] border-r" : i === CATEGORIES.length - 1 ? "rounded-r-[25px] border-l" : "border-l border-r"}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Post button */}
                <button
                    type="submit"
                    disabled={isPosting || !title.trim()}
                    className="bg-[#F49B31] text-white font-['Poppins',sans-serif] font-medium text-[14px] px-5 py-2.5 rounded-[15px] cursor-pointer hover:bg-[#d88429] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                    {isPosting ? "Posting..." : "Post"}
                </button>
            </div>

            {/* Photo thumbnails (State 3) */}
            {photos.length > 0 && (
                <div className="flex items-center gap-2.5 flex-wrap">
                    {photos.slice(0, 3).map((file, idx) => (
                        <div key={idx} className="relative w-[100px] h-[100px] rounded-xs overflow-hidden shadow">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`Upload ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemovePhoto(idx)}
                                aria-label="Remove photo"
                                className="absolute top-1 right-1 bg-white/90 rounded-full w-[22px] h-[22px] flex items-center justify-center text-red-500 text-xs font-bold cursor-pointer hover:bg-red-500 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    {photos.length > 3 && (
                        <div className="w-[33px] h-[33px] rounded-[15px] bg-[#F49B31] flex items-center justify-center shrink-0">
                            <span className="font-['Poppins',sans-serif] text-[14px] text-white leading-none">
                                {photos.length - 3}+
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Error message */}
            {error && <p className="text-red-500 text-[13px] font-['Poppins',sans-serif]">{error}</p>}

            {/* Cancel link */}
            <button
                type="button"
                onClick={handleCancel}
                className="font-['Poppins',sans-serif] text-[13px] text-[#F49B31] cursor-pointer hover:underline text-left w-fit"
            >
                Cancel
            </button>
        </form>
    );
};

function Avatar({ initials }: { initials: string }) {
    return (
        <div className="w-[50px] h-[50px] rounded-full bg-[#FFC37B] flex items-center justify-center shrink-0 overflow-hidden">
            <span className="font-['Poppins',sans-serif] font-bold text-[18px] text-white">
                {initials}
            </span>
        </div>
    );
}

export default InlinePingCreator;
