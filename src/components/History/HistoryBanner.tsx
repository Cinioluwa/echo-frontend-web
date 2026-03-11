/**
 * HistoryBanner
 * Figma ref: 4183:13534 (desktop), 4183:13523 (mobile)
 * Phase: 4
 *
 * Hero gradient banner at the top of the History page.
 * Dark background with an orange/red glowing sphere illustration,
 * centered "History" title, and subtitle text.
 * Desktop: h-[257px], Mobile: h-[111px] with rounded-[8px]
 */

const HistoryBanner = () => {
    return (
        <div
            className="relative w-full overflow-hidden md:rounded-none rounded-lg"
            style={{ height: "unset" }}
        >
            {/* Desktop size */}
            <div className="hidden md:block h-[257px] relative bg-black overflow-hidden w-full">
                {/* Sphere glow layers — replicating Figma orange/red radial blobs */}
                <div
                    className="absolute"
                    style={{
                        bottom: "-80px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "560px",
                        height: "560px",
                        borderRadius: "50%",
                        background:
                            "radial-gradient(ellipse at center, #F49B31 0%, #D4420A 30%, #8B1A00 55%, transparent 75%)",
                        opacity: 0.95,
                    }}
                />
                {/* Inner highlight */}
                <div
                    className="absolute"
                    style={{
                        bottom: "-50px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "280px",
                        height: "280px",
                        borderRadius: "50%",
                        background:
                            "radial-gradient(ellipse at 40% 35%, #FFD580 0%, #F49B31 40%, transparent 70%)",
                        opacity: 0.85,
                    }}
                />
                {/* Noise texture overlay */}
                <div
                    className="absolute inset-0 opacity-[0.08] pointer-events-none"
                    style={{
                        backgroundImage:
                            "url('data:image/svg+xml,%3Csvg viewBox%3D%220 0 256 256%22 xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter id%3D%22noise%22%3E%3CfeTurbulence type%3D%22fractalNoise%22 baseFrequency%3D%220.9%22 numOctaves%3D%224%22 stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect width%3D%22100%25%22 height%3D%22100%25%22 filter%3D%22url(%23noise)%22%2F%3E%3C%2Fsvg%3E')",
                        backgroundSize: "200px 200px",
                    }}
                />
                {/* Text content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2">
                    <h1
                        className="font-['Poppins',sans-serif] font-semibold text-[40px] text-white text-center leading-normal"
                    >
                        History
                    </h1>
                    <p
                        className="font-['Poppins',sans-serif] font-medium text-[20px] text-[#dadada] text-center leading-normal"
                    >
                        See all the problems you&apos;ve posted, solutions proposed and surges made.
                    </p>
                </div>
            </div>

            {/* Mobile size */}
            <div className="md:hidden h-[111px] relative bg-black overflow-hidden w-full rounded-lg">
                {/* Sphere glow */}
                <div
                    className="absolute"
                    style={{
                        bottom: "-45px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "220px",
                        height: "220px",
                        borderRadius: "50%",
                        background:
                            "radial-gradient(ellipse at center, #F49B31 0%, #D4420A 30%, #8B1A00 55%, transparent 75%)",
                        opacity: 0.95,
                    }}
                />
                <div
                    className="absolute"
                    style={{
                        bottom: "-25px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "110px",
                        height: "110px",
                        borderRadius: "50%",
                        background:
                            "radial-gradient(ellipse at 40% 35%, #FFD580 0%, #F49B31 40%, transparent 70%)",
                        opacity: 0.85,
                    }}
                />
                {/* Text content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full gap-1">
                    <h1
                        className="font-['Poppins',sans-serif] font-semibold text-[20px] text-white text-center leading-normal"
                    >
                        History
                    </h1>
                    <p
                        className="font-['Poppins',sans-serif] font-medium text-[10px] text-[#dadada] text-center leading-normal"
                    >
                        See all the problems you&apos;ve posted, solutions proposed and surges made.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HistoryBanner;
