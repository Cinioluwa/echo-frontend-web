import React, { useState, useRef } from "react";

const GeneralSettings: React.FC = () => {
    const [spaceName, setSpaceName] = useState("Covenant University");
    const [description, setDescription] = useState("Brief description of the space");
    const [logoUrl, setLogoUrl] = useState("/assets/images/Echo Logo_black.svg"); // Default logo or icon
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setLogoUrl(url);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full animate-fade-in ">
            {/* Header */}
            <div className="pb-4">
                <h2 className="font-poppins font-semibold text-[18px] text-[#212121]">
                    Organization Profile
                </h2>
            </div>

            {/* Profile Picture / Logo Section */}
            <div className="flex items-center gap-6">
                <div className="w-[100px] h-[100px] rounded-full border border-[#f49b31] bg-[#fef5ea] flex items-center justify-center overflow-hidden shrink-0">
                    <img
                        src={logoUrl}
                        alt="Organization Logo"
                        className="w-[60%] h-[60%] object-contain"
                        onError={(e) => {
                            // Fallback if logo fails to load
                            e.currentTarget.src = "https://api.dicebear.com/7.x/initials/svg?seed=CU";
                        }}
                    />
                </div>
                <div className="flex flex-col gap-2 items-start">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 border border-[#f49b31] rounded-[10px] bg-white hover:bg-[#fef5ea] text-[#f49b31] font-poppins font-medium text-[14px] transition-colors"
                    >
                        Change logo
                    </button>
                    <span className="font-poppins text-[12px] text-[#8b8e8d]">
                        JPG, PNG or GIF. Max size 5MB
                    </span>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleLogoChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
            </div>

            {/* Space Form Section */}
            <div className="flex flex-col gap-5 w-full">
                <div className="flex flex-col gap-2 w-full">
                    <label className="font-poppins font-medium text-[14px] text-[#5e5c58]">
                        Space Name
                    </label>
                    <input
                        type="text"
                        value={spaceName}
                        onChange={(e) => setSpaceName(e.target.value)}
                        className="w-full px-5 py-3 border border-[#ffd7a8] bg-[#FEF5EA] rounded-[9px] font-poppins text-[15px] text-[#212121] focus:border-[#f49b31] outline-none transition-colors"
                    />
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <label className="font-poppins font-medium text-[14px] text-[#5e5c58]">
                        About/Description
                    </label>
                    <textarea
                        rows={6}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-5 py-3 border border-[#ffd7a8] bg-[#FEF5EA] rounded-[9px] font-poppins text-[15px] text-[#212121] focus:border-[#f49b31] outline-none transition-colors resize-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;
