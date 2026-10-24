import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import GuestSurgeModal from "../../components/guest/GuestSurgeModal";
import SurgeIcon from "../../components/shared/SurgeIcon";
import SurgeButton from "../../components/shared/SurgeButton";
import BackButton from "../../components/shared/BackButton";
import CommentsPanel from "../../components/CommentsPanel";
import ProposeWaveBar from "../../components/ProposeWaveBar";
import AccountRequiredModal from "../../components/AccountRequiredModal";
import { publicService, guestService } from "../../api/services";
import { useGuestStore } from "../../stores";

const logo = "/assets/images/Echo Logo_black.svg";

interface GuestPingData {
  id: number;
  title: string;
  description: string;
  category: string;
  orgName: string;
  orgLogoUrl?: string;
  imageUrl?: string;
  surgeCount: number;
  waveCount: number;
}

const GuestPingDetail = () => {
  const { pingId } = useParams<{ pingId: string }>();
  const navigate = useNavigate();

  if (!pingId) return null;

  const [pingData, setPingData] = useState<GuestPingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [isSurging, setIsSurging] = useState(false);
  const [hasSurged, setHasSurged] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountTrigger, setAccountTrigger] = useState<"comment" | "wave">("comment");

  const guestToken = useGuestStore((state) => state.guestToken);
  const isTokenValid = useGuestStore((state) => state.isTokenValid);

  useEffect(() => {
    setIsLoading(true);
    publicService
      .getShareMetadata("ping", Number(pingId))
      .then((data) => {
        setPingData({
          id: data.id,
          title: data.title,
          description: data.description,
          category: data.category || "Uncategorized",
          orgName: data.orgName || "Unknown Organization",
          orgLogoUrl: data.orgLogoUrl,
          imageUrl: data.imageUrl || undefined,
          surgeCount: data.surgeCount || 0,
          waveCount: data.waveCount || 0,
        });
      })
      .catch((err) => {
        setError("This ping is no longer available or could not be found.");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, [pingId]);

  const handleSurgeClick = async () => {
    if (hasSurged) return;

    if (guestToken && isTokenValid()) {
      setIsSurging(true);
      try {
        const result = await guestService.guestSurgePing(Number(pingId), guestToken);
        setPingData((prev) => prev ? { ...prev, surgeCount: result.surgeCount } : null);
        setHasSurged(true);
      } catch (err: any) {
        console.error("Failed to surge with existing token", err);
        if (err.response?.status === 401 || err.response?.status === 403 || err.response?.status === 409) {
          setShowModal(true);
        }
      } finally {
        setIsSurging(false);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleAccountRequired = (trigger: "comment" | "wave") => {
    setAccountTrigger(trigger);
    setShowAccountModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAE9D4] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#F49B31] w-12 h-12" />
        <p className="mt-4 text-[#626665] font-['Poppins',sans-serif]">Loading ping details...</p>
      </div>
    );
  }

  if (error || !pingData) {
    return (
      <div className="min-h-screen bg-[#FAE9D4] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[15px] shadow-sm text-center max-w-md w-full border border-[#F49B31]/40">
          <h2 className="font-['Poppins',sans-serif] font-semibold text-[24px] text-black mb-2">Not Found</h2>
          <p className="font-['Poppins',sans-serif] font-normal text-[14px] text-[#626665] mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="font-['Poppins',sans-serif] font-semibold text-[15px] text-white bg-[#F49B31] border border-[#F49B31] rounded-[15px] px-5 py-[13px] hover:bg-[#d88429] transition-colors w-full"
          >
            Go to App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAE9D4] font-['Poppins',sans-serif] flex flex-col">
      <header className="bg-white border-b border-[#F49B31]/40 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/login")}>
          <img src={logo} className="brightness-0 contrast-200 h-[24px] w-[22px]" alt="Echo logo" />
          <span className="font-bold text-xl md:text-2xl text-black leading-none">Echo</span>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="font-['Poppins',sans-serif] font-medium text-sm text-[#F49B31] hover:text-[#d88429] px-4 py-2 border border-[#F49B31] rounded-full hover:bg-orange-50 transition-colors"
        >
          Sign In
        </button>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 md:p-8 flex flex-col gap-[15px]">
        <BackButton
          onClick={() => navigate("/login")}
          label="Go to full app"
          className="self-start"
        />

        <div className="flex flex-col lg:flex-row gap-[15px] min-h-0">
          <div className="flex-1 min-w-0 flex flex-col gap-[15px]">
            <div className="bg-white rounded-[10px] border border-[#F49B31]/40 flex flex-col overflow-hidden min-w-0">
              {pingData.imageUrl && pingData.imageUrl !== pingData.orgLogoUrl && (
                <div className="relative w-full overflow-hidden border-b border-[#F49B31]/40 bg-black/90 flex items-center justify-center max-h-[500px]">
                  <img src={pingData.imageUrl} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover blur-2xl scale-120 opacity-60 pointer-events-none select-none" />
                  <img src={pingData.imageUrl} alt="Attachment" className="relative z-10 w-full h-auto max-h-[500px] object-contain" />
                </div>
              )}

              <div className="p-4 md:p-6 border-b border-[#F49B31]/40 flex items-center gap-3">
                {pingData.orgLogoUrl ? (
                  <img src={pingData.orgLogoUrl} alt={pingData.orgName} className="w-10 h-10 rounded-full object-cover border border-[#F49B31]/40" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#FEF5EA] flex items-center justify-center text-[#F49B31] font-bold text-lg">{pingData.orgName.charAt(0)}</div>
                )}
                <div className="min-w-0">
                  <p className="font-['Poppins',sans-serif] font-semibold text-[14px] text-black leading-tight truncate">{pingData.orgName}</p>
                  <p className="font-['Poppins',sans-serif] font-medium text-[12px] text-[#626665] truncate">{pingData.category}</p>
                </div>
              </div>

              <div className="p-4 md:p-6 pb-2">
                <h1 className="font-['Poppins',sans-serif] font-semibold text-xl md:text-2xl text-black mb-3 leading-snug">{pingData.title}</h1>
                <p className="font-['Poppins',sans-serif] font-normal text-[14px] text-[#454545] whitespace-pre-wrap leading-relaxed">{pingData.description}</p>
              </div>

              <div className="p-4 md:p-6 bg-[#FEF5EA] flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#F49B31]/40">
                <div className="flex gap-6 text-sm text-[#626665] w-full sm:w-auto">
                  <span className="flex items-center gap-1.5 font-medium">
                    <SurgeIcon width={14} height={18} fill="#F49B31" />
                    {pingData.surgeCount} {pingData.surgeCount === 1 ? "Surge" : "Surges"}
                  </span>
                  <span className="font-medium">{pingData.waveCount} {pingData.waveCount === 1 ? "Wave" : "Waves"}</span>
                </div>
                <SurgeButton
                  count={pingData.surgeCount}
                  surged={hasSurged}
                  onClick={handleSurgeClick}
                  disabled={isSurging || hasSurged}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm"
                />
              </div>
            </div>

            <ProposeWaveBar
              pingId={pingId}
              pingTitle={pingData.title}
              readOnly={true}
              onAccountRequired={() => handleAccountRequired("wave")}
            />
          </div>

          <div className="lg:w-[360px] shrink-0 min-w-0">
            <CommentsPanel
              pingId={pingId}
              className="bg-[#F49B31] rounded-[24px] md:rounded-[28px] h-auto"
              readOnly={true}
              onAccountRequired={() => handleAccountRequired("comment")}
            />
          </div>
        </div>
      </main>

      {showModal && (
        <GuestSurgeModal
          pingId={pingData.id}
          pingTitle={pingData.title}
          onClose={() => setShowModal(false)}
          onSuccess={(newCount) => {
            setPingData((prev) => prev ? { ...prev, surgeCount: newCount ?? (prev.surgeCount + 1) } : null);
            setHasSurged(true);
          }}
        />
      )}

      {showAccountModal && (
        <AccountRequiredModal
          isOpen={showAccountModal}
          onClose={() => setShowAccountModal(false)}
          trigger={accountTrigger}
        />
      )}
    </div>
  );
};

export default GuestPingDetail;
