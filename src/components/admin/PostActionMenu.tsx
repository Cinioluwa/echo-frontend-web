import { FiInfo } from "react-icons/fi";
import { adminService } from "../../api";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "../shared/Toast";
import type { ToastItem } from "../shared/Toast";

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
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = (variant: ToastItem["variant"]) => {
    const id = `${Date.now()}`;
    setToasts((prev) => [...prev, { id, variant }]);
  };

  const menuPanelClass =
    "absolute right-2 top-14 px-2 py-2 z-50 w-[186px] md:w-56 rounded-xl bg-white shadow-md border border-gray-100 overflow-hidden";
  const menuItemClass =
    "w-full rounded-[6px] flex items-center gap-2.5 px-3 py-2 text-left text-[13px] leading-[1.2] text-gray-700 hover:bg-gray-100 transition disabled:opacity-50";
  const menuStatusItemClass =
    "w-full rounded-[6px] px-3 py-2 text-left text-[13px] leading-[1.2] text-gray-700 hover:bg-gray-100 transition disabled:opacity-50";


  const handleWaveStatusUpdate = async (
    status: 'POSTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'
  ) => {
    if (entityType !== 'wave') return;

    try {
      setLoading(true);
      await adminService.updateWaveStatus(Number(entityId), { status });

      pushToast('wave');
      
      // Delay closing menu slightly to let the user see the toast if we wanted, 
      // but parent might unmount us. If parent unmounts us, the toast will disappear.
      // So we just call onUpdate to trigger refetch.
      if (onUpdate) onUpdate();
      setOpenMenu(false);
    } catch (error) {
      console.error('Failed to update wave status:', error);
      pushToast('deleted'); // Using 'deleted' variant for error state visually
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
      <div className={menuPanelClass}>
        {entityType === 'ping' && (
          <Link
            to={`/admin/soundboard/${idString}`}
            onClick={() => setOpenMenu(false)}
            className={`${menuItemClass} border-b border-gray-200 rounded-none mb-1.5 pb-2.5`}
          >
            <FiInfo className="w-[17px] h-[17px]" />
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
              className={menuStatusItemClass}
            >
              Posted
            </button>

            <button
              onClick={() => handleWaveStatusUpdate('UNDER_REVIEW')}
              disabled={loading}
              className={menuStatusItemClass}
            >
              Under Review
            </button>

            <button
              onClick={() => handleWaveStatusUpdate('APPROVED')}
              disabled={loading}
              className={menuStatusItemClass}
            >
              Approve
            </button>

            <button
              onClick={() => handleWaveStatusUpdate('REJECTED')}
              disabled={loading}
              className={menuStatusItemClass}
            >
              Reject
            </button>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
        <ToastContainer
          toasts={toasts}
          onDismiss={(id: string) => setToasts((prev) => prev.filter((t) => t.id !== id))}
        />
      </div>
    </>
  );
};

export default PostActionMenu;
