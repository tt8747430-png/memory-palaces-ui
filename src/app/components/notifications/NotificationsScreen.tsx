import {useMemo, useRef} from "react";
import {AnimatePresence, motion} from "motion/react";
import {useCollapsibleHeader} from "../../hooks/useCollapsibleHeader";
import {
    ArrowLeft,
    BellOff,
    CheckCheck,
    CheckCircle2,
    Crown,
    Flame,
    Info,
    MoreHorizontal,
    Star,
    Trash2,
    Trophy,
    Zap,
} from "lucide-react";
import type {LucideIcon} from "lucide-react";
import type {AppNotification, NotificationType} from "../../hooks/useProgressState";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface NotificationsScreenProps {
    notifications: AppNotification[];
    onBack: () => void;
    onMarkAllRead: () => void;
    onRemove: (id: string) => void;
    onClear: () => void;
}

const VISUALS: Record<
    NotificationType,
    {icon: LucideIcon; tint: string; fg: string}
> = {
    "level-up": {icon: Trophy, tint: "bg-[#FFF3CD]", fg: "text-[#B8860B]"},
    streak: {icon: Flame, tint: "bg-[#FFE6D5]", fg: "text-[#C2410C]"},
    "room-complete": {icon: CheckCircle2, tint: "bg-[#D1FAE5]", fg: "text-[#047857]"},
    "palace-complete": {icon: Crown, tint: "bg-[#EDE9FE]", fg: "text-[#6D28D9]"},
    "quiz-complete": {icon: Star, tint: "bg-[#EAF4FF]", fg: "text-[#1D4ED8]"},
    "xp-gain": {icon: Zap, tint: "bg-[#FEF3C7]", fg: "text-[#B45309]"},
    info: {icon: Info, tint: "bg-[#EAF4FF]", fg: "text-[#091A7A]"},
};

function relativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.round(diff / 60_000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.round(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    });
}

/** Bucket a timestamp into Today / Yesterday / Earlier. */
function bucketOf(iso: string): "Today" | "Yesterday" | "Earlier" {
    const d = new Date(iso);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    if (d >= startOfToday) return "Today";
    if (d >= startOfYesterday) return "Yesterday";
    return "Earlier";
}

const BUCKET_ORDER = ["Today", "Yesterday", "Earlier"] as const;

