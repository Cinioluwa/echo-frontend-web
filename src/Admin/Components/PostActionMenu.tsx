import { FiInfo } from "react-icons/fi";
import { Link } from "react-router-dom";

interface PostActionMenuProps {
  openMenu?: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostActionMenu = ({ setOpenMenu }: PostActionMenuProps) => {
  return (
    <>
      <>
        {/* Click-outside overlay */}
        <div
          onClick={() => setOpenMenu(false)}
          className="fixed inset-0 z-40 bg-black/40"
        />

        {/* Action menu */}
        <div className="absolute right-4 top-14 px-3 py-2 z-50 w-56 rounded-xl bg-white shadow-md border border-gray-100 overflow-hidden">
          <Link
            to={"/admin/feed/details"}
            onClick={() => setOpenMenu(false)}
            className="w-full rounded border-b border-gray-300 flex items-center gap-2 px-4 py-3 mb-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            <FiInfo />
            More Details
          </Link>

          <button
            onClick={() => setOpenMenu(false)}
            className="w-full rounded px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Under Review
          </button>

          <button
            onClick={() => setOpenMenu(false)}
            className="w-full rounded px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Approve
          </button>

          <button
            onClick={() => setOpenMenu(false)}
            className="w-full rounded px-4 py-3 text-left text-sm text-gray-700  hover:bg-gray-100 transition"
          >
            Reject
          </button>

          <button
            onClick={() => setOpenMenu(false)}
            className="w-full rounded px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Resolved
          </button>
        </div>
      </>
    </>
  );
};

export default PostActionMenu;
