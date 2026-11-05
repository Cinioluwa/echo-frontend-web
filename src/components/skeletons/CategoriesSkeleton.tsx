import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CategoriesSkeleton = () => {
  return (
    <SkeletonTheme
      baseColor="#f5f5f4"
      highlightColor="#ffffff"
      duration={1.2}
    >
      <div className="p-2">
        
        {/* Header */}
        <div className="my-2.5 pl-2.5">
          <Skeleton width={90} height={16} />
        </div>

        {/* All Categories */}
        <div className="flex justify-between items-center mb-px py-2.5 px-[15px] w-full rounded-lg">
          <Skeleton width={110} height={14} />
          <Skeleton width={26} height={26} circle />
        </div>

        {/* Category list */}
        <div>
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-center px-[15px] py-[13px] w-full rounded-lg"
              >
                <div className="flex gap-[13px] items-center">
                  <Skeleton width={18} height={18} />
                  <Skeleton width={90 + i * 5} height={13} />
                </div>

                <Skeleton width={26} height={26} circle />
              </div>
            ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default CategoriesSkeleton;