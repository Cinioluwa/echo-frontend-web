import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import GuestSurgeModal from "../../components/guest/GuestSurgeModal";
import SurgeIcon from "../../components/shared/SurgeIcon";
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
  
  const [pingData, setPingData] = useState<GuestPingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [isSurging, setIsSurging] = useState(false);
  const [hasSurged, setHasSurged] = useState(false);

  const guestToken = useGuestStore((state) => state.guestToken);
  const isTokenValid = useGuestStore((state) => state.isTokenValid);

  useEffect(() => {
    if (!pingId) return;
    
    setIsLoading(true);
    publicService.getShareMetadata("ping", Number(pingId))
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
        setPingData(prev => prev ? { ...prev, surgeCount: result.surgeCount } : null);
        setHasSurged(true);
      } catch (err: any) {
        console.error("Failed to surge with existing token", err);
        // Prompt for modal if token is invalid or if account exists (409)
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#F49B31] w-12 h-12" />
        <p className="mt-4 text-gray-500">Loading ping details...</p>
      </div>
    );
  }

  if (error || !pingData) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Found</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button 
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-[#F49B31] text-white rounded-xl font-medium hover:bg-[#d88429] transition-colors"
          >
            Go to App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-poppins flex flex-col">
      {/* Simplified Header */}
      <header className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/login")}>
          <img
            src={logo}
            className="brightness-0 contrast-200 h-[24px] w-[22px]"
            alt="Echo logo"
          />
          <span className="font-bold text-xl md:text-2xl text-black leading-none">
            Echo
          </span>
        </div>
        <button 
          onClick={() => navigate("/login")}
          className="text-sm font-medium text-[#F49B31] hover:text-[#d88429] px-4 py-2 border border-[#F49B31] rounded-full hover:bg-orange-50 transition-colors"
        >
          Sign In
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6">
        <button 
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 self-start"
        >
          <ArrowLeft size={16} />
          Go to full app
        </button>

        {/* Ping Card */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
          {/* Image Attachment (if any and different from org logo) */}
          {pingData.imageUrl && pingData.imageUrl !== pingData.orgLogoUrl && (
            <div className="relative w-full overflow-hidden border-b border-gray-100 bg-black/90 flex items-center justify-center max-h-[500px]">
              <img
                src={pingData.imageUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-2xl scale-120 opacity-60 pointer-events-none select-none"
              />
              <img 
                src={pingData.imageUrl} 
                alt="Attachment" 
                className="relative z-10 w-full h-auto max-h-[500px] object-contain"
              />
            </div>
          )}

          {/* Org Header */}
          <div className="p-4 md:p-6 border-b border-gray-50 flex items-center gap-3">
            {pingData.orgLogoUrl ? (
              <img src={pingData.orgLogoUrl} alt={pingData.orgName} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#F49B31] font-bold text-lg">
                {pingData.orgName.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900 leading-tight">{pingData.orgName}</p>
              <p className="text-xs text-gray-500">{pingData.category}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6 pb-2">
            <h1 className="text-xl md:text-2xl font-bold text-black mb-3 leading-snug">
              {pingData.title}
            </h1>
            <p className="text-[#454545] text-[15px] whitespace-pre-wrap leading-relaxed">
              {pingData.description}
            </p>
          </div>

          {/* Stats & Actions */}
          <div className="p-4 md:p-6 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-6 text-sm text-gray-500 w-full sm:w-auto">
              <span className="flex items-center gap-1.5 font-medium">
                <SurgeIcon width={14} height={18} fill="#F49B31" /> 
                {pingData.surgeCount} {pingData.surgeCount === 1 ? 'Surge' : 'Surges'}
              </span>
              <span className="font-medium">
                {pingData.waveCount} {pingData.waveCount === 1 ? 'Wave' : 'Waves'}
              </span>
            </div>

            <button
              onClick={handleSurgeClick}
              disabled={isSurging || hasSurged}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                hasSurged 
                  ? "bg-[#FEF5EA] text-[#F49B31] border border-[#FFC37B]" 
                  : "bg-[#F49B31] text-white hover:bg-[#d88429] shadow-sm"
              }`}
            >
              {isSurging ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <SurgeIcon width={14} height={18} fill={hasSurged ? "#F49B31" : "#FFFFFF"} />
              )}
              {hasSurged ? "Surged!" : "Surge as Guest"}
            </button>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-[#FFC37B]/20 to-[#F49B31]/10 rounded-[20px] p-6 text-center border border-[#FFC37B]/30">
          <h3 className="font-bold text-lg text-gray-900 mb-2">Want to add a solution?</h3>
          <p className="text-gray-600 text-sm mb-4">Join {pingData.orgName} on Echo to propose waves, add comments, and track the progress of this issue.</p>
          <button 
            onClick={() => navigate("/signUp")}
            className="px-6 py-2 bg-white border-2 border-[#F49B31] text-[#F49B31] font-bold rounded-full hover:bg-orange-50 transition-colors"
          >
            Create an Account
          </button>
        </div>
      </main>

      {showModal && (
        <GuestSurgeModal 
          pingId={pingData.id}
          pingTitle={pingData.title}
          onClose={() => setShowModal(false)}
          onSuccess={(newCount) => {
            setPingData(prev => prev ? { ...prev, surgeCount: newCount ?? (prev.surgeCount + 1) } : null);
            setHasSurged(true);
          }}
        />
      )}
    </div>
  );
};

export default GuestPingDetail;
