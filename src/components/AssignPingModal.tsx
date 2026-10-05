import { useEffect, useState } from "react";
import representativeService from "../api/services/representative.service";
import type {
  RepresentativeRosterMember,
} from "../api/services/representative.service";
import institutionAdminService from "../api/services/institutionAdmin.service";
import type { Ping } from "../api/types";

type AssignmentTarget = "representative" | "body";

interface AssignPingModalProps {
  ping: Ping | null;
  organizationId: number | null;
  onClose: () => void;
  onAssigned: (ping: Ping) => void;
}

const AssignPingModal = ({
  ping,
  organizationId,
  onClose,
  onAssigned,
}: AssignPingModalProps) => {
  const [target, setTarget] = useState<AssignmentTarget>("representative");
  const [selectedId, setSelectedId] = useState("");
  const [representatives, setRepresentatives] = useState<RepresentativeRosterMember[]>([]);
  const [bodies, setBodies] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ping) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    if (!organizationId) {
      setError("The current institution could not be confirmed.");
      setLoading(false);
      return;
    }

    Promise.all([
      representativeService.getRoster(),
      institutionAdminService.getContextOptions(organizationId),
    ])
      .then(([roster, context]) => {
        if (cancelled) return;
        setRepresentatives(roster);
        setBodies(context.bodies.map((body) => ({ id: body.id, name: body.name })));
      })
      .catch((requestError: unknown) => {
        console.error("Failed to load assignment targets:", requestError);
        if (!cancelled) {
          const responseData = (
            requestError as { response?: { data?: { error?: string; message?: string } } }
          )?.response?.data;
          setError(responseData?.error || responseData?.message || "We couldn't load available representatives and bodies.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ping, organizationId]);

  if (!ping) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedId) {
      setError(target === "representative" ? "Choose a representative." : "Choose a representative body.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await representativeService.assignPing(ping.id, {
        ...(target === "representative"
          ? { assignedToUserId: Number(selectedId) }
          : { assignedToBodyId: Number(selectedId) }),
      });
      onAssigned(result.ping);
      onClose();
    } catch (requestError) {
      console.error("Failed to assign Ping:", requestError);
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
          "We couldn't route this Ping. Please try again.";
      }
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const targets =
    target === "representative"
      ? representatives.map((person) => ({
          id: person.userId,
          label: `${person.firstName ?? ""} ${person.lastName ?? ""}`.trim() || person.email,
          detail: [person.email, person.body?.name, person.department?.name]
            .filter(Boolean)
            .join(" · "),
        }))
      : bodies.map((body) => ({ id: body.id, label: body.name, detail: "Representative body" }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assign-ping-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="w-full max-w-[520px] rounded-[20px] border border-black/10 bg-[#FEF5EA] p-5 shadow-xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-['Inter',sans-serif] text-xs font-semibold uppercase tracking-[0.16em] text-[#A85C08]">Representative inbox</p>
            <h2 id="assign-ping-title" className="mt-2 font-['Poppins',sans-serif] text-2xl font-bold">Assign this Ping</h2>
            <p className="mt-2 line-clamp-2 font-['Inter',sans-serif] text-sm leading-6 text-black/65">{ping.title}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close assignment" className="rounded-full p-2 text-black/55 hover:bg-white">✕</button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Assignment type">
          <button type="button" role="tab" aria-selected={target === "representative"} onClick={() => { setTarget("representative"); setSelectedId(""); setError(null); }} className={`rounded-full px-4 py-2 font-['Inter',sans-serif] text-sm font-semibold ${target === "representative" ? "bg-[#F49B31] text-white" : "border border-black/10 bg-white text-black/70"}`}>Representative</button>
          <button type="button" role="tab" aria-selected={target === "body"} onClick={() => { setTarget("body"); setSelectedId(""); setError(null); }} className={`rounded-full px-4 py-2 font-['Inter',sans-serif] text-sm font-semibold ${target === "body" ? "bg-[#F49B31] text-white" : "border border-black/10 bg-white text-black/70"}`}>Body</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <label className="block font-['Inter',sans-serif] text-sm font-medium">
            {target === "representative" ? "Assign to representative" : "Assign to body"}
            <select
              required
              disabled={loading || submitting}
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              className="mt-2 block w-full rounded-xl border border-black/15 bg-white px-4 py-3 outline-none focus:border-[#F49B31] focus:ring-2 focus:ring-[#FFC37B] disabled:opacity-60"
            >
              <option value="">{loading ? "Loading available targets…" : "Select a target"}</option>
              {targets.map((item) => (
                <option key={item.id} value={item.id}>{item.label}{item.detail ? ` — ${item.detail}` : ""}</option>
              ))}
            </select>
          </label>

          {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 font-['Inter',sans-serif] text-sm text-red-800">{error}</p>}
          {!loading && targets.length === 0 && !error && <p className="mt-3 font-['Inter',sans-serif] text-sm text-black/60">No active {target === "representative" ? "representatives" : "bodies"} are available.</p>}

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" disabled={loading || submitting || targets.length === 0} className="rounded-full bg-[#F49B31] px-6 py-3 font-['Inter',sans-serif] font-semibold text-white hover:bg-[#E8911A] disabled:cursor-wait disabled:opacity-55">
              {submitting ? "Assigning…" : "Assign Ping"}
            </button>
            <button type="button" onClick={onClose} className="rounded-full border border-black/15 bg-white px-6 py-3 font-['Inter',sans-serif] font-medium text-black/70 hover:bg-black/5">Cancel</button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AssignPingModal;
