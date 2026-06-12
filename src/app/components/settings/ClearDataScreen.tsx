import {motion} from "motion/react";
import {AlertTriangle, ArrowLeft, BellOff, Layers, RotateCcw, TrendingUp} from "lucide-react";
import {type ComponentType, useState} from "react";
import {toast} from "sonner";
import {ProgressUtils} from "../../utils/progressUtils";
import {useProgressState} from "../../hooks/useProgressState";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";

interface ClearDataScreenProps {
    onBack: () => void;
}

type OptionId = "palaces" | "stats" | "notifications" | "reset";

interface DataOption {
    id: OptionId;
    label: string;
    description: string;
    /** Live, real detail line (counts) — never a fabricated size. */
    detail: string;
    icon: ComponentType<{className?: string}>;
    dangerous?: boolean;
}

function formatBytes(bytes: number) {
    if (bytes <= 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function ClearDataScreen({onBack}: ClearDataScreenProps) {
    const {state, actions} = useProgressState();
    const [selectedOptions, setSelectedOptions] = useState<OptionId[]>([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const storageInfo = ProgressUtils.getStorageInfo();
    const palaceCount = state.palaces.length;
    const cardCount = state.palaces.reduce(
        (sum, p) => sum + (p.rooms || []).reduce((s, r) => s + (r.loci?.length || 0), 0),
        0,
    );
    const notificationCount = state.notifications.length;
    const trainingDayCount = state.trainingDays.length;

    const plural = (n: number, one: string, many = `${one}s`) =>
        `${n} ${n === 1 ? one : many}`;

    const dataOptions: DataOption[] = [
        {
            id: "palaces",
            label: "Memory Palaces",
            description: "Every palace, room, and card you've built",
            detail:
                palaceCount === 0
                    ? "Nothing to clear"
                    : `${plural(palaceCount, "palace")} · ${plural(cardCount, "card")}`,
            icon: Layers,
            dangerous: true,
        },
        {
            id: "stats",
            label: "Training stats & streak",
            description: "XP, level, streak, training history, and best quiz score",
            detail:
                trainingDayCount === 0 && state.userXP === 0
                    ? "Nothing to clear"
                    : `${plural(trainingDayCount, "day")} trained · ${state.userXP.toLocaleString()} XP`,
            icon: TrendingUp,
            dangerous: true,
        },
        {
            id: "notifications",
            label: "Notifications",
            description: "Your in-app notification history",
            detail: notificationCount === 0 ? "Nothing to clear" : plural(notificationCount, "notification"),
            icon: BellOff,
        },
        {
            id: "reset",
            label: "Reset everything",
            description: "Wipe all palaces, progress, and notifications for a clean start",
            detail: `Frees ${formatBytes(storageInfo.progressSize)}`,
            icon: RotateCcw,
            dangerous: true,
        },
    ];

    const toggleOption = (id: OptionId) => {
        setSelectedOptions((prev) => {
            // "Reset everything" is exclusive — selecting it clears the rest.
            if (id === "reset") return prev.includes("reset") ? [] : ["reset"];
            const next = prev.includes(id)
                ? prev.filter((o) => o !== id)
                : [...prev.filter((o) => o !== "reset"), id];
            return next;
        });
    };

    const hasDangerousSelections = selectedOptions.some(
        (id) => dataOptions.find((opt) => opt.id === id)?.dangerous,
    );

    const handleClearData = async () => {
        setIsClearing(true);

        if (selectedOptions.includes("reset")) {
            actions.resetProgress();
        } else {
            if (selectedOptions.includes("palaces")) actions.clearPalaces();
            if (selectedOptions.includes("stats")) actions.clearStats();
            if (selectedOptions.includes("notifications")) actions.clearNotifications();
        }

        await new Promise((resolve) => setTimeout(resolve, 600));
        setIsClearing(false);
        setShowConfirmDialog(false);

        const count = selectedOptions.length;
        setSelectedOptions([]);
        toast.success(
            selectedOptions.includes("reset")
                ? "Everything reset"
                : `Cleared ${plural(count, "item")}`,
        );
    };

    return (
        <div className="size-full flex flex-col">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#091A7A]/10 via-[#ADC8FF]/20 to-transparent"/>

                <div className="relative p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <motion.button
                            whileTap={{scale: 0.95}}
                            onClick={onBack}
                            aria-label="Go back"
                            className="w-12 h-12 bg-card-glass backdrop-blur-lg rounded-full flex items-center justify-center shadow-card border border-white/20"
                        >
                            <ArrowLeft className="w-5 h-5 text-[#091A7A]"/>
                        </motion.button>
                        <h1 className="text-2xl font-bold text-[#091A7A]">Clear Data</h1>
                    </div>
                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"/>
                        <div>
                            <p className="text-sm font-medium text-amber-900">This can't be undone</p>
                            <p className="text-xs text-amber-700 mt-1">
                                Cleared data is removed from this device permanently. Export your
                                progress first if you want a backup.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide pb-8">
                <div className="px-6 space-y-3">
                    {dataOptions.map((option) => {
                        const isSelected = selectedOptions.includes(option.id);
                        const Icon = option.icon;
                        return (
                            <motion.button
                                key={option.id}
                                whileTap={{scale: 0.98}}
                                onClick={() => toggleOption(option.id)}
                                className={`w-full text-left bg-white/80 backdrop-blur-sm rounded-2xl border shadow-card p-5 transition-all ${
                                    isSelected
                                        ? option.dangerous
                                            ? "border-red-300 bg-red-50/50"
                                            : "border-[#091A7A]/30 bg-[#ADC8FF]/5"
                                        : "border-white/60"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        <div
                                            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                option.dangerous ? "bg-red-100" : "bg-[#ADC8FF]/20"
                                            }`}
                                        >
                                            <Icon
                                                className={`w-5 h-5 ${
                                                    option.dangerous ? "text-red-600" : "text-[#091A7A]"
                                                }`}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-[#091A7A]">
                                                    {option.label}
                                                </h3>
                                                {option.dangerous && (
                                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                                        Permanent
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-[#091A7A]/70 mb-2">
                                                {option.description}
                                            </p>
                                            <p className="text-xs font-medium text-[#091A7A]/55">
                                                {option.detail}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0">
                                        <div
                                            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                                                isSelected
                                                    ? "bg-[#091A7A] border-[#091A7A]"
                                                    : "border-gray-300"
                                            }`}
                                        >
                                            {isSelected && (
                                                <motion.svg
                                                    initial={{scale: 0}}
                                                    animate={{scale: 1}}
                                                    className="w-4 h-4 text-white"
                                                    fill="none"
                                                    strokeWidth={3}
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                                </motion.svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Clear Button */}
                {selectedOptions.length > 0 && (
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        className="px-6 mt-6"
                    >
                        <button
                            onClick={() => setShowConfirmDialog(true)}
                            className={`w-full py-4 font-semibold rounded-2xl shadow-lg transition-all ${
                                hasDangerousSelections
                                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                                    : "bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] text-white"
                            }`}
                        >
                            {selectedOptions.includes("reset")
                                ? "Reset everything"
                                : `Clear ${selectedOptions.length} item${selectedOptions.length > 1 ? "s" : ""}`}
                        </button>
                    </motion.div>
                )}
            </div>

            <AlertDialog open={showConfirmDialog} onOpenChange={(open) => !isClearing && setShowConfirmDialog(open)}>
                <AlertDialogContent size="sm" className="max-w-[340px] rounded-2xl p-6">
                    <AlertDialogHeader className="gap-3">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-red-100">
                            <AlertTriangle className="w-6 h-6 text-[#EF4444]" strokeWidth={2.2}/>
                        </div>
                        <AlertDialogTitle className="text-center text-[18px] font-bold text-[#091A7A]">
                            {selectedOptions.includes("reset") ? "Reset everything?" : "Delete selected data?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-[14px] text-[#091A7A]/70 text-pretty">
                            This permanently removes the selected data from this device and can't be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-3 mt-1">
                        <AlertDialogCancel
                            disabled={isClearing}
                            variant="ghost"
                            onClick={() => setShowConfirmDialog(false)}
                            className="flex-1 h-11 rounded-xl bg-[#EAF4FF] flex items-center justify-center font-semibold text-[14px] text-[#091A7A] transition-colors hover:bg-[#dcebff] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="ghost"
                            onClick={(e) => {
                                e.preventDefault();
                                handleClearData();
                            }}
                            disabled={isClearing}
                            className="flex-1 h-11 rounded-xl flex items-center justify-center font-semibold text-[14px] text-white transition-colors disabled:opacity-50 bg-[#EF4444] hover:bg-[#dc2626] shadow-[0_8px_20px_rgba(239,68,68,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444]/40"
                        >
                            {isClearing ? (
                                <motion.div
                                    animate={{rotate: 360}}
                                    transition={{duration: 1, repeat: Infinity, ease: "linear"}}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                />
                            ) : (
                                "Delete data"
                            )}
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