export function NotificationsScreen({
                                        notifications,
                                        onBack,
                                        onMarkAllRead,
                                        onRemove,
                                        onClear,
                                    }: NotificationsScreenProps) {
    const unreadCount = notifications.filter((n) => !n.read).length;

    const groups = useMemo(() => {
        const map = new Map<string, AppNotification[]>();
        for (const n of notifications) {
            const key = bucketOf(n.createdAt);
            (map.get(key) ?? map.set(key, []).get(key)!).push(n);
        }
        return BUCKET_ORDER.filter((b) => map.has(b)).map((b) => ({
            label: b,
            items: map.get(b)!,
        }));
    }, [notifications]);

    return (
        <div className="h-full bg-gradient-to-b from-[#ADC8FF] via-[#E8F2FF]/95 to-white flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0">
                <div className="h-safe-top"/>
                <div className="flex items-center justify-between gap-3 px-5 pt-2 pb-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <motion.button
                            whileTap={{scale: 0.92}}
                            onClick={onBack}
                            aria-label="Go back"
                            className="w-11 h-11 flex-shrink-0 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-card border border-white/40 text-[#091A7A]"
                        >
                            <ArrowLeft className="w-5 h-5"/>
                        </motion.button>
                        <div className="min-w-0">
                            <h1 className="text-[20px] font-bold text-[#091A7A] leading-tight">
                                Notifications
                            </h1>
                            <p className="text-[12px] text-[#475569]">
                                {unreadCount > 0
                                    ? `${unreadCount} unread`
                                    : "You're all caught up"}
                            </p>
                        </div>
                    </div>

                    {notifications.length > 0 && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <motion.button
                                whileTap={{scale: 0.94}}
                                onClick={onMarkAllRead}
                                disabled={unreadCount === 0}
                                aria-label="Mark all as read"
                                className={`h-10 px-3 rounded-full flex items-center gap-1.5 text-[13px] font-semibold border transition-colors ${
                                    unreadCount === 0
                                        ? "bg-white/50 border-transparent text-[#94a3b8]"
                                        : "bg-white border-[#091A7A]/12 text-[#091A7A]"
                                }`}
                            >
                                <CheckCheck className="w-4 h-4"/>
                                Read
                            </motion.button>
                            <motion.button
                                whileTap={{scale: 0.94}}
                                onClick={onClear}
                                aria-label="Clear all notifications"
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[#091A7A]/12 text-[#B91C1C]"
                            >
                                <Trash2 className="w-4 h-4"/>
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>

            {/* List */}
            {notifications.length === 0 ? (
                <EmptyState/>
            ) : (
                <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-28">
                    <div className="space-y-6">
                        {groups.map((group) => (
                            <section key={group.label} className="space-y-2.5">
                                <h2 className="px-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748b]">
                                    {group.label}
                                </h2>
                                <AnimatePresence initial={false}>
                                    {group.items.map((n) => (
                                        <NotificationRow
                                            key={n.id}
                                            notification={n}
                                            onRemove={() => onRemove(n.id)}
                                        />
                                    ))}
                                </AnimatePresence>
                            </section>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function NotificationRow({
                             notification,
                             onRemove,
                         }: {
    notification: AppNotification;
    onRemove: () => void;
}) {
    const {icon: Icon, tint, fg} = VISUALS[notification.type] ?? VISUALS.info;
    return (
        <motion.div
            layout
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, x: -24, transition: {duration: 0.18}}}
            className={`relative flex items-start gap-3 rounded-2xl p-3.5 border shadow-sm ${
                notification.read
                    ? "bg-white/85 border-white/60"
                    : "bg-white border-[#ADC8FF]/60"
            }`}
        >
            {!notification.read && (
                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#4F8EFF]"/>
            )}
            <div
                className={`w-10 h-10 flex-shrink-0 rounded-xl ${tint} flex items-center justify-center`}
            >
                <Icon className={`w-5 h-5 ${fg}`}/>
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p className="text-[14px] font-semibold text-[#091A7A] truncate">
                        {notification.title}
                    </p>
                    {notification.xpGain ? (
                        <span className="flex-shrink-0 inline-flex items-center gap-0.5 rounded-full bg-[#FEF3C7] px-1.5 py-0.5 text-[10px] font-bold text-[#B45309]">
                            <Zap className="w-2.5 h-2.5" fill="currentColor"/>
                            +{notification.xpGain}
                        </span>
                    ) : null}
                </div>
                {notification.subtitle && (
                    <p className="text-[13px] text-[#475569] leading-snug mt-0.5">
                        {notification.subtitle}
                    </p>
                )}
                <p className="text-[11px] text-[#94a3b8] mt-1">
                    {relativeTime(notification.createdAt)}
                </p>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <button
                            aria-label="Notification actions"
                            className="w-8 h-8 flex-shrink-0 -mr-1 rounded-full flex items-center justify-center text-[#64748b] hover:bg-[#091A7A]/5 outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/30"
                        >
                            <MoreHorizontal className="w-4 h-4"/>
                        </button>
                    }
                />
                <DropdownMenuContent align="end" className="w-[160px] rounded-[14px] p-1.5">
                    <DropdownMenuItem
                        onClick={onRemove}
                        className="rounded-[10px] px-3 py-2 cursor-pointer flex items-center gap-2.5 text-[14px] font-medium text-[#B91C1C]"
                    >
                        <Trash2 size={16}/>
                        Remove
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </motion.div>
    );
}

function EmptyState() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pb-24">
            <div className="w-20 h-20 rounded-3xl bg-white/80 border border-white/60 shadow-card flex items-center justify-center mb-5">
                <BellOff className="w-9 h-9 text-[#ADC8FF]"/>
            </div>
            <h2 className="text-[18px] font-bold text-[#091A7A] mb-1.5">
                No notifications yet
            </h2>
            <p className="text-[14px] text-[#475569] max-w-[30ch]">
                Train a room, level up, or keep your streak alive — your milestones
                will show up here.
            </p>
        </div>
    );
}
