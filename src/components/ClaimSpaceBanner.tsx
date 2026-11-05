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
      className="flex w-full min-w-0 flex-col gap-4 rounded-2xl border border-[var(--echo-border-e8d6bf)] bg-[var(--echo-surface)] px-4 py-4 shadow-sm sm:px-5"
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--echo-surface-soft)] text-[var(--echo-text-a85c08)]">
          <Building2 size={20} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="break-words font-['Poppins',sans-serif] text-sm font-semibold text-[var(--echo-text-101010)] [overflow-wrap:anywhere] sm:text-base">
            {status.organizationName} hasn&apos;t claimed its Echo space yet.
          </h2>
          <p className="mt-0.5 font-['Inter',sans-serif] text-xs leading-5 text-[var(--echo-text-primary)]/60 sm:text-sm">
            Are you a leader, or know someone who should claim it?
          </p>
        </div>
      </div>

      <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,_220px),_1fr))] gap-2">
        <button
          type="button"
          onClick={onClaimSpace}
          className="inline-flex min-h-10 min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[var(--echo-accent)] px-3 py-2.5 text-center font-['Inter',sans-serif] text-sm font-semibold leading-5 text-[var(--echo-text-on-accent)] transition hover:bg-[var(--echo-bg-e8911a)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--echo-border-a85c08)] sm:px-5"
        >
          Claim institution <ArrowUpRight size={15} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onRecommendLeader}
          className="inline-flex min-h-10 min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-black/15 bg-[var(--echo-surface)] px-3 py-2.5 text-center font-['Inter',sans-serif] text-sm font-semibold leading-5 text-[var(--echo-text-75420b)] transition hover:border-[var(--echo-border-f49b31)] hover:bg-[var(--echo-surface-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--echo-border-f49b31)] sm:px-4"
        >
          <UserRoundPlus size={15} aria-hidden="true" />
          Recommend someone
        </button>
      </div>
    </section>
  );
};

export default ClaimSpaceBanner;
