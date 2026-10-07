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
import { useParams, useNavigate } from "react-router-dom";
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
import MarkAsResolvedBar from "../components/MarkAsResolvedBar";
import CommentsPanel from "../components/CommentsPanel";
import WaveCard from "../components/WaveCard";
import PingCard from "../components/PingCard";
import { getSocket } from "../api/socket";
import { getErrorMessage } from "../utils/networkUtils";
import type { Ping, Wave, CategoryData } from "../api/types";
import { ArrowLeft } from "lucide-react";
import PingDetailSkeleton from "../components/skeletons/PingDetailSkeleton";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

const mergeServerWaves = (serverWaves: Wave[], localWaves: Wave[]) => {
  const serverIds = new Set(serverWaves.map((wave) => wave.id));
  const localOnly = localWaves.filter((wave) => !serverIds.has(wave.id));
  return [...serverWaves, ...localOnly];
};

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

  const [itemToDelete, setItemToDelete] = useState<{ type: "Ping" | "Wave", id: number } | null>(null);
  const [isDeletingItem, setIsDeletingItem] = useState(false);

  const [ping, setPing] = useState<Ping | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [waves, setWaves] = useState<Wave[]>([]);
  const [wavesPage, setWavesPage] = useState(1);
  const [categories, setCategories] = useState<Record<number, CategoryData>>(
    {},
  );
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [weeklyTop3Ids, setWeeklyTop3Ids] = useState<number[]>([]);
  const [isResolving, setIsResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
        // Keep a lightweight fallback while full wave payload hydrates below.
        setWaves(data.waves ?? []);
        for (const wave of data.waves ?? []) {
          if (wave.hasSurged === undefined) continue;
          const waveId = String(wave.id);
          if (wave.hasSurged) {
            useSurgeStore.getState().addSurge("wave", waveId);
          } else {
            useSurgeStore.getState().removeSurge("wave", waveId);
          }
        }
        if (data.hasSurged) {
          useSurgeStore.getState().addSurge("ping", pingId);
        }
      })
      .catch((err) => {
        console.error("Failed to load ping (possibly wrong org). Falling back to guest view:", err);
        navigate(`/guest/feed/${pingId}`);
      })
      .finally(() => setIsLoading(false));
  }, [pingId, navigate]);

  useEffect(() => {
    if (!pingId) return;

    let isCancelled = false;
    waveService
      .getWavesForPing(pingId, { page: 1, limit: 10 })
      .then((res) => {
        if (!isCancelled) {
          setWaves((prev) => mergeServerWaves(res.data, prev));
          for (const wave of res.data) {
            if (wave.hasSurged === undefined) continue;
            const waveId = String(wave.id);
            if (wave.hasSurged) {
              useSurgeStore.getState().addSurge("wave", waveId);
            } else {
              useSurgeStore.getState().removeSurge("wave", waveId);
            }
          }
          setWavesPage(1);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch full wave payload:", err);
      });

    return () => {
      isCancelled = true;
    };
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
    for (const wave of res.data) {
      if (wave.hasSurged === undefined) continue;
      const waveId = String(wave.id);
      if (wave.hasSurged) {
        useSurgeStore.getState().addSurge("wave", waveId);
      } else {
        useSurgeStore.getState().removeSurge("wave", waveId);
      }
    }
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
      usePingsStore.getState().updatePing(String(id), { surgeCount });
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

  const handleDeleteWave = (waveId: number) => {
    setDeleteError(null);
    setItemToDelete({ type: "Wave", id: waveId });
  };

  const handleDeletePing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteError(null);
    setItemToDelete({ type: "Ping", id: Number(pingId) });
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const target = itemToDelete;

    setIsDeletingItem(true);
    setDeleteError(null);
    if (target.type === "Wave") {
      try {
        await waveService.deleteWave(String(target.id));
        setWaves((prev) => prev.filter((w) => w.id !== target.id));
        if (pingId) {
          const curPing = usePingsStore.getState().pingsById[pingId];
          if (curPing?._count) {
            usePingsStore.getState().updatePing(pingId, {
              _count: {
                ...curPing._count,
                waves: Math.max(0, curPing._count.waves - 1),
              },
            });
          }
        }
        setItemToDelete(null);
      } catch (err) {
        console.error("Failed to delete Wave:", err);
        setDeleteError(getErrorMessage(err));
      } finally {
        setIsDeletingItem(false);
      }
    } else if (target.type === "Ping") {
      const idToDelete = String(target.id || pingId);
      try {
        await pingService.deletePing(idToDelete);
        usePingsStore.getState().removePing(idToDelete);
        setItemToDelete(null);
        navigate("/feed");
      } catch (err) {
        console.error("Failed to delete Ping:", err);
        setDeleteError(getErrorMessage(err));
      } finally {
        setIsDeletingItem(false);
      }
    }
  };

  if (isLoading || error) return <PingDetailSkeleton />;

  const displayPing = pingFromStore || ping;
  if (!displayPing) return null;

  const isOwner = displayPing.isAnonymous
    ? (displayPing.isOwner ?? false)
    : (currentUser?.id === (typeof displayPing.author === "object" ? displayPing.author?.id : undefined));

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

  // Mark this ping as resolved (mobile only — the desktop version renders
  // MarkAsResolvedBar inside the Layout right aside).
  const handleResolvePing = async () => {
    if (isResolving || !displayPing) return;
    setIsResolving(true);
    setResolveError(null);
    const previousPing = displayPing;
    setPing((prev) =>
      prev
        ? {
            ...prev,
            resolvedAt: new Date().toISOString(),
            progressStatus: "RESOLVED" as const,
          }
        : prev,
    );
    try {
      const resolvedPing = await pingService.markAsResolved(String(displayPing.id));
      setPing(resolvedPing);
      updatePingStore(String(displayPing.id), resolvedPing);
    } catch (err) {
      setPing(previousPing);
      setResolveError(getErrorMessage(err));
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="flex flex-col gap-[15px] pb-[30px] relative z-0">
      {/* ── Back button ───────────────────────────── */}
      {/* Same button on mobile and desktop, scaled down on small screens.
          The "Create Ping" action now lives in the mobile drawer / desktop sidebar. */}
      <div className="flex items-center">
        <button
          onClick={() => navigate("/feed")}
          className="flex items-center gap-1.5 md:gap-2.5 bg-[#fefefe] rounded-full px-3 md:px-5 py-1.5 md:py-2 font-['Poppins',sans-serif] font-semibold text-[13px] md:text-[15px] text-black hover:bg-[#FFC37B] transition-colors cursor-pointer shadow-xs border border-[#f0f0f0]"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-black stroke-[2.5]" />
          <span>Go back to feed</span>
        </button>
      </div>

      {/* ── Ping Card ─────────────────────────────── */}

      <PingCard
        ping={displayPing}
        isLoading={false}
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

      {/* ── ProposeWaveBar ────────────────────────── */}
      <ProposeWaveBar
        pingId={pingId ?? String(displayPing.id)}
        pingTitle={displayPing.title}
        pingCreatedAt={displayPing.createdAt}
        onWaveProposed={(createdWave) => {
          // Show new wave instantly, then hydrate from server without dropping optimistic data.
          setWaves((prev) => [createdWave, ...prev.filter((wave) => wave.id !== createdWave.id)]);
          setWavesPage(1);

          if (!pingId) return;
          waveService
            .getWavesForPing(pingId, { page: 1, limit: 10 })
            .then((res) => {
              setWaves((prev) => mergeServerWaves(res.data, prev));
              setWavesPage(1);
            })
            .catch((err) => console.error("Failed to refresh waves:", err));
        }}
      />

      {/* ── Mark as Resolved (mobile only) ───────────── */}
      {/* On desktop this lives in the Layout right aside next to the comments. */}
      {isOwner && !displayPing.resolvedAt && (
        <div className="min-[1100px]:hidden">
          {resolveError && (
            <p className="mb-2 rounded-[10px] border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {resolveError}
            </p>
          )}
          <MarkAsResolvedBar
            pingId={String(displayPing.id)}
            onResolved={handleResolvePing}
            isLoading={isResolving}
          />
        </div>
      )}

      {ping?.officialResponse && (
        <div className="bg-[#FFC37B] rounded-[15px] pt-2.5 sm:pt-2.5 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 px-2.5 sm:px-2.5">
            <img src="/assets/icon/official-response.svg" className="w-5 h-5" alt="Official Response Icon" />
            <h3 className="font-poppins font-semibold text-[14px] sm:text-[18px] text-black">
              Official Response
            </h3>
          </div>
          <div className="bg-white p-5 rounded-b-[15px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-poppins font-semibold text-[13px] text-[#f49b31]">
                {ping.officialResponse.author.firstName} {ping.officialResponse.author.lastName}
              </span>
              <span className="text-[#8b8e8d] text-[11px]">
                {new Date(ping.officialResponse.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="font-poppins text-[13px] text-[#212121]">{ping.officialResponse.content}</p>
          </div>
        </div>
      )}
      {/* ── Wave Header & Cards ───────────────────── */}
      {waves.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <h2 className="font-['Poppins',sans-serif] font-semibold text-[17px] md:text-[18px] text-black pt-1">
            Waves
          </h2>
          <div className="flex flex-col gap-2.5">
            {waves.map((wave) => {
            const waveIsOwner = wave.isAnonymous
              ? (wave.isOwner ?? false)
              : (currentUser?.id === (typeof wave.author === "object" ? wave.author?.id : undefined));
            return (
              <WaveCard
                key={wave.id}
                wave={wave}
                isOwner={waveIsOwner}
                onSurgeCountChange={(waveId, surgeCount) => {
                  setWaves((prev) =>
                    prev.map((item) =>
                      item.id === waveId ? { ...item, surgeCount } : item,
                    ),
                  );
                }}
                onDelete={handleDeleteWave}
                allWavesForPing={waves}
              />
            );
          })}
          </div>
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
              className="fixed inset-0 min-[1100px]:hidden z-40 bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCommentsModal(false)}
              transition={{ duration: 0.2 }}
            />

            {/* Draggable sheet */}
            <motion.div
              className="fixed left-0 right-0 bottom-0 min-[1100px]:hidden z-50 flex flex-col h-[65vh] bg-[#FFC37B] rounded-t-[30px]"
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
              <div className="flex justify-center pt-[10px] pb-2 shrink-0 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1 bg-white rounded-full" />
              </div>

              {/* Comments content with scrollable list and fixed input */}
              <CommentsPanel
                pingId={pingId ?? String(displayPing.id)}
                initialCount={commentCount}
                isDrawer={true}
                className="flex-1 min-h-0"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {itemToDelete && (
        <DeleteConfirmationModal
          itemType={itemToDelete.type}
          onConfirm={confirmDelete}
          onCancel={() => {
            setItemToDelete(null);
            setDeleteError(null);
          }}
          isLoading={isDeletingItem}
          errorMessage={deleteError}
        />
      )}
    </div>
  );
};

export default PingDetail;
