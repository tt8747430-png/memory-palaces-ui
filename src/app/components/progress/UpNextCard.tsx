import {motion} from "motion/react";
import {ChevronRight} from "lucide-react";
import {type Palace} from "../../hooks/useProgressState";
import {isDue, srsStatus} from "../../utils/srs";
import {Chip} from "../ui/Chip";
import {easeOutQuart} from "../../utils/motion";

interface UpNextCardProps {
    palaces: Palace[];
    /** Open a room straight into its study session. */
    onOpenRoom: (palaceId: string, roomTitle: string) => void;
}

type Candidate = {
    palaceId: string;
    palaceName: string;
    palaceIcon: string;
    roomTitle: string;
    total: number;
    due: number;
    /** 0 = has due cards, 1 = in progress, 2 = not started. */
    bucket: 0 | 1 | 2;
};

/** Up to three rooms worth studying next, newest-need first. */
function pickRooms(palaces: Palace[]): Candidate[] {
    const candidates: Candidate[] = [];
    for (const palace of palaces) {
        for (const room of palace.rooms || []) {
            const loci = room.loci || [];
            if (loci.length === 0) continue; // nothing to study yet
            const due = loci.filter((l) => isDue(l.srs)).length;
            const known = loci.filter((l) => srsStatus(l.srs) === "known").length;
            const started = loci.some((l) => l.srs);
            // A fully-mastered room with nothing due isn't an actionable suggestion.
            if (due === 0 && known === loci.length) continue;
            const bucket: 0 | 1 | 2 = due > 0 ? 0 : started ? 1 : 2;
            candidates.push({
                palaceId: palace.id,
                palaceName: palace.name,
                palaceIcon: palace.icon,
                roomTitle: room.title,
                total: loci.length,
                due,
                bucket,
            });
        }
    }
    return candidates
        .sort((a, b) => (a.bucket - b.bucket) || (b.due - a.due) || (b.total - a.total))
        .slice(0, 3);
}

function statusChip(c: Candidate) {
    if (c.bucket === 0) return <Chip tone="amber">{c.due} due</Chip>;
    if (c.bucket === 1) return <Chip tone="info">In progress</Chip>;
    return <Chip tone="neutral">Not started</Chip>;
}

/**
 * "Up next" — the home's action engine: real rooms to study now, prioritized by
 * due cards, then in-progress, then untouched. Tapping a row drops straight into
 * that room's flashcards. Replaces the duplicated home calendar with something
 * that moves the next session forward.
 */
export function UpNextCard({palaces, onOpenRoom}: UpNextCardProps) {
    const rooms = pickRooms(palaces);
    if (rooms.length === 0) return null;

    return (
        <section aria-labelledby="up-next-heading">
            <h3 id="up-next-heading" className="text-section-header text-[#091A7A] mb-3 px-1">
                Up next
            </h3>
            <div className="rounded-3xl bg-white shadow-card border border-[#091A7A]/[0.05] overflow-hidden">
                {rooms.map((room, i) => (
                    <motion.button
                        key={`${room.palaceId}:${room.roomTitle}`}
                        initial={{opacity: 0, y: 8}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: i * 0.05, ease: easeOutQuart, duration: 0.3}}
                        whileTap={{scale: 0.985}}
                        onClick={() => onOpenRoom(room.palaceId, room.roomTitle)}
                        className={`w-full flex items-center gap-3.5 p-4 text-left transition-colors hover:bg-[#091A7A]/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#091A7A]/40 ${
                            i > 0 ? "border-t border-[#091A7A]/[0.06]" : ""
                        }`}
                    >
                        <div className="w-11 h-11 rounded-2xl bg-[#EAF4FF] flex items-center justify-center text-[22px] leading-none flex-shrink-0">
                            {room.palaceIcon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[15px] font-semibold text-[#091A7A] truncate">
                                {room.roomTitle}
                            </p>
                            <p className="text-[13px] font-medium text-[#091A7A]/55 truncate">
                                {room.palaceName} · {room.total} {room.total === 1 ? "card" : "cards"}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {statusChip(room)}
                            <ChevronRight className="w-5 h-5 text-[#091A7A]/30"/>
                        </div>
                    </motion.button>
                ))}
            </div>
        </section>
    );
}
