import { FiInfo } from "react-icons/fi";
import { adminService } from "../../api";
import { useState } from "react";
import { Link } from "react-router-dom";

interface PostActionMenuProps {
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
  entityType: 'ping' | 'wave';
  entityId: number | string;
  onUpdate?: () => void;
}

const PostActionMenu = ({
  setOpenMenu,
  entityType,
  entityId,
  onUpdate
}: PostActionMenuProps) => {
  // Debug: log if entityId is missing
  if (!entityId) {
    console.error('PostActionMenu: entityId is missing!', { entityType, entityId });
  }

  const idString = String(entityId);
  const [loading, setLoading] = useState(false);


  const handleWaveStatusUpdate = async (
    status: 'POSTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'
  ) => {
    if (entityType !== 'wave') return;

    try {
      setLoading(true);
      await adminService.updateWaveStatus(Number(entityId), { status });

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
        {entityType === 'ping' && (
          <Link
            to={`/admin/feed/details/${idString}`}
            onClick={() => setOpenMenu(false)}
            className="w-full rounded border-b border-gray-300 flex items-center gap-2 px-4 py-3 mb-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            <FiInfo />
            More Details
          </Link>
        )}

        {entityType === 'ping' && (
          <>

          </>
        )}

        {entityType === 'wave' && (
          <>
            <button
              onClick={() => handleWaveStatusUpdate('POSTED')}
              disabled={loading}
              className="w-full rounded px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
            >
              Posted
            </button>

            <button
              onClick={() => handleWaveStatusUpdate('UNDER_REVIEW')}
              disabled={loading}
              className="w-full rounded px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
            >
              Under Review
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
