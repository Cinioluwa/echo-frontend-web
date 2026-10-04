import { useCallback, useEffect, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { useAuthStore } from "../../stores";
import type { Ping } from "../../api/types";
import representativeService from "../../api/services/representative.service";
import { adminService } from "../../api/services/admin.service";
import AdminLayout from "../../components/admin/AdminLayout";
import AssignPingModal from "../../components/AssignPingModal";

const RepresentativeAdminInbox = () => {
  const user = useAuthStore((state) => state.user);
  const permissions = user?.representativeProfile;
  const organizationId = user?.organizationId ?? null;
  const [pings, setPings] = useState<Ping[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingPingId, setSavingPingId] = useState<number | null>(null);
  const [respondingPingId, setRespondingPingId] = useState<number | null>(null);
  const [responseDraft, setResponseDraft] = useState("");
  const [assignmentPing, setAssignmentPing] = useState<Ping | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadPings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await representativeService.getSubmittedPings({ page: 1, limit: 50 });
      setPings(result.data);
    } catch (loadError) {
      console.error("Failed to load representative inbox:", loadError);
      const responseData = (
        loadError as { response?: { data?: { error?: string; message?: string } } }
      )?.response?.data;
      setError(responseData?.error || responseData?.message || "We couldn't load your representative inbox.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPings();
  }, [loadPings]);

  const runPingAction = async (
    ping: Ping,
    action: () => Promise<unknown>,
    message: string,
  ): Promise<boolean> => {
    setSavingPingId(ping.id);
    setError(null);
    setNotice(null);
    try {
      await action();
      setNotice(message);
      await loadPings();
      return true;
    } catch (actionError) {
      console.error("Representative action failed:", actionError);
      const responseData = (
        actionError as { response?: { data?: { error?: string; message?: string } } }
      )?.response?.data;
      setError(responseData?.error || responseData?.message || "We couldn't update this Ping.");
      return false;
    } finally {
      setSavingPingId(null);
    }
  };

  const handleResponse = (ping: Ping) => {
    const content = responseDraft.trim();
    if (!content) {
      setError("Write a response before submitting.");
      return;
    }
    void runPingAction(
      ping,
      () => representativeService.createOfficialResponse(ping.id, { content }),
      "Your official response was posted.",
    ).then((saved) => {
      if (saved) {
        setRespondingPingId(null);
        setResponseDraft("");
      }
    });
  };

  const handleExport = () => {
    const csvCell = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = [
      ["ID", "Title", "Category", "Status", "Surges", "Waves", "Comments", "Submitted"],
      ...pings.map((ping) => [
        ping.id,
        ping.title,
        ping.category?.name ?? "Uncategorized",
        ping.status,
        ping._count?.surges ?? ping.surgeCount ?? 0,
        ping._count?.waves ?? (ping.waves?.length ?? 0),
        ping._count?.comments ?? (ping.comments?.length ?? 0),
        new Date(ping.createdAt).toISOString(),
      ]),
    ];
    const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `echo-representative-inbox-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full min-w-0 bg-[#FEF5EA]">
      <AdminLayout />
      <main className="min-h-screen min-w-0 px-4 pb-12 pt-6 md:ml-[230px] md:px-8 md:pt-10">
        <div className="mx-auto max-w-[1100px]">
          <p className="font-['Inter',sans-serif] text-xs font-semibold uppercase tracking-[0.16em] text-[#A85C08]">
            Representative workspace
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-['Poppins',sans-serif] text-3xl font-bold tracking-[-0.02em] text-[#101010]">
                Ping inbox
              </h1>
              <p className="mt-2 max-w-[65ch] font-['Inter',sans-serif] leading-7 text-black/65">
                Review Pings within your assigned institution scope. Available actions follow the permissions set by your institutional administrator.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {permissions?.canExport && (
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={!pings.length}
                  className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-5 py-2.5 font-['Inter',sans-serif] text-sm font-semibold hover:bg-black/5 disabled:opacity-50"
                >
                  <Download size={16} aria-hidden="true" /> Export
                </button>
              )}
              <button
                type="button"
                onClick={() => void loadPings()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-5 py-2.5 font-['Inter',sans-serif] text-sm font-medium hover:bg-black/5 disabled:opacity-50"
              >
                <RefreshCw size={16} aria-hidden="true" /> Refresh
              </button>
            </div>
          </div>

          {error && <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-white p-4 font-['Inter',sans-serif] text-sm text-red-800">{error}</div>}
          {notice && <div role="status" className="mt-5 rounded-2xl border border-[#D1C0A9] bg-white p-4 font-['Inter',sans-serif] text-sm text-black/75">{notice}</div>}

          <section className="mt-6 rounded-[20px] border border-black/10 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-['Poppins',sans-serif] text-xl font-bold">Submitted for review</h2>
                <p className="mt-1 font-['Inter',sans-serif] text-sm text-black/60">{pings.length} Pings in your current inbox</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-medium text-black/60">
                {permissions?.canRespond && <span className="rounded-full bg-[#FEF5EA] px-3 py-1.5">Respond</span>}
                {permissions?.canAcknowledge && <span className="rounded-full bg-[#FEF5EA] px-3 py-1.5">Acknowledge</span>}
                {permissions?.canResolve && <span className="rounded-full bg-[#FEF5EA] px-3 py-1.5">Resolve</span>}
                {permissions?.canAssign && <span className="rounded-full bg-[#FEF5EA] px-3 py-1.5">Assign</span>}
              </div>
            </div>

            {loading ? (
              <p role="status" className="mt-6 rounded-2xl bg-[#FEF5EA] p-5 font-['Inter',sans-serif] text-sm text-black/60">Loading your inbox…</p>
            ) : pings.length === 0 ? (
              <p className="mt-6 rounded-2xl bg-[#FEF5EA] p-5 font-['Inter',sans-serif] text-sm leading-6 text-black/60">There are no submitted Pings in your assigned scope right now.</p>
            ) : (
              <div className="mt-5 space-y-4">
                {pings.map((ping) => (
                  <article key={ping.id} className="rounded-2xl border border-black/10 p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-['Inter',sans-serif] text-xs font-semibold uppercase tracking-wide text-[#A85C08]">
                          {ping.category?.name ?? "Uncategorized"} · {ping.status.replaceAll("_", " ")}
                        </p>
                        <h3 className="mt-2 break-words font-['Poppins',sans-serif] text-lg font-semibold">{ping.title}</h3>
                        <p className="mt-2 whitespace-pre-wrap break-words font-['Inter',sans-serif] text-sm leading-6 text-black/70">{ping.content}</p>
                        <p className="mt-3 font-['Inter',sans-serif] text-xs text-black/45">
                          Submitted {new Date(ping.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#FEF5EA] px-3 py-1.5 font-['Inter',sans-serif] text-xs font-semibold text-black/65">
                        {ping.progressStatus?.replaceAll("_", " ") ?? "Awaiting review"}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {permissions?.canRespond && !ping.officialResponse && (
                        <button
                          type="button"
                          onClick={() => { setRespondingPingId(respondingPingId === ping.id ? null : ping.id); setResponseDraft(""); setError(null); }}
                          className="rounded-full bg-[#F49B31] px-4 py-2.5 font-['Inter',sans-serif] text-sm font-semibold text-white hover:bg-[#E8911A]"
                        >
                          {respondingPingId === ping.id ? "Cancel response" : "Write official response"}
                        </button>
                      )}
                      {permissions?.canAcknowledge && !ping.acknowledgedAt && (
                        <button type="button" disabled={savingPingId === ping.id} onClick={() => void runPingAction(ping, () => adminService.acknowledgePing(ping.id), "Ping acknowledged.")} className="rounded-full border border-black/15 bg-white px-4 py-2.5 font-['Inter',sans-serif] text-sm font-semibold hover:bg-black/5 disabled:opacity-50">
                          Acknowledge
                        </button>
                      )}
                      {permissions?.canResolve && !ping.resolvedAt && (
                        <button type="button" disabled={savingPingId === ping.id} onClick={() => void runPingAction(ping, () => adminService.resolvePing(ping.id), "Ping marked resolved.")} className="rounded-full border border-black/15 bg-white px-4 py-2.5 font-['Inter',sans-serif] text-sm font-semibold hover:bg-black/5 disabled:opacity-50">
                          Resolve
                        </button>
                      )}
                      {permissions?.canAssign && (
                        <button type="button" onClick={() => setAssignmentPing(ping)} className="rounded-full border border-black/15 bg-white px-4 py-2.5 font-['Inter',sans-serif] text-sm font-semibold hover:bg-black/5">
                          Assign
                        </button>
                      )}
                    </div>

                    {respondingPingId === ping.id && (
                      <form className="mt-4 rounded-xl bg-[#FEF5EA] p-4" onSubmit={(event) => { event.preventDefault(); handleResponse(ping); }}>
                        <label htmlFor={`official-response-${ping.id}`} className="font-['Inter',sans-serif] text-sm font-semibold">Official response</label>
                        <textarea id={`official-response-${ping.id}`} value={responseDraft} onChange={(event) => setResponseDraft(event.target.value)} rows={4} maxLength={5000} required className="mt-2 block w-full resize-y rounded-xl border border-black/15 bg-white px-4 py-3 font-['Inter',sans-serif] text-sm outline-none focus:border-[#F49B31] focus:ring-2 focus:ring-[#FFC37B]" />
                        <button type="submit" disabled={savingPingId === ping.id} className="mt-3 rounded-full bg-[#F49B31] px-5 py-2.5 font-['Inter',sans-serif] text-sm font-semibold text-white hover:bg-[#E8911A] disabled:opacity-50">
                          {savingPingId === ping.id ? "Sending…" : "Post response"}
                        </button>
                      </form>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <AssignPingModal
        ping={assignmentPing}
        organizationId={organizationId}
        onClose={() => setAssignmentPing(null)}
        onAssigned={(updatedPing) => {
          setPings((current) => current.map((ping) => ping.id === updatedPing.id ? updatedPing : ping));
          setNotice("Ping assigned.");
        }}
      />
    </div>
  );
};

export default RepresentativeAdminInbox;
