import { useState } from "react";
import { FiMessageSquare, FiTrendingUp, FiZap } from "react-icons/fi";
import { pingService } from "../../api";

interface PostEngagementMenuProps {
  setEngagementMenu: React.Dispatch<React.SetStateAction<boolean>>;
  pingId: string;
  onSurge?: () => void;
  onWaveCreated?: () => void;
  onCommentCreated?: () => void;
}

interface ModalState {
  wave: boolean;
  comment: boolean;
}

const PostEngagementMenu = ({
  setEngagementMenu,
  pingId,
  onSurge,
  onWaveCreated,
  onCommentCreated,
}: PostEngagementMenuProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modals, setModals] = useState<ModalState>({
    wave: false,
    comment: false,
  });
  const menuPanelClass =
    "absolute right-0 p-2 bottom-14 z-50 w-[186px] md:w-56 rounded-xl bg-white shadow-md border border-gray-100 overflow-hidden";
  const menuItemClass =
    "w-full rounded-[6px] flex items-center gap-2.5 px-3 py-2 text-left text-[13px] leading-[1.2] text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed";

  const handleSurge = async () => {
    try {
      setLoading(true);
      setError(null);
      await pingService.surgePing(pingId);
      setEngagementMenu(false);
      onSurge?.();
    } catch (err: any) {
      console.error("Failed to surge ping:", err);
      setError(err.message || "Failed to add surge");
    } finally {
      setLoading(false);
    }
  };

  const handleProposeWave = () => {
    setModals((prev) => ({ ...prev, wave: true }));
  };

  const handleWaveSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const solution = formData.get("solution") as string;
    const isAnonymous = formData.get("isAnonymous") === "on";

    if (!solution.trim()) {
      setError("Wave solution cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await pingService.createWave(pingId, { solution, isAnonymous });
      setModals((prev) => ({ ...prev, wave: false }));
      setEngagementMenu(false);
      onWaveCreated?.();
    } catch (err: any) {
      console.error("Failed to create wave:", err);
      setError(err.message || "Failed to create wave");
    } finally {
      setLoading(false);
    }
  };

  const handleComment = () => {
    setModals((prev) => ({ ...prev, comment: true }));
  };

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get("content") as string;
    const isAnonymous = formData.get("isAnonymous") === "on";

    if (!content.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await pingService.createComment(pingId, { content, isAnonymous });
      setModals((prev) => ({ ...prev, comment: false }));
      setEngagementMenu(false);
      onCommentCreated?.();
    } catch (err: any) {
      console.error("Failed to create comment:", err);
      setError(err.message || "Failed to create comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Click-outside overlay */}
      <div
        onClick={() => setEngagementMenu(false)}
        className="fixed bg-black/40 inset-0 z-40"
      />

      {/* Menu */}
      <div className={menuPanelClass}>
        {error && (
          <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-[12px]">
            {error}
          </div>
        )}

        <button
          onClick={handleProposeWave}
          disabled={loading}
          className={menuItemClass}
        >
          <FiTrendingUp size={17} />
          Propose a Wave
        </button>

        <button
          onClick={handleSurge}
          disabled={loading}
          className={menuItemClass}
        >
          <FiZap size={17} />
          Surge
        </button>

        <button
          onClick={handleComment}
          disabled={loading}
          className={menuItemClass}
        >
          <FiMessageSquare size={17} />
          Comment
        </button>
      </div>

      {/* Wave Modal */}
      {modals.wave && (
        <>
          <div
            onClick={() => setModals((prev) => ({ ...prev, wave: false }))}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Propose a Wave (Solution)</h2>
              <form onSubmit={handleWaveSubmit}>
                <textarea
                  name="solution"
                  placeholder="Describe your solution..."
                  className="w-full border border-gray-300 rounded p-2 mb-4 min-h-[120px] focus:outline-none focus:border-orange-500"
                  required
                />
                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    name="isAnonymous"
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">Post anonymously</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModals((prev) => ({ ...prev, wave: false }))}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
                  >
                    {loading ? "Posting..." : "Post Wave"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Comment Modal */}
      {modals.comment && (
        <>
          <div
            onClick={() => setModals((prev) => ({ ...prev, comment: false }))}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add a Comment</h2>
              <form onSubmit={handleCommentSubmit}>
                <textarea
                  name="content"
                  placeholder="Write your comment..."
                  className="w-full border border-gray-300 rounded p-2 mb-4 min-h-[100px] focus:outline-none focus:border-orange-500"
                  required
                />
                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    name="isAnonymous"
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">Post anonymously</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModals((prev) => ({ ...prev, comment: false }))}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
                  >
                    {loading ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PostEngagementMenu;
