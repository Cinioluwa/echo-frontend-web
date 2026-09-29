const Top3Skeleton = () => {
  return (
    <div className="flex flex-col gap-3.5 w-full">
      {[1, 2, 3].map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-2 w-full rounded-[12px] px-2.5 py-2.5 min-h-[55px] bg-gray-100 animate-pulse"
        >
          {/* Avatar */}
          <div className="w-[30px] h-[30px] rounded-full bg-gray-300 shrink-0" />

          {/* Title */}
          <div className="flex-1 h-4 bg-gray-300 rounded min-w-0" />

          {/* Surge count */}
          <div className="flex items-center gap-[3px] shrink-0">
            <div className="w-2.5 h-[13px] bg-gray-300 rounded" />
            <div className="w-6 h-4 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Top3Skeleton;
