import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

const SuperAdminMaintenance: React.FC = () => {
  const [dryRun, setDryRun] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      {/* Alert Banner */}
      <div className="bg-[#fcd34d] rounded-2xl p-4 flex items-center gap-3">
        <AlertTriangle className="text-yellow-900" size={24} />
        <span className="font-bold text-yellow-900">
          DRY RUN MODE ENABLED - DESTRUCTIVE ACTIONS ARE LOCKED PREVIEWING CHANGES ONLY
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-700">Dry Run Mode</span>
          <button 
            className={`w-12 h-6 rounded-full p-1 transition-colors ${dryRun ? 'bg-[#f49b31]' : 'bg-gray-300'}`}
            onClick={() => setDryRun(!dryRun)}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${dryRun ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          Preview Cleanup
        </button>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Tool 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[183px]">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tool 1: Clean Up Stale Organization Requests</h3>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Older than X days" 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#f49b31] transition-colors"
              />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button className="px-6 py-2 bg-[#f49b31] text-white font-semibold rounded-lg hover:bg-[#e08920] transition-colors">
              Clean
            </button>
          </div>
        </div>

        {/* Tool 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[183px]">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tool 2: Purge Expired Verification Token</h3>
          </div>
          <div className="flex justify-start mt-6">
            <button className="px-6 py-2 bg-[#f49b31] text-white font-semibold rounded-lg hover:bg-[#e08920] transition-colors">
              Purge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminMaintenance;
