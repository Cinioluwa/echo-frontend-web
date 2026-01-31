export const PostActionMenu = () => {
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
