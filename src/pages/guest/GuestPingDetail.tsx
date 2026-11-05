import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Sparkles, ChevronRight, Lock } from "lucide-react";
import GuestSurgeModal from "../../components/guest/GuestSurgeModal";
import BackButton from "../../components/shared/BackButton";
import ProposeWaveBar from "../../components/ProposeWaveBar";
import AccountRequiredModal, { type AccountTrigger } from "../../components/AccountRequiredModal";
import PingCard from "../../components/PingCard";
import SurgeIcon from "../../components/shared/SurgeIcon";
import formatTimeAgo from "../../utils/formatTimeAgo";
import { publicService, guestService } from "../../api/services";
import type { PublicCommentSummary, PublicCommunityPickWave } from "../../api/services/public.service";
import { useGuestStore, useAuthStore } from "../../stores";
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
  topComments?: PublicCommentSummary[];
  communityPickWave?: PublicCommunityPickWave | null;
  hasMoreComments?: boolean;
  hasMoreWaves?: boolean;
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
  const [accountTrigger, setAccountTrigger] = useState<AccountTrigger>("comment");

  const guestToken = useGuestStore((state) => state.guestToken);
  const isTokenValid = useGuestStore((state) => state.isTokenValid);
  const { isAuthenticated, user } = useAuthStore();

  const returnToFeedPath = pingId ? `/feed/${pingId}` : "/feed";
  const loginUrl = `/login?returnTo=${encodeURIComponent(returnToFeedPath)}`;
  const signUpUrl = `${getAppOrigin()}/signUp?returnTo=${encodeURIComponent(returnToFeedPath)}`;

  useEffect(() => {
    const hasToken = Boolean(localStorage.getItem("authToken"));
    if (isAuthenticated && user && hasToken && pingId) {
      navigate(`/feed/${pingId}`, { replace: true });
    }
  }, [isAuthenticated, user, pingId, navigate]);

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
          topComments: data.topComments || [],
          communityPickWave: data.communityPickWave || null,
          hasMoreComments: Boolean(data.hasMoreComments),
          hasMoreWaves: Boolean(data.hasMoreWaves),
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

  const handleAccountRequired = (trigger: AccountTrigger) => {
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
            onClick={() => navigate(loginUrl)}
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
          onClick={() => navigate(loginUrl)}
          aria-label="Echo home"
        >
          <img src={logo} className="brightness-0 contrast-200 h-[27px] w-[25px]" alt="" />
          <span className="font-bold text-xl md:text-2xl text-black leading-none">Echo</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(loginUrl)}
            className="font-['Poppins',sans-serif] font-semibold text-[14px] text-black bg-[#FEF5EA] hover:bg-white px-4 h-11 border border-[#F49B31] rounded-[15px] transition-colors"
          >
            Sign In
          </button>
          <a
            href={signUpUrl}
            className="font-['Poppins',sans-serif] font-semibold text-[14px] text-white bg-[#F49B31] border border-[#F49B31] rounded-[15px] px-4 h-11 inline-flex items-center hover:bg-[#d88429] transition-colors"
          >
            Sign Up
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-[1322px] w-full mx-auto px-4 md:px-6 py-4 flex flex-col gap-[15px]">
        <BackButton
          onClick={() => navigate(loginUrl)}
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

            {/* Community Pick Wave */}
            {pingData.communityPickWave && (
              <div className="bg-white rounded-[15px] md:rounded-[20px] p-5 md:p-6 border border-[#FFC37B] shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    {pingData.communityPickWave.author.profilePicture ? (
                      <img
                        src={pingData.communityPickWave.author.profilePicture}
                        alt={pingData.communityPickWave.author.displayName}
                        className="w-10 h-10 rounded-full object-cover border border-gray-100"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#FEF5EA] border border-[#F49B31] flex items-center justify-center font-bold text-[#F49B31] text-sm">
                        {pingData.communityPickWave.author.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-black text-sm md:text-base">
                          {pingData.communityPickWave.author.displayName}
                        </span>
                        {pingData.communityPickWave.isCommunityPick && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF5EA] text-[#F49B31] border border-[#FFC37B]">
                            <Sparkles className="w-3 h-3 text-[#F49B31]" />
                            Community Pick
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#626665]">
                        {formatTimeAgo(pingData.communityPickWave.createdAt)}
                        {pingData.communityPickWave.author.department && ` • ${pingData.communityPickWave.author.department}`}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-black text-[14px] md:text-[15px] whitespace-pre-wrap leading-relaxed">
                  {pingData.communityPickWave.solution}
                </p>

                {pingData.communityPickWave.media && pingData.communityPickWave.media.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    {pingData.communityPickWave.media.map((m, idx) => (
                      <img
                        key={idx}
                        src={m.url}
                        alt="Solution attachment"
                        className="w-full max-h-[300px] object-cover rounded-xl border border-gray-100"
                      />
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleAccountRequired("wave_surge")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold bg-[#FEF5EA] text-[#F49B31] border border-[#FFC37B] hover:bg-orange-100 transition-colors"
                    title="Sign in to surge this wave"
                  >
                    <SurgeIcon width={13} height={16} fill="#F49B31" />
                    <span>{pingData.communityPickWave.surgeCount} {pingData.communityPickWave.surgeCount === 1 ? 'Surge' : 'Surges'}</span>
                  </button>

                  {pingData.hasMoreWaves && (
                    <button
                      type="button"
                      onClick={() => handleAccountRequired("view_more_waves")}
                      className="text-xs md:text-sm font-semibold text-[#F49B31] hover:underline inline-flex items-center gap-1"
                    >
                      <span>View all {pingData.waveCount} solutions</span>
                      <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {pingData.hasMoreWaves && !pingData.communityPickWave && (
              <div className="bg-white rounded-[15px] p-5 text-center border border-[#FFC37B]/50 shadow-sm flex flex-col items-center gap-2">
                <p className="text-sm font-medium text-gray-700">
                  {pingData.waveCount} {pingData.waveCount === 1 ? "solution proposed" : "solutions proposed"}
                </p>
                <button
                  type="button"
                  onClick={() => handleAccountRequired("view_more_waves")}
                  className="text-sm font-semibold text-[#F49B31] hover:underline"
                >
                  Sign in to view all solutions
                </button>
              </div>
            )}
          </div>

          <div id="guest-comments" className="min-w-0 scroll-mt-24">
            <div className="bg-[#FFC37B] rounded-[24px] md:rounded-[28px] overflow-hidden flex flex-col">
              <h2 className="bg-[#F49B31] text-white px-[16px] py-[14px] text-lg font-semibold flex items-center justify-between">
                <span>Comments</span>
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[13px] font-semibold bg-white text-[#F49B31]">
                  {pingData.commentCount}
                </span>
              </h2>

              <div className="p-4 flex flex-col gap-3">
                {pingData.topComments && pingData.topComments.length > 0 ? (
                  <>
                    {pingData.topComments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-white rounded-[16px] p-3.5 shadow-xs border border-amber-200/60 flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            {comment.author.profilePicture ? (
                              <img
                                src={comment.author.profilePicture}
                                alt={comment.author.displayName}
                                className="w-7 h-7 rounded-full object-cover border border-gray-100"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-[#FEF5EA] border border-[#F49B31] flex items-center justify-center text-xs font-bold text-[#F49B31]">
                                {comment.author.displayName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="font-semibold text-xs md:text-sm text-gray-900">
                              {comment.author.displayName}
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-400">
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>

                        <p className="text-gray-800 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                          {comment.content}
                        </p>

                        <div className="flex items-center justify-between pt-1 text-[11px] text-gray-500">
                          <button
                            type="button"
                            onClick={() => handleAccountRequired("comment")}
                            className="inline-flex items-center gap-1 hover:text-[#F49B31] transition-colors"
                          >
                            <SurgeIcon width={10} height={12} fill="#9ca3af" />
                            <span>{comment.surgeCount}</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {pingData.hasMoreComments && (
                      <button
                        type="button"
                        onClick={() => handleAccountRequired("view_more_comments")}
                        className="w-full py-2.5 bg-white/90 hover:bg-white text-[#F49B31] font-semibold text-xs md:text-sm rounded-[14px] border border-[#F49B31] transition-colors flex items-center justify-center gap-1 shadow-xs"
                      >
                        <span>View all {pingData.commentCount} comments</span>
                        <ChevronRight size={14} />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="bg-white/80 rounded-[16px] p-6 text-center text-gray-500 text-xs md:text-sm">
                    No comments yet. Be the first to share your voice!
                  </div>
                )}
              </div>

              <div className="p-3 bg-[#F49B31]">
                <button
                  type="button"
                  onClick={() => handleAccountRequired("comment")}
                  className="w-full bg-white hover:bg-amber-50 text-left px-4 py-2.5 rounded-full text-xs md:text-sm text-gray-400 border border-amber-200 shadow-inner flex items-center justify-between cursor-pointer transition-colors"
                >
                  <span>Write a comment...</span>
                  <Lock size={14} className="text-[#F49B31]" />
                </button>
              </div>
            </div>
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
          returnTo={returnToFeedPath}
        />
      )}
    </div>
  );
};

export default GuestPingDetail;
