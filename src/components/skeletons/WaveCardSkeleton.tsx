import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const WaveCardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e7e5e4" highlightColor="#f8fafc">
      <div className="bg-white rounded-[10px] px-[27.5px] py-[23px] flex flex-col gap-[17px] w-full min-w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          {/* Avatar + name */}
          <div className="flex items-center gap-2.5">
            <Skeleton width={36} height={36} circle />

            <div className="flex flex-col gap-1">
              <Skeleton width={110} height={12} />
              <Skeleton width={70} height={10} />
            </div>
          </div>

          {/* Badge */}
          <Skeleton width={90} height={22} borderRadius={20} />
        </div>

        {/* Body */}
        <div className="flex items-start justify-between gap-2.5">
          {/* Text */}
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton />
            <Skeleton />
            <Skeleton width="85%" />
          </div>

          {/* Surge (vertical) */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <Skeleton width={40} height={28} borderRadius={15} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default WaveCardSkeleton;
