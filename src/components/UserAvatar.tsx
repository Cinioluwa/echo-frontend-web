/**
 * UserAvatar Component
 * Reusable avatar that displays user profile picture with fallback to initials or icon
 * 
 * Features:
 * - Displays profile picture if available and loads successfully
 * - Falls back to user initials if no picture or image fails to load
 * - Falls back to User icon if no initials available
 * - Supports customizable sizes and colors
 * - Handles image load errors gracefully
 */

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import type { User as UserType } from "../api/types";

interface UserAvatarProps {
    user?: UserType | null;
    size?: "sm" | "md" | "lg";
    responsive?: boolean;
    className?: string;
    initialsOnly?: boolean;
    bgColor?: string;
    pictureUrl?: string; // Custom picture URL (takes precedence over user.profilePicture)
}

const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
};

const responsiveSizeClasses = {
    sm: "w-6 md:w-8 h-6 md:h-8 text-xs md:text-sm",
    md: "w-7 md:w-10 h-7 md:h-10 text-xs md:text-sm",
    lg: "w-7 md:w-[53px] h-7 md:h-[53px] text-[10px] md:text-[18px]",
};

const getInitials = (firstName?: string, lastName?: string): string => {
    if (!firstName && !lastName) return "?";
    const first = firstName?.[0]?.toUpperCase() ?? "";
    const last = lastName?.[0]?.toUpperCase() ?? "";
    return (first + last).slice(0, 2);
};

const UserAvatar = ({
    user,
    size = "md",
    className = "",
    initialsOnly = false,
    responsive = false,
    bgColor = "bg-[#f49b31]",
    pictureUrl,
}: UserAvatarProps) => {
    const [imageLoadError, setImageLoadError] = useState(false);
    const activePicture = pictureUrl || user?.profilePicture || "";

    useEffect(() => {
        setImageLoadError(false);
    }, [activePicture]);

    // If custom picture URL provided, use it
    if (pictureUrl && !imageLoadError) {
        const sizeClass = responsive ? responsiveSizeClasses[size] : sizeClasses[size];
        return (
            <div
                className={`${sizeClass} rounded-full overflow-hidden shrink-0 ${className}`}
            >
                <img
                    src={pictureUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={() => setImageLoadError(true)}
                />
            </div>
        );
    }

    // No user data - show user icon
    if (!user) {
        const sizeClass = responsive ? responsiveSizeClasses[size] : sizeClasses[size];
        return (
            <div
                className={`${sizeClass} rounded-full ${bgColor} flex items-center justify-center overflow-hidden shrink-0 ${className}`}
            >
                <User className="w-2/3 h-2/3 text-white" />
            </div>
        );
    }

    const hasProfilePicture = user.profilePicture && !imageLoadError;
    const initials = getInitials(user.firstName, user.lastName);
    const sizeClass = responsive ? responsiveSizeClasses[size] : sizeClasses[size];

    // Show profile picture if available and loaded successfully
    if (hasProfilePicture && !initialsOnly) {
        return (
            <div
                className={`${sizeClass} rounded-full overflow-hidden shrink-0 ${className}`}
            >
                <img
                    src={user.profilePicture}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                    onError={() => setImageLoadError(true)}
                />
            </div>
        );
    }

    // Fallback to initials
    return (
        <div
            className={`${sizeClass} rounded-full ${bgColor} flex items-center justify-center overflow-hidden shrink-0 font-semibold text-white ${className}`}
        >
            {initials}
        </div>
    );
};

export default UserAvatar;
