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
            {/* Echo Icon - Using public SVG file */}
            <div className={`${currentSize.icon} relative`}>
                <img
                    src="/assets/images/Echo.svg"
                    alt="Echo logo"
                    className="w-full h-full"
                />
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
