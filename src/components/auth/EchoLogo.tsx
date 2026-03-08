import React from "react";

interface EchoLogoProps {
    className?: string;
    size?: "sm" | "md" | "lg";
}

/**
 * EchoLogo Component
 * Echo logo with icon and text matching Figma design
 * Design: Orange icon (#ffc37b text) with "Echo" text in Poppins Bold
 */
const EchoLogo: React.FC<EchoLogoProps> = ({ className = "", size = "md" }) => {
    const sizes = {
        sm: { container: "gap-1", icon: "w-6 h-6", text: "text-xl" },
        md: { container: "gap-[5.625px]", icon: "w-[29.25px] h-[30.375px]", text: "text-[33.75px]" },
        lg: { container: "gap-2", icon: "w-10 h-10", text: "text-5xl" },
    };

    const currentSize = sizes[size];

    return (
        <div className={`flex items-center justify-center ${currentSize.container} ${className}`}>
            {/* Echo Icon - Using SVG for vector quality */}
            <div className={`${currentSize.icon} relative`}>
                <svg
                    viewBox="0 0 30 31"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                >
                    {/* Top arc */}
                    <path
                        d="M13.5 15.5C13.5 12.5 15.5 10 18.5 8"
                        stroke="#ffc37b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                    />
                    {/* Bottom arc */}
                    <path
                        d="M4 27C4 21 8 17.5 13.5 17.5C19 17.5 23 21 23 27"
                        stroke="#ffc37b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                    />
                    {/* Top arc 2 */}
                    <path
                        d="M12 1.5C12 5 9.5 8 6 10"
                        stroke="#ffc37b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                    />
                    {/* Mid arc */}
                    <path
                        d="M5 7C7 7 9 8.5 10 11"
                        stroke="#ffc37b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                    />
                    {/* Small arc */}
                    <path
                        d="M8.5 10C9 10 10 11 10.5 12.5"
                        stroke="#ffc37b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                    />
                </svg>
            </div>

            {/* Echo Text */}
            <span
                className={`font-bold ${currentSize.text} text-[#ffc37b] leading-none`}
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}
            >
                Echo
            </span>
        </div>
    );
};

export default EchoLogo;
