import { FiMessageSquare, FiTrendingUp, FiZap } from "react-icons/fi";

interface PostEngagementMenuProps {
  setEngagementMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostEngagementMenu = ({ setEngagementMenu }: PostEngagementMenuProps) => {
  return (
    <>
      {/* Click-outside overlay */}
      <div
        onClick={() => setEngagementMenu(false)}
        className="fixed bg-black/40 inset-0 z-40"
      />

      {/* Menu */}
      <div className="absolute right-0 p-3 bottom-14 z-50 w-56 rounded-xl bg-white shadow-md border border-gray-100 overflow-hidden">
        <button
          onClick={() => setEngagementMenu(false)}
          className="w-full rounded flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition"
        >
          <FiTrendingUp size={18} />
          Propose a Wave
        </button>

        <button
          onClick={() => setEngagementMenu(false)}
          className="w-full rounded flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition"
        >
          <FiZap size={18} />
          Surge
        </button>

        <button
          onClick={() => setEngagementMenu(false)}
          className="w-full rounded flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition"
        >
          <FiMessageSquare size={18} />
          Comment
        </button>
      </div>
    </>
  );
};

export default PostEngagementMenu;
