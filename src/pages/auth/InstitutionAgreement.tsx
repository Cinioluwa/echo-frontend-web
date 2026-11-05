import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { foundingAgreementService } from "../../api/services/foundingAgreement.service";
import { useAuthStore } from "../../stores";
import EchoLogo from "../../components/auth/EchoLogo";

interface AgreementDetails {
  organizationId: number;
  organizationName: string;
  isFoundingPartner: boolean;
  agreementVersion: string;
  effectiveDate: string;
  agreementHtml: string;
  agreementHash: string;
}

const normalizeHash = (hash: string) =>
  hash.trim().toLowerCase().replace(/^sha-?256[:\s=-]*/, "");

const hashAgreement = async (
  html: string,
  version: string,
  effectiveDate: string,
): Promise<string> => {
  if (!globalThis.crypto?.subtle) {
    throw new Error("This browser cannot verify the agreement integrity.");
  }

  const plainText = html
    .replace(/<h2>/g, "\n\n## ")
    .replace(/<\/h2>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const payload = `echo-founding-partner-agreement\nversion:${version}\neffective:${effectiveDate}\n${plainText}`;
  const bytes = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(payload),
  );
  return Array.from(new Uint8Array(bytes), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
};

const InstitutionAgreement = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const orgId = Number(searchParams.get("orgId"));
  const claimId = Number(searchParams.get("claimId"));
  const token = searchParams.get("token")?.trim() ?? "";
  const [agreement, setAgreement] = useState<AgreementDetails | null>(null);
  const [integrityVerified, setIntegrityVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadAgreement = async () => {
      if (!Number.isInteger(orgId) || orgId <= 0 || !Number.isInteger(claimId) || claimId <= 0 || !token) {
        setError("This agreement link is incomplete or invalid. Please use the signing link sent by Echo.");
        setLoading(false);
        return;
      }

      try {
        const details = await foundingAgreementService.getAgreement(orgId);
        const computedHash = await hashAgreement(
          details.agreementHtml,
          details.agreementVersion,
          details.effectiveDate,
        );
        if (normalizeHash(computedHash) !== normalizeHash(details.agreementHash)) {
          throw new Error("The agreement integrity check did not pass. Reload the page or contact Echo before signing.");
        }

        if (!cancelled) {
          setAgreement(details);
          setIntegrityVerified(true);
        }
      } catch (loadError) {
        console.error("Failed to load the founding agreement:", loadError);
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "We couldn't load the agreement. Please try again.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadAgreement();
    return () => {
      cancelled = true;
    };
  }, [orgId, claimId, token]);

  const loginUrl = useMemo(() => {
    const params = new URLSearchParams({
      returnTo: "/admin/soundboard",
    });
    return `/login?${params.toString()}`;
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!agreement || !integrityVerified || !authorized || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      await foundingAgreementService.acceptAgreement(orgId, {
        claimId,
        token,
        signerFullName: fullName.trim(),
        signerRoleTitle: roleTitle.trim(),
        agreementVersion: agreement.agreementVersion,
        agreementHash: agreement.agreementHash,
      });
      setAccepted(true);

      if (useAuthStore.getState().isAuthenticated) {
        try {
          await refreshUser();
          navigate("/admin/soundboard", { replace: true });
        } catch (refreshError) {
          console.error("Agreement accepted, but the admin session could not refresh:", refreshError);
          setError("Your agreement was accepted, but we couldn't refresh this session. Sign in again to open the Institution Admin workspace.");
        }
      }
    } catch (submitError) {
      console.error("Failed to accept founding agreement:", submitError);
      const responseMessage = (
        submitError as { response?: { data?: { error?: string; message?: string } } }
      )?.response?.data?.error || (
        submitError as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      setError(responseMessage || "We couldn't record your agreement. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FEF5EA] px-4 py-8 text-[#101010] sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-[880px]">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" aria-label="Echo home" className="inline-flex items-center gap-2">
            <EchoLogo size="sm" />
          </Link>
          {agreement && (
            <p className="font-['Inter',sans-serif] text-sm text-black/60">
              {agreement.organizationName}
            </p>
          )}
        </header>

        <p className="mb-3 font-['Inter',sans-serif] text-xs font-semibold uppercase tracking-[0.18em] text-[#E8911A]">
          Echo Founding Institution Pilot
        </p>
        <h1 className="font-['Poppins',sans-serif] text-3xl font-extrabold leading-tight tracking-[-0.03em] sm:text-5xl">
          Review the Founding Institution Agreement.
        </h1>
        <p className="mt-5 max-w-[60ch] font-['Inter',sans-serif] text-base leading-7 text-black/70">
          Read the agreement below. An authorized representative can sign at the end of the page.
        </p>

        {loading && (
          <p role="status" className="mt-8 rounded-2xl border border-black/10 bg-white p-5 font-['Inter',sans-serif]">
            Loading the agreement and verifying its integrity…
          </p>
        )}

        {!loading && error && !agreement && (
          <section className="mt-8 rounded-2xl border border-red-200 bg-white p-6" role="alert">
            <h2 className="font-['Poppins',sans-serif] text-xl font-bold">We couldn't open this signing link.</h2>
            <p className="mt-2 font-['Inter',sans-serif] leading-7 text-black/70">{error}</p>
            <Link to="/login" className="mt-5 inline-flex rounded-full bg-[#F49B31] px-6 py-3 font-semibold text-white">
              Go to login
            </Link>
          </section>
        )}

        {!loading && agreement && (
          <>
            {agreement.isFoundingPartner ? (
              <section className="mt-8 rounded-2xl border border-black/10 bg-white p-6" role="status">
                <h2 className="font-['Poppins',sans-serif] text-2xl font-bold">Agreement already accepted</h2>
                <p className="mt-2 font-['Inter',sans-serif] leading-7 text-black/70">
                  {agreement.organizationName} is already a Founding Partner.
                </p>
                <Link to={loginUrl} className="mt-5 inline-flex rounded-full bg-[#F49B31] px-6 py-3 font-semibold text-white">
                  Continue to login
                </Link>
              </section>
            ) : accepted ? (
              <section className="mt-8 rounded-2xl border border-black/10 bg-white p-6 sm:p-8" role="status" aria-live="polite">
                <p className="font-['Inter',sans-serif] text-sm font-semibold uppercase tracking-wide text-[#E8911A]">Founding Partner</p>
                <h2 className="mt-2 font-['Poppins',sans-serif] text-2xl font-bold sm:text-3xl">Agreement accepted.</h2>
                <p className="mt-3 font-['Inter',sans-serif] leading-7 text-black/70">
                  {agreement.organizationName} is now activated. Sign in with your institutional account to open the Institution Admin workspace.
                </p>
                {error && <p role="alert" className="mt-4 rounded-xl border border-[#D1C0A9] bg-[#FEF5EA] p-3 font-['Inter',sans-serif] text-sm text-black/75">{error}</p>}
                <Link to={loginUrl} className="mt-6 inline-flex rounded-full bg-[#F49B31] px-7 py-3.5 font-semibold text-white transition hover:bg-[#E8911A]">
                  Continue to the admin workspace
                </Link>
              </section>
            ) : (
              <>
                <div className="mt-8 grid gap-3 rounded-2xl border border-black/10 bg-white p-5 sm:grid-cols-[150px_1fr]">
                  <span className="font-['Inter',sans-serif] text-sm text-black/55">Institution</span>
                  <span className="font-['Inter',sans-serif] font-medium">{agreement.organizationName}</span>
                  <span className="font-['Inter',sans-serif] text-sm text-black/55">Agreement version</span>
                  <span className="font-['Inter',sans-serif] font-medium">{agreement.agreementVersion} · Effective {agreement.effectiveDate}</span>
                </div>

                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-['Inter',sans-serif] text-sm text-black/70">
                  <span aria-hidden="true" className="text-[#E8911A]">✓</span>
                  {integrityVerified ? "Document integrity verified · SHA-256 fingerprint protected" : "Verifying document integrity"}
                </p>

                <article
                  className="prose prose-neutral mt-6 max-w-none rounded-[20px] border border-black/10 bg-white p-6 font-['Inter',sans-serif] leading-7 sm:p-10"
                  aria-label="Founding Institution Agreement"
                  dangerouslySetInnerHTML={{ __html: agreement.agreementHtml }}
                />

                <section className="mt-10 border-t border-black/15 pt-8">
                  <h2 className="font-['Poppins',sans-serif] text-2xl font-bold">Accept on behalf of your institution</h2>
                  <p className="mt-2 font-['Inter',sans-serif] leading-7 text-black/70">
                    Enter the legal name and institutional title of the authorized signer.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <label className="block font-['Inter',sans-serif] text-sm font-medium">
                      Full legal name
                      <input
                        autoComplete="name"
                        maxLength={120}
                        required
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        className="mt-2 block w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-base outline-none focus:border-[#F49B31] focus:ring-2 focus:ring-[#FFC37B]"
                      />
                    </label>
                    <label className="block font-['Inter',sans-serif] text-sm font-medium">
                      Official institutional title
                      <input
                        autoComplete="organization-title"
                        maxLength={160}
                        required
                        value={roleTitle}
                        onChange={(event) => setRoleTitle(event.target.value)}
                        className="mt-2 block w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-base outline-none focus:border-[#F49B31] focus:ring-2 focus:ring-[#FFC37B]"
                      />
                    </label>

                    <label className="flex items-start gap-3 rounded-xl bg-white p-4 font-['Inter',sans-serif] leading-6">
                      <input
                        type="checkbox"
                        checked={authorized}
                        onChange={(event) => setAuthorized(event.target.checked)}
                        className="mt-1 h-4 w-4 accent-[#F49B31]"
                        required
                      />
                      <span>I confirm I am authorized to accept this pilot agreement on behalf of {agreement.organizationName}.</span>
                    </label>

                    {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 font-['Inter',sans-serif] text-sm text-red-800">{error}</p>}

                    <button
                      type="submit"
                      disabled={submitting || !integrityVerified}
                      className="inline-flex w-full items-center justify-center rounded-full bg-[#F49B31] px-7 py-4 font-['Inter',sans-serif] font-semibold text-white transition hover:bg-[#E8911A] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      {submitting ? "Recording your acceptance…" : "Sign & Activate Institution Space"}
                    </button>
                  </form>
                </section>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default InstitutionAgreement;
