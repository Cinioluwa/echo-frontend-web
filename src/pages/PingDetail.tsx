/**
 * PingDetail
 * Figma ref: 4139:10022 (mobile), 3643:8353 (desktop layout)
 * Phase: 3
 *
 * Full detail view for a Ping. Displays:
 * - Back button
 * - ProposeWaveBar
 * - Ping content card (author, category, title, description, stats)
 * - Wave cards list with rank/status badges
 * - MarkAsResolvedBar (ping author or admin only, when waves exist)
 * - CommentsPanel inline on mobile (desktop version lives in Layout right-aside)
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAuthStore, useSurgeStore, usePingsStore } from "../stores";
import {
  pingService,
  waveService,
  categoryService,
  publicService,
} from "../api/services";
import ProposeWaveBar from "../components/ProposeWaveBar";
import CommentsPanel from "../components/CommentsPanel";
import WaveCard from "../components/WaveCard";
import PingCard from "../components/PingCard";
import { getSocket } from "../api/socket";
import type { Ping, Wave, CategoryData } from "../api/types";
import { FaPlus } from "react-icons/fa6";
import { Tooltip } from "../components/Tooltip";
import PingDetailSkeleton from "../components/skeletons/PingDetailSkeleton";
import WaveCardSkeleton from "../components/skeletons/WaveCardSkeleton";

// ─── PingDetail Page ─────────────────────────────────────────────────────────

const PingDetail = () => {
  const { pingId } = useParams<{ pingId: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const toggleSurge = useSurgeStore((state) => state.toggleSurge);
  const updatePingStore = usePingsStore((state) => state.updatePing);
  const pingFromStore = usePingsStore((state) =>
    pingId ? state.pingsById[String(pingId)] : null,
  );
  const hasSurged = useSurgeStore((state) =>
    state.hasSurged("ping", pingId ?? ""),
  );
  const isToggling = useSurgeStore(
    (state) => state.isToggling[`ping-${pingId}`] || false,
  );

  const [ping, setPing] = useState<Ping | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [waves, setWaves] = useState<Wave[]>([]);
  const [wavesPage, setWavesPage] = useState(1);
  const [categories, setCategories] = useState<Record<number, CategoryData>>(
    {},
  );
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [weeklyTop3Ids, setWeeklyTop3Ids] = useState<number[]>([]);

  // Update page title with the ping title when ping is loaded
  usePageTitle(ping?.title);

  useEffect(() => {
    if (!pingId) return;
    setIsLoading(true);
    pingService
      .getPingById(pingId)
      .then((data) => {
        console.log("🔍 Ping fetched:", data);
        console.log("📂 Category:", data.category);
        console.log("🌊 Waves:", data.waves);
        setPing(data);
        setWaves(data.waves ?? []);
        if (data.hasSurged) {
          useSurgeStore.getState().addSurge("ping", pingId);
        }
      })
      .catch(() => setError("Failed to load ping"))
      .finally(() => setIsLoading(false));
  }, [pingId]);

  // Fetch categories for category name lookup
  useEffect(() => {
    categoryService.getAll().then((cats) => {
      const catMap = cats.reduce(
        (acc, cat) => {
          acc[cat.id] = cat;
          return acc;
        },
        {} as Record<number, CategoryData>,
      );
      setCategories(catMap);
    });
    // Fetch top 3 pings for badge calculation
    publicService
      .getSoundboard({ sort: "trending", top: 3 })
      .then((res) => {
        setWeeklyTop3Ids(res.data.map((ping) => ping.id));
      })
      .catch((err) => {
        console.error("Failed to fetch top 3 pings:", err);
      });
  }, []);

  const loadMoreWaves = async () => {
    if (!pingId) return;
    const nextPage = wavesPage + 1;
    const res = await waveService.getWavesForPing(pingId, {
      page: nextPage,
      limit: 10,
    });
    console.log("🌊 More waves loaded:", res.data);
    console.log("📍 First wave author:", res.data[0]?.author);
    setWaves((prev) => [...prev, ...res.data]);
    setWavesPage(nextPage);
  };

  // ── WebSocket event wiring (Phase 11) ───────────────────────────────────────
  useEffect(() => {
    if (!pingId) return;

    const socket = getSocket();
    if (!socket) return;

    // Subscribe to ping room
    socket.emit("join:ping", { pingId: Number(pingId) });

    // Listen for surge updates on this ping
    socket.on("ping:surgeUpdate", ({ pingId: id, surgeCount }) => {
      setPing((prev) =>
        prev && prev.id === Number(id) ? { ...prev, surgeCount } : prev,
      );
    });

    // Listen for surge updates on waves
    socket.on("wave:surgeUpdate", ({ waveId, surgeCount }) => {
      setWaves((prev) =>
        prev.map((wave) =>
          wave.id === Number(waveId) ? { ...wave, surgeCount } : wave,
        ),
      );
    });

    return () => {
      socket.off("ping:surgeUpdate");
      socket.off("wave:surgeUpdate");
      socket.emit("leave:ping", { pingId: Number(pingId) });
    };
  }, [pingId]);

  const handleDeleteWave = async (waveId: number) => {
    try {
      await waveService.deleteWave(String(waveId));
      setWaves((prev) => prev.filter((w) => w.id !== waveId));
    } catch (err) {
      console.error("Failed to delete wave:", err);
    }
  };

  const handleDeletePing = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await pingService.deletePing(String(pingId));
      usePingsStore.getState().removePing(String(pingId));
      navigate("/feed");
    } catch (err) {
      console.error("Failed to delete ping:", err);
    }
  };

  // if (isLoading) return <PingDetailSkeleton />;
  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

  const displayPing = pingFromStore || ping;
  if (!displayPing) return null;

  const isOwner =
    currentUser?.id ===
    (typeof displayPing.author === "object"
      ? displayPing.author?.id
      : undefined);

  const surgeCount = displayPing.surgeCount || displayPing._count?.surges || 0;
  const commentCount = displayPing._count?.comments || 0;

  const handleSurge = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isToggling) return;
    try {
      await toggleSurge("ping", String(displayPing?.id));
      // Refetch ping from backend for consistency
      if (displayPing?.id) {
        const latest = await pingService.getPingById(String(displayPing.id));
        updatePingStore(String(displayPing.id), {
          surgeCount: latest.surgeCount,
          hasSurged: latest.hasSurged,
        });
      }
    } catch (err) {
      console.error("Surge failed:", err);
    }
  };

  const { setShowPingFormModal } = useOutletContext<{
    showPingFormModal: boolean;
    setShowPingFormModal: (value: boolean) => void;
  }>();

  return (
    <div className="flex flex-col gap-[15px] pb-[30px] relative z-0">
      {/* ── Back button ───────────────────────────── */}
      <div className="items-center justify-between hidden lg:flex">
        <button
          onClick={() => navigate("/feed")}
          className="flex items-center gap-2 bg-[#fefefe] rounded-[18px] px-5 py-[5px] font-['Poppins',sans-serif] font-medium text-[15px] text-black hover:bg-[#FFC37B] transition-colors cursor-pointer"
        >
          ← Go back to feed
        </button>

        <Tooltip content="Make a problem known." position="left" delay={0.2}>
          <button
            onClick={() => setShowPingFormModal(true)}
            className="flex items-center gap-2 bg-[#F49B31] hover:bg-[#d88429] transition-colors rounded-[18px] px-5 py-[5px] cursor-pointer"
          >
            <FaPlus className="w-3 h-3 text-white" />
            <span className="font-['Poppins',sans-serif] font-medium text-[15px] text-white">
              Create a Ping
            </span>
          </button>
        </Tooltip>
      </div>

      {/* ── Ping Card ─────────────────────────────── */}

      {isLoading && <PingDetailSkeleton />}

      {!isLoading && (
        <PingCard
          ping={displayPing}
          isLoading={isLoading}
          hasSurged={hasSurged}
          isToggling={isToggling}
          surgeCount={surgeCount}
          commentCount={commentCount}
          weeklyTop3Ids={weeklyTop3Ids}
          categories={categories}
          isOwner={isOwner}
          onSurge={handleSurge}
          onCommentClick={() => setShowCommentsModal(true)}
          onDelete={handleDeletePing}
        />
      )}

      {/* ── ProposeWaveBar ────────────────────────── */}
      <ProposeWaveBar
        pingId={pingId ?? String(displayPing.id)}
        pingTitle={displayPing.title}
        pingCreatedAt={displayPing.createdAt}
        onWaveProposed={() => {
          if (!pingId) return;
          waveService
            .getWavesForPing(pingId, { page: 1, limit: 10 })
            .then((res) => {
              setWaves(res.data);
              setWavesPage(1);
            })
            .catch((err) => console.error("Failed to refresh waves:", err));
        }}
      />

      <p className="pb-3 border-b mb-5 border-black/30 font-['Poppins',sans-serif] text-[14px] text-black">
        Waves
      </p>

      {/* ── Wave Cards ────────────────────────────── */}
      {isLoading && (
        <div className="space-y-7">
          <WaveCardSkeleton />
          <WaveCardSkeleton />
          <WaveCardSkeleton />
        </div>
      )}
      {waves.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {waves.map((wave) => (
            <WaveCard
              key={wave.id}
              wave={wave}
              isOwner={
                currentUser?.id ===
                (typeof wave.author === "object" ? wave.author?.id : undefined)
              }
              onDelete={handleDeleteWave}
              allWavesForPing={waves}
              pingId={Number(pingId)}
            />
          ))}
        </div>
      )}

      {/* ── Load more waves ───────────────────────── */}
      {displayPing._count && waves.length < displayPing._count.waves && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={loadMoreWaves}
            className="bg-[#fef5ea] border border-black rounded-[20px] px-5 py-2 font-['Poppins',sans-serif] font-medium  text-[12px] text-black cursor-pointer"
          >
            Load more waves
          </button>
        </div>
      )}

      {/* ── CommentsPanel Sheet (mobile only — desktop uses Layout right-aside) ── */}
      <AnimatePresence>
        {showCommentsModal && (
          <>
            {/* Overlay backdrop */}
            <motion.div
              className="fixed inset-0 lg:hidden z-40 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCommentsModal(false)}
              transition={{ duration: 0.2 }}
            />

            {/* Draggable sheet */}
            <motion.div
              className="fixed left-0 right-0 bottom-0 lg:hidden z-50 flex flex-col h-[65vh] bg-[#FFC37B] rounded-t-[30px]"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              drag="y"
              dragElastic={0.2}
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(_, info) => {
                // Close if dragged down more than 50px
                if (info.velocity.y > 20 || info.offset.y > 50) {
                  setShowCommentsModal(false);
                }
              }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-3 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1 bg-[#d0d0d0] rounded-full" />
              </div>

              {/* Comments content with scrollable list and fixed input */}
              <CommentsPanel
                pingId={pingId ?? String(displayPing.id)}
                isDrawer={true}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PingDetail;
