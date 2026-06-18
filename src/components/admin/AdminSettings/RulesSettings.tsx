import React, { useState, useEffect, useCallback } from "react";
import { adminService } from "../../../api/services/admin.service";

const RulesSettings: React.FC = () => {
  const [allowMedia, setAllowMedia] = useState(true);
  const [cooldown, setCooldown] = useState("10");
  const [reportsThreshold, setReportsThreshold] = useState("3");
  const [hidePending, setHidePending] = useState(true);
  const [minSurges, setMinSurges] = useState("10");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    try {
      setLoading(true);
      const rules = await adminService.getOrgRules();
      setAllowMedia(rules.allowMediaAttachments);
      setCooldown(rules.sameTopicCooldownHours.toString());
      setReportsThreshold(rules.autoFlagReportThreshold.toString());
      setHidePending(rules.hideFlaggedContentPending);
      setMinSurges(rules.minSurgesForWave.toString());
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load rules");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      await adminService.updateOrgRules({
        allowMediaAttachments: allowMedia,
        sameTopicCooldownHours: parseInt(cooldown),
        autoFlagReportThreshold: parseInt(reportsThreshold),
        hideFlaggedContentPending: hidePending,
        minSurgesForWave: parseInt(minSurges),
      });
      setSuccess("Rules saved successfully.");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to save rules");
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
    <div className="flex flex-col gap-8 w-full animate-fade-in">
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

      <div className="flex flex-col gap-4 w-full">
        <div className="pb-2">
          <h3 className="font-poppins font-semibold text-[16px] text-black">
            Posting behaviour
          </h3>
          <p className="font-poppins text-[12px] text-black mt-1">
            Control what students can submit and keep track of when they can post
          </p>
        </div>

        <div className="flex items-center justify-between p-5 border border-[#7D7D7D] rounded-[10px] hover:border-[#f49b31] transition-colors">
          <div className="flex flex-col gap-0.5">
            <span className="font-poppins font-medium text-[14px] text-black">
              Allow media attachments on pings
            </span>
            <span className="font-poppins text-[12px] text-[#626665]">
              Students can upload images or files when submitting a ping
            </span>
          </div>
          <button
            onClick={() => setAllowMedia(!allowMedia)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${allowMedia ? "bg-[#f49b31]" : "bg-[#e5e5e5]"}`}
            aria-label="Toggle allow media"
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${allowMedia ? "translate-x-6" : "translate-x-0"}`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-5 border border-[#7D7D7D] rounded-[10px] hover:border-[#f49b31] transition-colors">
          <div className="flex flex-col gap-0.5">
            <span className="font-poppins font-medium text-[14px] text-black">
              Same-topic posting cooldown
            </span>
            <span className="font-poppins text-[12px] text-[#626665]">
              Time students must wait before posting similar topics again
            </span>
          </div>
          <div className="relative">
            <select
              value={cooldown}
              onChange={(e) => setCooldown(e.target.value)}
              className="appearance-none bg-white border border-[#ffd7a8] rounded-[10px] px-4 py-2 pr-10 font-poppins text-[14px] font-medium text-black outline-none focus:border-[#f49b31] cursor-pointer"
            >
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="6">6 hours</option>
              <option value="12">12 hours</option>
              <option value="24">24 hours</option>
              <option value="48">48 hours</option>
              <option value="72">72 hours</option>
              <option value="168">168 hours (1 week)</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#f49b31]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="pb-2">
          <h3 className="font-poppins font-semibold text-[16px] text-black">
            Moderation thresholds
          </h3>
          <p className="font-poppins text-[12px] text-black mt-1">
            Set the triggers for bringing flagged content to your attention
          </p>
        </div>

        <div className="flex items-center justify-between p-5 border border-[#7D7D7D] rounded-[10px] hover:border-[#f49b31] transition-colors">
          <div className="flex flex-col gap-0.5">
            <span className="font-poppins font-medium text-[14px] text-black">
              Reports before a ping is auto-flagged
            </span>
            <span className="font-poppins text-[12px] text-[#626665]">
              Flag a ping if flagged this many times by unique users
            </span>
          </div>
          <div className="relative">
            <select
              value={reportsThreshold}
              onChange={(e) => setReportsThreshold(e.target.value)}
              className="appearance-none bg-white border border-[#ffd7a8] rounded-[10px] px-4 py-2 pr-10 font-poppins text-[14px] font-medium text-black outline-none focus:border-[#f49b31] cursor-pointer"
            >
              <option value="2">2 reports</option>
              <option value="3">3 reports</option>
              <option value="5">5 reports</option>
              <option value="10">10 reports</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#f49b31]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-5 border border-[#7D7D7D] rounded-[10px] hover:border-[#f49b31] transition-colors">
          <div className="flex flex-col gap-0.5">
            <span className="font-poppins font-medium text-[14px] text-black">
              Hide flagged content pending review
            </span>
            <span className="font-poppins text-[12px] text-[#626665]">
              Flagged pings are hidden from student feed until moderation action is taken
            </span>
          </div>
          <button
            onClick={() => setHidePending(!hidePending)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${hidePending ? "bg-[#f49b31]" : "bg-[#e5e5e5]"}`}
            aria-label="Toggle hide pending"
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${hidePending ? "translate-x-6" : "translate-x-0"}`}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="pb-2">
          <h3 className="font-poppins font-semibold text-[16px] text-black">
            Wave rules
          </h3>
          <p className="font-poppins text-[12px] text-black mt-1">
            Control how and when waves can be raised
          </p>
        </div>

        <div className="flex items-center justify-between p-5 border border-[#7D7D7D] rounded-[10px] hover:border-[#f49b31] transition-colors">
          <div className="flex flex-col gap-0.5">
            <span className="font-poppins font-medium text-[14px] text-black">
              Minimum surges on a ping before a wave can be unlocked
            </span>
            <span className="font-poppins text-[12px] text-[#626665]">
              Number of community responses that unlock wave features
            </span>
          </div>
          <div className="relative">
            <select
              value={minSurges}
              onChange={(e) => setMinSurges(e.target.value)}
              className="appearance-none bg-white border border-[#ffd7a8] rounded-[10px] px-4 py-2 pr-10 font-poppins text-[14px] font-medium text-black outline-none focus:border-[#f49b31] cursor-pointer"
            >
              <option value="5">5 minimums</option>
              <option value="10">10 minimums</option>
              <option value="20">20 minimums</option>
              <option value="50">50 minimums</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#f49b31]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
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

export default RulesSettings;
