import React, { useState, useEffect, useCallback, useRef } from "react";
import { adminService } from "../../../api/services/admin.service";

const GeneralSettings: React.FC = () => {
  const [spaceName, setSpaceName] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("/assets/images/Echo Logo_black.svg");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const settings = await adminService.getOrgSettings();
      setSpaceName(settings.organization.name);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      await adminService.updateOrgSettings({ name: spaceName, description });
      setSuccess("Settings saved successfully.");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-[#f49b31] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <div className="pb-4">
        <h2 className="font-poppins font-semibold text-[18px] text-[#212121]">
          Organization Profile
        </h2>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[13px] font-poppins">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-[13px] font-poppins">
          {success}
        </div>
      )}

      <div className="flex items-center gap-6">
        <div className="w-[100px] h-[100px] rounded-full border border-[#f49b31] bg-[#fef5ea] flex items-center justify-center overflow-hidden shrink-0">
          <img
            src={logoUrl}
            alt="Organization Logo"
            className="w-[60%] h-[60%] object-contain"
            onError={(e) => {
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

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-[#f49b31] text-white font-poppins font-semibold text-[14px] rounded-[10px] hover:bg-[#d88429] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default GeneralSettings;
