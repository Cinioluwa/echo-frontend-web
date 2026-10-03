import { useState } from "react";
import { useAuthStore } from "../stores";
import { organizationService } from "../api/services";

interface ClaimSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
  institutionName?: string;
  organizationId: number | null;
}

const ClaimSpaceModal = ({
  isOpen,
  onClose,
  onSubmitted,
  institutionName = "your institution",
  organizationId,
}: ClaimSpaceModalProps) => {
  const user = useAuthStore((state) => state.user);
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!organizationId || !user) {
      setError("We couldn't confirm your account or institution. Please sign in again and retry.");
      return;
    }

    setSubmitting(true);
    try {
      await organizationService.submitLeadershipClaim(organizationId, {
        role: role.trim(),
        ...(department.trim() ? { department: department.trim() } : {}),
      });
      setSubmitted(true);
      onSubmitted?.();
    } catch (requestError) {
      console.error("Failed to submit institution claim:", requestError);
      const responseError = (
        requestError as { response?: { status?: number; data?: { error?: string; message?: string } } }
      )?.response;
      setError(
        responseError?.data?.error ||
          responseError?.data?.message ||
          (responseError?.status === 409
            ? "A claim for this institution is already under review."
            : "We couldn't submit your claim. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="claim-space-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-[20px] border border-black/10 bg-[#FEF5EA] p-5 shadow-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-['Poppins',sans-serif] text-xl font-bold text-[#101010]">Echo</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close claim request"
            className="rounded-full p-2 text-black/55 hover:bg-white"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div role="status" aria-live="polite">
            <p className="font-['Inter',sans-serif] text-xs font-semibold uppercase tracking-[0.16em] text-[#E8911A]">
              Claim submitted
            </p>
            <h2 id="claim-space-title" className="mt-2 font-['Poppins',sans-serif] text-2xl font-bold">
              Thank you.
            </h2>
            <p className="mt-3 font-['Inter',sans-serif] leading-7 text-black/70">
              Echo's team will review your request for {institutionName}. We'll email you when there's an update. The institution remains in review until the agreement is signed.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-full bg-[#F49B31] px-6 py-3 font-['Inter',sans-serif] font-semibold text-white hover:bg-[#E8911A]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="font-['Inter',sans-serif] text-xs font-semibold uppercase tracking-[0.16em] text-[#E8911A]">
              Institution leadership
            </p>
            <h2 id="claim-space-title" className="mt-2 font-['Poppins',sans-serif] text-2xl font-bold">
              Request to lead {institutionName}
            </h2>
            <p className="mt-3 font-['Inter',sans-serif] leading-7 text-black/70">
              Your account and verified institutional email will be included with this request. Echo reviews each claim before inviting an authorized representative to sign the Founding Institution Agreement.
            </p>

            {user && (
              <div className="mt-5 rounded-2xl border border-black/10 bg-white p-4 font-['Inter',sans-serif] text-sm">
                <p className="font-medium">{user.firstName} {user.lastName}</p>
                <p className="mt-1 text-black/60">{user.email}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <label className="block font-['Inter',sans-serif] text-sm font-medium">
                Official title / position
                <input
                  required
                  maxLength={160}
                  autoComplete="organization-title"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  placeholder="Dean of Student Affairs"
                  className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:border-[#F49B31] focus:ring-2 focus:ring-[#FFC37B]"
                />
              </label>
              <label className="block font-['Inter',sans-serif] text-sm font-medium">
                Department (optional)
                <input
                  maxLength={160}
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                  placeholder="Student Affairs"
                  className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:border-[#F49B31] focus:ring-2 focus:ring-[#FFC37B]"
                />
              </label>

              {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 font-['Inter',sans-serif] text-sm text-red-800">{error}</p>}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-[#F49B31] px-6 py-3 font-['Inter',sans-serif] font-semibold text-white hover:bg-[#E8911A] disabled:cursor-wait disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Submit for review"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-black/15 bg-white px-6 py-3 font-['Inter',sans-serif] font-medium text-black/70 hover:bg-black/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
};

export default ClaimSpaceModal;
