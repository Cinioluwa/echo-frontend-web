import { useState } from "react";
import { organizationService } from "../api/services";
import { useAuthStore } from "../stores";
import EchoLogo from "./auth/EchoLogo";

interface InviteLeaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: number | null;
  institutionName?: string;
}

const InviteLeaderModal = ({
  isOpen,
  onClose,
  organizationId,
  institutionName = "your institution",
}: InviteLeaderModalProps) => {
  const user = useAuthStore((state) => state.user);
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!organizationId || !user) {
      setError("We couldn't confirm your institution or account. Please sign in and try again.");
      return;
    }

    setSubmitting(true);
    try {
      await organizationService.nominateAdmin(organizationId, {
        proposedContactName: leaderName.trim(),
        proposedContactEmail: leaderEmail.trim(),
        ...(message.trim() ? { message: message.trim() } : {}),
      });
      setSubmitted(true);
    } catch (requestError) {
      console.error("Failed to submit campus leadership nomination:", requestError);
      const responseData = (
        requestError as {
          response?: {
            data?: {
              error?: string;
              message?: string;
              details?: Array<{ field?: string; message: string }> | string;
            };
          };
        }
      )?.response?.data;

      let errorMessage: string;
      if (Array.isArray(responseData?.details) && responseData.details.length > 0) {
        errorMessage = responseData.details.map((d) => d.message).join(", ");
      } else if (typeof responseData?.details === "string") {
        errorMessage = responseData.details;
      } else {
        errorMessage =
          responseData?.error ||
          responseData?.message ||
          "We couldn't send this recommendation. Please verify the information and try again.";
      }
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nominate-leader-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-[20px] border border-black/10 bg-[var(--echo-surface-soft)] p-5 shadow-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <EchoLogo size="sm" />
          <button type="button" onClick={onClose} aria-label="Close nomination" className="rounded-full p-2 text-[var(--echo-text-primary)]/55 hover:bg-[var(--echo-surface)]">✕</button>
        </div>

        {submitted ? (
          <div role="status" aria-live="polite">
            <p className="font-['Inter',sans-serif] text-xs font-semibold uppercase tracking-[0.16em] text-[var(--echo-text-e8911a)]">Campus leadership</p>
            <h2 id="nominate-leader-title" className="mt-2 font-['Poppins',sans-serif] text-2xl font-bold">Recommendation sent.</h2>
            <p className="mt-3 font-['Inter',sans-serif] leading-7 text-[var(--echo-text-primary)]/70">
              We emailed {leaderName} to let them know you recommended them to claim {institutionName}.
            </p>
            <button type="button" onClick={onClose} className="mt-6 rounded-full bg-[var(--echo-accent)] px-6 py-3 font-['Inter',sans-serif] font-semibold text-[var(--echo-text-on-accent)] hover:bg-[var(--echo-bg-e8911a)]">Done</button>
          </div>
        ) : (
          <>
            <p className="font-['Inter',sans-serif] text-xs font-semibold uppercase tracking-[0.16em] text-[var(--echo-text-e8911a)]">Campus leadership</p>
            <h2 id="nominate-leader-title" className="mt-2 font-['Poppins',sans-serif] text-2xl font-bold">Recommend a leader</h2>
            <p className="mt-3 font-['Inter',sans-serif] leading-7 text-[var(--echo-text-primary)]/70">
              We&apos;ll send them an email letting them know you think they should claim {institutionName}&apos;s Echo space.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <label className="block font-['Inter',sans-serif] text-sm font-medium">
                Leader's name
                <input required maxLength={120} autoComplete="name" value={leaderName} onChange={(event) => setLeaderName(event.target.value)} className="mt-2 w-full rounded-xl border border-black/15 bg-[var(--echo-surface)] px-4 py-3 outline-none focus:border-[var(--echo-border-f49b31)] focus:ring-2 focus:ring-[var(--echo-border-ffc37b)]" />
              </label>
              <label className="block font-['Inter',sans-serif] text-sm font-medium">
                Leader&apos;s email
                <input required type="email" maxLength={200} autoComplete="email" value={leaderEmail} onChange={(event) => setLeaderEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-black/15 bg-[var(--echo-surface)] px-4 py-3 outline-none focus:border-[var(--echo-border-f49b31)] focus:ring-2 focus:ring-[var(--echo-border-ffc37b)]" />
                <span className="mt-1 block text-xs font-normal text-[var(--echo-text-primary)]/50">Institutional or personal email address</span>
              </label>
              <label className="block font-['Inter',sans-serif] text-sm font-medium">
                Note (optional)
                <textarea maxLength={1000} rows={3} value={message} onChange={(event) => setMessage(event.target.value)} className="mt-2 w-full resize-y rounded-xl border border-black/15 bg-[var(--echo-surface)] px-4 py-3 outline-none focus:border-[var(--echo-border-f49b31)] focus:ring-2 focus:ring-[var(--echo-border-ffc37b)]" />
              </label>

              {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 font-['Inter',sans-serif] text-sm text-red-800">{error}</p>}
              <div className="flex flex-wrap gap-3 pt-2">
                <button type="submit" disabled={submitting} className="rounded-full bg-[var(--echo-accent)] px-6 py-3 font-['Inter',sans-serif] font-semibold text-[var(--echo-text-on-accent)] hover:bg-[var(--echo-bg-e8911a)] disabled:cursor-wait disabled:opacity-60">
                  {submitting ? "Sending…" : "Email recommendation"}
                </button>
                <button type="button" onClick={onClose} className="rounded-full border border-black/15 bg-[var(--echo-surface)] px-6 py-3 font-['Inter',sans-serif] font-medium text-[var(--echo-text-primary)]/70 hover:bg-black/5">Cancel</button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
};

export default InviteLeaderModal;
