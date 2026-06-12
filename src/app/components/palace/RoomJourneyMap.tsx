import {useEffect, useMemo, useRef, useState} from "react";
import {motion, useReducedMotion} from "motion/react";
import {Check, Lock, MapPin, Sparkles} from "lucide-react";
import {toast} from "sonner";
import type {Room as StateRoom} from "../../hooks/useProgressState";
import {isDue, srsStatus} from "../../utils/srs";

/** XP awarded for finishing a room (mirrors `completeRoom`'s `addXP(50)`). */
const ROOM_XP = 50;

type NodeStatus = "completed" | "current" | "available" | "locked";

interface RoomJourneyMapProps {
    rooms: StateRoom[];
    /** Open a room (matches the list's tap behavior). */
    onOpenRoom: (roomTitle: string) => void;
}

interface Point {
    x: number;
    y: number;
}

function statusOf(room: StateRoom, index: number, currentIndex: number): NodeStatus {
    if (room.isCompleted || room.progress >= 100) return "completed";
    if (!room.isUnlocked) return "locked";
    if (index === currentIndex) return "current";
    return "available";
}

/** A smooth vertical S-curve through every node center. */
function smoothPath(points: Point[]): string {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const cur = points[i];
        const midY = (prev.y + cur.y) / 2;
        d += ` C ${prev.x} ${midY}, ${cur.x} ${midY}, ${cur.x} ${cur.y}`;
    }
    return d;
}

