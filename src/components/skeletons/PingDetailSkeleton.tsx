import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PingDetailSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#d6d3d1" highlightColor="#f1f5f9">
      <div className="rounded-xl bg-white shadow-sm px-5 py-4 flex flex-col gap-4 w-full">
        
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton width={40} height={40} circle />
            <div className="flex flex-col gap-1">
              <Skeleton width={120} height={12} />
              <Skeleton width={80} height={10} />
            </div>
          </div>

          <Skeleton width={70} height={24} borderRadius={20} />
        </div>

        {/* Category */}
        <Skeleton width={100} height={12} />

        {/* Title */}
        <Skeleton width="80%" height={18} />

        {/* Description */}
        <div className="flex flex-col gap-2">
          <Skeleton />
          <Skeleton />
          <Skeleton width="90%" />
        </div>

        {/* Bottom stats */}
        <div className="flex items-center justify-between">
          <Skeleton width={90} height={32} borderRadius={8} />

          <div className="flex items-center gap-4">
            <Skeleton width={25} />
            <Skeleton width={25} />
          </div>
        </div>

      </div>
    </SkeletonTheme>
  );
};

export default PingDetailSkeleton;