import { FiInfo } from "react-icons/fi";
import { adminService } from "../../api";
import { useState } from "react";

interface PostActionMenuProps {
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
  entityType: 'ping' | 'wave';
  entityId: number;
  onUpdate?: () => void;
}

const PostActionMenu = ({
  setOpenMenu,
  entityType,
  entityId,
  onUpdate
}: PostActionMenuProps) => {
  const [loading, setLoading] = useState(false);

  const handleProgressUpdate = async (
    status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'WONT_FIX'
  ) => {
    if (entityType !== 'ping') return;

    try {
      setLoading(true);
      await adminService.updatePingProgress(entityId, { status });

      alert('Progress status updated successfully');
      setOpenMenu(false);

      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error('Failed to update progress:', error);
      alert(error.response?.data?.error || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleWaveStatusUpdate = async (
    status: 'POSTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'
  ) => {
    if (entityType !== 'wave') return;

    try {
      setLoading(true);
      await adminService.updateWaveStatus(entityId, { status });

      alert('Wave status updated successfully');
      setOpenMenu(false);

      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error('Failed to update wave status:', error);
      alert(error.response?.data?.error || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* Click-outside overlay */}
      <div
        onClick={() => setOpenMenu(false)}
        className="fixed inset-0 z-40 bg-black/40"
      />

      {/* Action menu */}
      <div className="absolute right-4 top-14 px-3 py-2 z-50 w-56 rounded-xl bg-white shadow-md border border-gray-100 overflow-hidden">
        <button
          onClick={() => setOpenMenu(false)}
          className="w-full rounded border-b border-gray-300 flex items-center gap-2 px-4 py-3 mb-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition"
        >
          <FiInfo />
          More Details
        </button>

        {entityType === 'ping' && (
          <>
            <button
              onClick={() => handleProgressUpdate('PENDING')}
              disabled={loading}
              className="w-full rounded px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
            >
              Under Review
            </button>

            <button
              onClick={() => handleProgressUpdate('IN_PROGRESS')}
              disabled={loading}
              className="w-full rounded px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
            >
              Implementing
            </button>

            <button
              onClick={() => handleProgressUpdate('WONT_FIX')}
              disabled={loading}
              className="w-full rounded px-4 py-3 text-left text-sm text-gray-700  hover:bg-gray-100 transition disabled:opacity-50"
            >
              Reject
            </button>

            <button
              onClick={() => handleProgressUpdate('RESOLVED')}
              disabled={loading}
              className="w-full rounded px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
            >
              Finished
            </button>
          </>
        )}

        {entityType === 'wave' && (
          <>
            <button
              onClick={() => handleWaveStatusUpdate('UNDER_REVIEW')}
              disabled={loading}
              className="w-full rounded px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
            >
              Mark Under Review
            </button>

            <button
              onClick={() => handleWaveStatusUpdate('APPROVED')}
              disabled={loading}
              className="w-full rounded px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
            >
              Approve
            </button>

            <button
              onClick={() => handleWaveStatusUpdate('REJECTED')}
              disabled={loading}
              className="w-full rounded px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
            >
              Reject
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default PostActionMenu;
