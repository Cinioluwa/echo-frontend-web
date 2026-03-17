interface MenuItemProps {
  label: string;
  danger?: boolean;
}

const MenuItem = ({ label, danger }: MenuItemProps) => {
  return (
    <button
      className={`w-full rounded px-4 py-3 text-left text-sm ${danger ? "text-red-600 hover:bg-red-50" : "text-gray-700 hover:bg-gray-100"
        } transition`}
    >
      {label}
    </button>
  );
};

export const PostActionMenu = () => {
  const close = () => { };

  return (
    <>
      {/* Click outside overlay */}
      <div onClick={close} className="fixed inset-0 z-40" />

      <div className="absolute right-4 top-14 z-50 w-56 rounded-xl bg-white shadow-lg border border-gray-100">
        <MenuItem label="More Details" />
        <MenuItem label="Under Review" />
        <MenuItem label="Implementing" />
        <MenuItem label="Reject" danger />
        <MenuItem label="Finished" />
      </div>
    </>
  );
};
