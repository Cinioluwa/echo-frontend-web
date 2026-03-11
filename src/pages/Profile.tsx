import { useState } from "react";
import { useAuthStore } from "../stores";
import ProfileChart from "../components/ProfileChart";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#FAE9D4]">
            {/* Main Content */}
            <main className="pt-12 pb-16">
                <div className="max-w-[709px] mx-auto px-4">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-1.5 bg-[#e9ab7a] border border-[#7b7b79] rounded-[18px] opacity-90 hover:opacity-100 transition-opacity mb-6"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 text-[#414141]" />
                        <span className="text-[10px] font-medium text-[#414141]">Back</span>
                    </button>

                    {/* Header - Centered */}
                    <div className="text-center mb-8">
                        <h1 className="text-[23px] font-medium text-[#060606] mb-2">Profile Information</h1>
                        <p className="text-[15px] font-medium text-[#585f6c]">The About Section</p>
                    </div>

                    {/* Analytics Section */}
                    <div className="mb-6">
                        <h2 className="text-xs font-normal text-black mb-4 uppercase">
                            ANALYTICS
                        </h2>

                        <ProfileChart />
                    </div>

                    {/* Personal Information Section */}
                    <div className="mb-6">
                        <h2 className="text-xs font-normal text-black mb-4 uppercase">
                            PERSONAL INFORMATION
                        </h2>

                        <div className="space-y-4">
                            {/* First Name */}
                            <div className="border border-[#626665] rounded-[1px] px-[19px] py-[11px] bg-[#FFFBF5] flex items-center gap-[11px]">
                                <span className="text-[13px] font-semibold text-black min-w-[82px]">First Name :</span>
                                <span className="text-[13px] font-medium text-[#f49b31]">{user.firstName}</span>
                            </div>

                            {/* Last Name */}
                            <div className="border border-[#626665] rounded-[1px] px-[19px] py-[11px] bg-[#FFFBF5] flex items-center gap-[11px]">
                                <span className="text-[13px] font-semibold text-black min-w-[75px]">Last Name:</span>
                                <span className="text-[13px] font-medium text-[#f49b31]">{user.lastName}</span>
                            </div>

                            {/* Email */}
                            <div className="border border-[#626665] rounded-[1px] px-[19px] py-[11px] bg-[#FFFBF5] flex items-center gap-[11px]">
                                <span className="text-[13px] font-semibold text-black min-w-[49px]">Email:</span>
                                <span className="text-[13px] font-medium text-[#f49b31]">{user.email}</span>
                            </div>

                            {/* Password */}
                            <div className="border border-[#626665] rounded-[1px] px-[19px] py-[11px] bg-[#FFFBF5] flex items-center gap-[11px]">
                                <span className="text-[13px] font-semibold text-black shrink-0">Password :</span>
                                <span className="text-[13px] font-medium text-[#f49b31] flex-1">*************</span>
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-gray-600 hover:text-gray-800 shrink-0"
                                >
                                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Change Password Section */}
                    <div className="mb-6">
                        <h2 className="text-[13px] font-medium text-black mb-4">
                            CHANGE PASSWORD
                        </h2>

                        <div className="space-y-4">
                            {/* OTP */}
                            <div className="border border-[#626665] rounded-[1px] px-[19px] py-[11px] bg-[#FFFBF5] flex items-center gap-[11px]">
                                <span className="text-[13px] font-semibold text-black min-w-[31px]">OTP:</span>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="1234"
                                    className="text-[13px] font-medium text-[#f49b31] bg-transparent border-none outline-none flex-1 placeholder:text-[#f49b31]/50"
                                />
                            </div>

                            {/* New Password */}
                            <div className="border border-[#626665] rounded-[1px] px-[19px] py-[11px] bg-[#FFFBF5] flex items-center gap-[11px]">
                                <span className="text-[13px] font-semibold text-black shrink-0">New Password :</span>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="*************"
                                    className="text-[13px] font-medium text-[#f49b31] bg-transparent border-none outline-none flex-1 placeholder:text-[#f49b31]/50"
                                />
                                <button
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="text-gray-600 hover:text-gray-800 shrink-0"
                                >
                                    {showNewPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button className="w-full bg-[#f49b31] hover:bg-[#d88429] text-white text-[14px] font-medium py-2.5 rounded-[9px] transition-colors">
                        Save Changes
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Profile;
