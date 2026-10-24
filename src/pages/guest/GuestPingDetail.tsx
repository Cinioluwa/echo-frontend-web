import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import GuestSurgeModal from "../../components/guest/GuestSurgeModal";
import BackButton from "../../components/shared/BackButton";
import CommentsPanel from "../../components/CommentsPanel";
import ProposeWaveBar from "../../components/ProposeWaveBar";
import AccountRequiredModal from "../../components/AccountRequiredModal";
import PingCard from "../../components/PingCard";
import { publicService, guestService } from "../../api/services";
import { useGuestStore } from "../../stores";
import type { Ping } from "../../api/types";
import { getAppOrigin } from "../../utils/shareUrl";

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
  commentCount: number;
}

const GuestPingDetail = () => {
  const { pingId } = useParams<{ pingId: string }>();
  const navigate = useNavigate();

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
    if (!pingId) return;
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
          commentCount: data.commentCount || 0,
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

  if (!pingId) return null;

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

  const cardPing: Ping = {
    id: pingData.id,
    title: pingData.title,
    content: pingData.description,
    category: { id: 0, name: pingData.category },
    status: "POSTED",
    progressStatus: "NONE",
    surgeCount: pingData.surgeCount,
    hasSurged,
    isOwner: false,
    createdAt: "1970-01-01T00:00:00.000Z",
    _count: {
      waves: pingData.waveCount,
      comments: pingData.commentCount,
      surges: pingData.surgeCount,
    },
    media:
      pingData.imageUrl && pingData.imageUrl !== pingData.orgLogoUrl
        ? [
            {
              id: 0,
              url: pingData.imageUrl,
              mimeType: "image/*",
            },
          ]
        : undefined,
  };

  return (
    <div className="min-h-screen bg-[#FAE9D4] font-['Poppins',sans-serif] flex flex-col">
      <header className="bg-[#FFC37B] border-b border-[#F49B31] px-4 md:px-8 h-[70px] flex items-center justify-between sticky top-0 z-20">
        <button
          type="button"
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/login")}
          aria-label="Echo home"
        >
          <img src={logo} className="brightness-0 contrast-200 h-[27px] w-[25px]" alt="" />
          <span className="font-bold text-xl md:text-2xl text-black leading-none">Echo</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="font-['Poppins',sans-serif] font-semibold text-[14px] text-black bg-[#FEF5EA] hover:bg-white px-4 h-11 border border-[#F49B31] rounded-[15px] transition-colors"
          >
            Sign In
          </button>
          <a
            href={`${getAppOrigin()}/signUp`}
            className="font-['Poppins',sans-serif] font-semibold text-[14px] text-white bg-[#F49B31] border border-[#F49B31] rounded-[15px] px-4 h-11 inline-flex items-center hover:bg-[#d88429] transition-colors"
          >
            Sign Up
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-[1322px] w-full mx-auto px-4 md:px-6 py-4 flex flex-col gap-[15px]">
        <BackButton
          onClick={() => navigate("/login")}
          label="Go to full app"
          className="self-start"
        />

        <div className="flex flex-col min-[1100px]:grid min-[1100px]:grid-cols-[minmax(0,1fr)_360px] gap-[15px] min-[1100px]:gap-[42px] min-h-0">
          <div className="min-w-0 flex flex-col gap-[15px]">
            <PingCard
              ping={cardPing}
              isLoading={false}
              hasSurged={hasSurged}
              isToggling={isSurging}
              surgeCount={pingData.surgeCount}
              commentCount={pingData.commentCount}
              weeklyTop3Ids={[]}
              categories={{}}
              isOwner={false}
              guestMode
              guestAuthorName={pingData.orgName}
              onSurge={(event) => {
                event.stopPropagation();
                void handleSurgeClick();
              }}
              onCommentClick={() =>
                document.getElementById("guest-comments")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              onDelete={() => {}}
            />
            <ProposeWaveBar
              pingId={pingId}
              pingTitle={pingData.title}
              readOnly={true}
              onAccountRequired={() => handleAccountRequired("wave")}
            />
          </div>

          <div id="guest-comments" className="min-w-0 scroll-mt-24">
            <CommentsPanel
              pingId={pingId}
              className="min-[1100px]:h-[calc(100vh-100px)] min-[1100px]:max-h-[800px]"
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