export function RoomJourneyMap({rooms, onOpenRoom}: RoomJourneyMapProps) {
    const reduce = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    // Measure the track width so connector geometry is pixel-exact and the
    // path never distorts. Recompute on resize / rotation.
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const measure = () => setWidth(el.clientWidth);
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const currentIndex = useMemo(() => {
        const idx = rooms.findIndex(
            (r) => r.isUnlocked && !r.isCompleted && r.progress < 100,
        );
        return idx === -1 ? Math.max(0, rooms.length - 1) : idx;
    }, [rooms]);

    const completedCount = rooms.filter(
        (r) => r.isCompleted || r.progress >= 100,
    ).length;

    // Geometry. Node centers ride a sine wave for a flowing route; everything
    // derives from the measured width so the SVG and the buttons agree.
    const nodeR = 30;
    const rowH = 108;
    const topPad = 44;
    const bottomPad = 76;
    const amp = Math.min(Math.max(width * 0.24, 36), 92);
    const totalHeight = topPad + (rooms.length - 1) * rowH + nodeR + bottomPad;

    const points: Point[] = useMemo(() => {
        if (width === 0) return [];
        return rooms.map((_, i) => ({
            x: width / 2 + amp * Math.sin((i * Math.PI) / 2),
            y: topPad + i * rowH + nodeR,
        }));
    }, [rooms, width, amp]);

    const trackPath = smoothPath(points);
    const donePath = smoothPath(points.slice(0, currentIndex + 1));

    return (
        <div className="space-y-4">
            <div className="px-1">
                <h2 className="text-section-header text-[#091A7A]">Your journey</h2>
                <p className="text-[12px] font-medium text-[#3D8FEF]">
                    {completedCount} of {rooms.length}{" "}
                    {rooms.length === 1 ? "room" : "rooms"} complete
                </p>
            </div>

            <div
                ref={containerRef}
                className="relative w-full"
                style={{height: totalHeight}}
            >
                {/* Connector route, behind the nodes. */}
                <svg
                    className="absolute inset-0 pointer-events-none"
                    width={width}
                    height={totalHeight}
                    aria-hidden="true"
                >
                    <defs>
                        <linearGradient id="journey-done" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#091A7A"/>
                            <stop offset="100%" stopColor="#4F8EFF"/>
                        </linearGradient>
                    </defs>
                    {trackPath && (
                        <path
                            d={trackPath}
                            fill="none"
                            stroke="#ADC8FF"
                            strokeOpacity={0.55}
                            strokeWidth={5}
                            strokeLinecap="round"
                            strokeDasharray="2 14"
                        />
                    )}
                    {currentIndex > 0 && donePath && (
                        <path
                            d={donePath}
                            fill="none"
                            stroke="url(#journey-done)"
                            strokeWidth={5}
                            strokeLinecap="round"
                        />
                    )}
                </svg>

                {points.length > 0 &&
                    rooms.map((room, i) => {
                        const status = statusOf(room, i, currentIndex);
                        const p = points[i];
                        const loci = room.loci ?? [];
                        const dueCount = loci.filter((l) => isDue(l.srs)).length;
                        const knownCount = loci.filter(
                            (l) => srsStatus(l.srs) === "known",
                        ).length;
                        const locked = status === "locked";

                        const meta =
                            loci.length === 0
                                ? "No cards yet"
                                : status === "completed"
                                    ? `${knownCount}/${loci.length} mastered`
                                    : dueCount > 0
                                        ? `${dueCount} due now`
                                        : `${loci.length} ${loci.length === 1 ? "card" : "cards"}`;

                        return (
                            <div key={room.id}>
                                {/* Node */}
                                <motion.button
                                    initial={reduce ? false : {opacity: 0, scale: 0.6}}
                                    animate={{opacity: 1, scale: 1}}
                                    transition={{
                                        delay: reduce ? 0 : i * 0.05,
                                        ease: [0.16, 1, 0.3, 1],
                                        duration: 0.35,
                                    }}
                                    whileTap={{scale: 0.9}}
                                    onClick={() =>
                                        locked
                                            ? toast("Finish the room before this to unlock it.")
                                            : onOpenRoom(room.title)
                                    }
                                    aria-label={`${room.title}, ${
                                        status === "completed"
                                            ? "completed"
                                            : status === "current"
                                                ? "current room"
                                                : status === "locked"
                                                    ? "locked"
                                                    : "available"
                                    }`}
                                    aria-disabled={locked}
                                    className="absolute flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                                    style={{
                                        left: p.x - nodeR,
                                        top: p.y - nodeR,
                                        width: nodeR * 2,
                                        height: nodeR * 2,
                                    }}
                                >
                                    <NodeBody status={status} order={i + 1} reduce={!!reduce}/>
                                </motion.button>

                                {/* "You are here" marker above the current node. */}
                                {status === "current" && (
                                    <motion.div
                                        initial={reduce ? false : {opacity: 0, y: 4}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{delay: 0.25}}
                                        className="absolute -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-[#091A7A] px-2.5 py-1 text-[11px] font-semibold text-white shadow-[0_6px_16px_rgba(9,26,122,0.25)]"
                                        style={{left: p.x, top: p.y - nodeR - 26}}
                                    >
                                        {loci.length > 0 ? "Continue" : "Start here"}
                                    </motion.div>
                                )}

                                {/* Label + reward under the node. */}
                                <div
                                    className="absolute -translate-x-1/2 w-[150px] text-center"
                                    style={{left: p.x, top: p.y + nodeR + 8}}
                                >
                                    <p
                                        className={`text-[13px] font-bold leading-tight line-clamp-1 ${
                                            locked ? "text-[#091A7A]/40" : "text-[#091A7A]"
                                        }`}
                                    >
                                        {room.title}
                                    </p>
                                    <div className="mt-1 flex items-center justify-center gap-1.5">
                                        <span
                                            className={`text-[11px] font-medium ${
                                                locked ? "text-[#091A7A]/35" : "text-[#091A7A]/60"
                                            }`}
                                        >
                                            {meta}
                                        </span>
                                        {status === "completed" ? (
                                            <span className="inline-flex items-center gap-0.5 rounded-full bg-[#FFF6DC] px-1.5 py-0.5 text-[10px] font-semibold text-[#A9791A]">
                                                <Sparkles size={9} className="fill-[#FFC71E] text-[#FFC71E]"/>
                                                Earned
                                            </span>
                                        ) : !locked ? (
                                            <span className="rounded-full bg-[#EAF4FF] px-1.5 py-0.5 text-[10px] font-semibold text-[#3D8FEF]">
                                                +{ROOM_XP} XP
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

function NodeBody({
                      status,
                      order,
                      reduce,
                  }: {
    status: NodeStatus;
    order: number;
    reduce: boolean;
}) {
    if (status === "completed") {
        return (
            <span className="flex h-full w-full items-center justify-center rounded-full bg-[#091A7A] shadow-[0_8px_20px_rgba(9,26,122,0.30)] ring-2 ring-[#FFC71E]/45">
                <Check size={26} strokeWidth={3} className="text-white"/>
            </span>
        );
    }
    if (status === "current") {
        return (
            <span className="relative flex h-full w-full items-center justify-center">
                {!reduce && (
                    <motion.span
                        className="absolute inset-0 rounded-full bg-[#4F8EFF]/30"
                        animate={{scale: [1, 1.45], opacity: [0.5, 0]}}
                        transition={{duration: 1.8, repeat: Infinity, ease: "easeOut"}}
                    />
                )}
                <span className="relative flex h-full w-full items-center justify-center rounded-full bg-white ring-[3px] ring-[#091A7A] shadow-[0_8px_20px_rgba(9,26,122,0.22)]">
                    <MapPin size={24} strokeWidth={2.4} className="text-[#091A7A]"/>
                </span>
            </span>
        );
    }
    if (status === "locked") {
        return (
            <span className="flex h-full w-full items-center justify-center rounded-full bg-[#091A7A]/[0.06] border border-[#091A7A]/10">
                <Lock size={20} className="text-[#091A7A]/35"/>
            </span>
        );
    }
    // available
    return (
        <span className="flex h-full w-full items-center justify-center rounded-full bg-white border-2 border-[#ADC8FF] shadow-[0_6px_16px_rgba(9,26,122,0.10)]">
            <span className="text-[17px] font-bold text-[#091A7A]">{order}</span>
        </span>
    );
}
