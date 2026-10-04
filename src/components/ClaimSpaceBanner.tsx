import { ArrowUpRight, Building2, UserRoundPlus } from "lucide-react";
import type { InstitutionStatus } from "../api/services/organization.service";

interface ClaimSpaceBannerProps {
  status: InstitutionStatus;
  onClaimSpace: () => void;
  onRecommendLeader: () => void;
}
const ClaimSpaceBanner = ({
  status,
  onClaimSpace,
  onRecommendLeader,
}: ClaimSpaceBannerProps) => {
  if (
    status.claimStatus === "FOUNDING_PARTNER" ||
    status.claimStatus === "VERIFIED" ||
    status.hasLeader
  ) {
    return null;
  }

  return (
    <section
      aria-label={`${status.organizationName} institution claim`}
      className="flex w-full min-w-0 flex-col gap-4 rounded-2xl border border-[#E8D6BF] bg-white px-4 py-4 shadow-sm sm:px-5"
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEF5EA] text-[#A85C08]">
          <Building2 size={20} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="break-words font-['Poppins',sans-serif] text-sm font-semibold text-[#101010] [overflow-wrap:anywhere] sm:text-base">
            {status.organizationName} hasn&apos;t claimed its Echo space yet.
          </h2>
          <p className="mt-0.5 font-['Inter',sans-serif] text-xs leading-5 text-black/60 sm:text-sm">
            Are you a leader, or know someone who should claim it?
          </p>
        </div>
      </div>

      <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,_220px),_1fr))] gap-2">
        <button
          type="button"
          onClick={onClaimSpace}
          className="inline-flex min-h-10 min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#F49B31] px-3 py-2.5 text-center font-['Inter',sans-serif] text-sm font-semibold leading-5 text-white transition hover:bg-[#E8911A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A85C08] sm:px-5"
        >
          Claim institution <ArrowUpRight size={15} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onRecommendLeader}
          className="inline-flex min-h-10 min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-black/15 bg-white px-3 py-2.5 text-center font-['Inter',sans-serif] text-sm font-semibold leading-5 text-[#75420B] transition hover:border-[#F49B31] hover:bg-[#FEF5EA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F49B31] sm:px-4"
        >
          <UserRoundPlus size={15} aria-hidden="true" />
          Recommend someone
        </button>
      </div>
    </section>
  );
};

export default ClaimSpaceBanner;
