import {useRef, useState} from "react";
import {Drawer} from "vaul";
import {motion} from "motion/react";
import {toast} from "sonner";
import {
    Bell,
    Bug,
    Check,
    ClipboardCopy,
    Download,
    Flame,
    Minus,
    Plus,
    RotateCcw,
    Trophy,
    Upload,
    X,
    Zap,
} from "lucide-react";
import {
    type NotificationType,
    useProgressState,
} from "../../hooks/useProgressState";
import {useKeyboardInset} from "../../hooks/useKeyboardInset";

/**
 * Dev-only control room. Renders its own floating trigger and a bottom drawer
 * with live state, XP/streak/notification controls, and JSON import/export.
 * Mount it once at the app root behind an `import.meta.env.DEV` guard.
 */
export function ProgressDebugPanel() {
    const {state, actions} = useProgressState();
    const keyboardInset = useKeyboardInset();
    const [open, setOpen] = useState(false);
    const [xpInput, setXpInput] = useState("");
    const [streakInput, setStreakInput] = useState("");
    const [importText, setImportText] = useState("");
    const testTypeRef = useRef(0);

    const unread = state.notifications.filter((n) => !n.read).length;

    const exportJson = () => JSON.stringify(state, null, 2);

    const copyState = async () => {
        try {
            await navigator.clipboard.writeText(exportJson());
            toast.success("State copied to clipboard");
        } catch {
            toast.error("Clipboard unavailable");
        }
    };

    const downloadState = () => {
        const blob = new Blob([exportJson()], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `mindscape-state-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("State downloaded");
    };

    const applyImport = () => {
        try {
            const parsed = JSON.parse(importText);
            if (typeof parsed !== "object" || parsed === null || !("palaces" in parsed)) {
                throw new Error("not a state object");
            }
            actions.replaceState(parsed);
            setImportText("");
            toast.success("State imported");
        } catch {
            toast.error("Invalid JSON — could not import");
        }
    };

    const pushTest = () => {
        const types: NotificationType[] = [
            "level-up",
            "streak",
            "room-complete",
            "palace-complete",
            "quiz-complete",
            "info",
        ];
        const type = types[testTypeRef.current % types.length];
        testTypeRef.current += 1;
        actions.pushNotification({
            type,
            title: `Test: ${type}`,
            subtitle: "Generated from the debug panel.",
            xpGain: type === "info" ? undefined : 25,
        });
        toast.success("Test notification pushed");
    };

    const applyXp = () => {
        const n = Number(xpInput);
        if (!Number.isFinite(n)) return;
        actions.setUserXP(n);
        setXpInput("");
    };

    const applyStreak = () => {
        const n = Number(streakInput);
        if (!Number.isFinite(n)) return;
        actions.setStreak(n);
        setStreakInput("");
    };

    return (
        <>
            <motion.button
                whileTap={{scale: 0.9}}
                onClick={() => setOpen(true)}
                aria-label="Open debug panel"
                className="fixed bottom-[120px] right-4 z-[90] w-12 h-12 rounded-full bg-[#091A7A] text-white shadow-elevated flex items-center justify-center border border-white/20"
            >
                <Bug className="w-5 h-5"/>
                {unread > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#EF4444] text-[10px] font-bold flex items-center justify-center border-2 border-white">
                        {unread}
                    </span>
                )}
            </motion.button>

            <Drawer.Root open={open} onOpenChange={setOpen}>
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-[#091A7A]/40 z-[120]"/>
                    <Drawer.Content
                        aria-describedby={undefined}
                        className="bg-white flex flex-col rounded-t-[20px] h-[90%] mt-24 fixed bottom-0 left-0 right-0 z-[121] outline-none"
                    >
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-[#091A7A]/15 mt-3 mb-1"/>
                        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
                            <Drawer.Title className="flex items-center gap-2 text-[18px] font-bold text-[#091A7A]">
                                <Bug className="w-5 h-5"/>
                                Debug panel
                            </Drawer.Title>
                            <button
                                onClick={() => setOpen(false)}
                                aria-label="Close"
                                className="w-9 h-9 rounded-full flex items-center justify-center text-[#64748b] hover:bg-[#091A7A]/5"
                            >
                                <X className="w-5 h-5"/>
                            </button>
                        </div>

                        <div
                            className="flex-1 overflow-y-auto px-5 pb-8 space-y-5"
                            style={keyboardInset > 0 ? {paddingBottom: keyboardInset + 24} : undefined}
                        >
                            {/* Snapshot */}
                            <Section title="State snapshot">
                                <div className="grid grid-cols-3 gap-2">
                                    <Stat label="XP" value={state.userXP.toLocaleString()}/>
                                    <Stat label="Level" value={state.currentLevel}/>
                                    <Stat label="Streak" value={`${state.streakCount}d`}/>
                                    <Stat label="Palaces" value={state.palaces.length}/>
                                    <Stat label="Rooms done" value={state.totalRoomsCompleted}/>
                                    <Stat label="Train days" value={state.trainingDays.length}/>
                                </div>
                            </Section>

                            {/* XP & level */}
                            <Section title="XP & level" icon={<Zap className="w-4 h-4 text-[#F59E0B]"/>}>
                                <div className="flex flex-wrap gap-2">
                                    {[50, 100, 500].map((amt) => (
                                        <Pill key={amt} onClick={() => actions.addXP(amt)}>
                                            <Plus className="w-3.5 h-3.5"/> {amt}
                                        </Pill>
                                    ))}
                                    <Pill tone="muted" onClick={() => actions.setUserXP(Math.max(0, state.userXP - 100))}>
                                        <Minus className="w-3.5 h-3.5"/> 100
                                    </Pill>
                                </div>
                                <SetRow
                                    placeholder="Set XP exactly…"
                                    value={xpInput}
                                    onChange={setXpInput}
                                    onApply={applyXp}
                                />
                            </Section>

                            {/* Streak & training */}
                            <Section title="Streak & training" icon={<Flame className="w-4 h-4 text-[#F97316]"/>}>
                                <div className="flex flex-wrap gap-2">
                                    <Pill onClick={() => actions.recordTrainingDay()}>
                                        <Check className="w-3.5 h-3.5"/> Add today
                                    </Pill>
                                    <Pill tone="muted" onClick={() => actions.clearTrainingDays()}>
                                        <RotateCcw className="w-3.5 h-3.5"/> Clear days
                                    </Pill>
                                </div>
                                <SetRow
                                    placeholder="Set streak count…"
                                    value={streakInput}
                                    onChange={setStreakInput}
                                    onApply={applyStreak}
                                />
                            </Section>

                            {/* Notifications */}
                            <Section title="Notifications" icon={<Bell className="w-4 h-4 text-[#4F8EFF]"/>}>
                                <p className="text-[12px] text-[#64748b] -mt-1">
                                    {state.notifications.length} total · {unread} unread
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <Pill onClick={pushTest}>
                                        <Plus className="w-3.5 h-3.5"/> Push test
                                    </Pill>
                                    <Pill tone="muted" onClick={() => actions.markAllNotificationsRead()}>
                                        <Check className="w-3.5 h-3.5"/> Mark read
                                    </Pill>
                                    <Pill tone="danger" onClick={() => actions.clearNotifications()}>
                                        <X className="w-3.5 h-3.5"/> Clear
                                    </Pill>
                                </div>
                            </Section>

                            {/* Data */}
                            <Section title="Data" icon={<Trophy className="w-4 h-4 text-[#FFC71E]"/>}>
                                <div className="flex flex-wrap gap-2">
                                    <Pill onClick={copyState}>
                                        <ClipboardCopy className="w-3.5 h-3.5"/> Copy JSON
                                    </Pill>
                                    <Pill onClick={downloadState}>
                                        <Download className="w-3.5 h-3.5"/> Download
                                    </Pill>
                                </div>
                                <textarea
                                    value={importText}
                                    onChange={(e) => setImportText(e.target.value)}
                                    placeholder="Paste exported state JSON to import…"
                                    rows={3}
                                    className="w-full rounded-xl border border-[#091A7A]/15 bg-[#F8FAFF] px-3 py-2 text-[12px] font-mono text-[#091A7A] outline-none focus:border-[#4F8EFF] resize-none"
                                />
                                <div className="flex gap-2">
                                    <Pill onClick={applyImport} disabled={!importText.trim()}>
                                        <Upload className="w-3.5 h-3.5"/> Import
                                    </Pill>
                                    <Pill
                                        tone="danger"
                                        onClick={() => {
                                            actions.resetProgress();
                                            toast.success("Reset to defaults");
                                        }}
                                    >
                                        <RotateCcw className="w-3.5 h-3.5"/> Reset all
                                    </Pill>
                                </div>
                            </Section>
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        </>
    );
}

function Section({
                     title,
                     icon,
                     children,
                 }: {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-[#091A7A]/10 bg-white p-4 space-y-3 shadow-sm">
            <h3 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-[#091A7A]">
                {icon}
                {title}
            </h3>
            {children}
        </section>
    );
}

function Stat({label, value}: {label: string; value: string | number}) {
    return (
        <div className="rounded-xl bg-[#F1F5FF] px-3 py-2">
            <p className="text-[11px] font-medium text-[#64748b]">{label}</p>
            <p className="text-[16px] font-bold text-[#091A7A] leading-tight">{value}</p>
        </div>
    );
}

function Pill({
                  children,
                  onClick,
                  tone = "primary",
                  disabled,
              }: {
    children: React.ReactNode;
    onClick: () => void;
    tone?: "primary" | "muted" | "danger";
    disabled?: boolean;
}) {
    const tones = {
        primary: "bg-[#091A7A] text-white",
        muted: "bg-[#EAF0FF] text-[#091A7A]",
        danger: "bg-[#FEE2E2] text-[#B91C1C]",
    };
    return (
        <motion.button
            whileTap={{scale: disabled ? 1 : 0.94}}
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-opacity ${tones[tone]} ${
                disabled ? "opacity-40" : ""
            }`}
        >
            {children}
        </motion.button>
    );
}

function SetRow({
                    placeholder,
                    value,
                    onChange,
                    onApply,
                }: {
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    onApply: () => void;
}) {
    return (
        <div className="flex gap-2">
            <input
                type="number"
                inputMode="numeric"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="flex-1 min-w-0 rounded-xl border border-[#091A7A]/15 bg-[#F8FAFF] px-3 py-2 text-[13px] text-[#091A7A] outline-none focus:border-[#4F8EFF]"
            />
            <Pill onClick={onApply} disabled={value.trim() === ""}>
                <Check className="w-3.5 h-3.5"/> Set
            </Pill>
        </div>
    );
}
