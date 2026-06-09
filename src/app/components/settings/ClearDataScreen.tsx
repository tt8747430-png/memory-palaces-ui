import {motion} from "motion/react";
import {AlertTriangle, ArrowLeft, Trash2} from "lucide-react";
import {useState} from "react";
import {ProgressUtils} from "../../utils/progressUtils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "../ui/alert-dialog";

interface ClearDataScreenProps {
    onBack: () => void;
}

interface DataOption {
    id: string;
    label: string;
    description: string;
    size: string;
    dangerous?: boolean;
}

export function ClearDataScreen({onBack}: ClearDataScreenProps) {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const storageInfo = ProgressUtils.getStorageInfo();

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const dataOptions: DataOption[] = [
        {
            id: "cache",
            label: "Cache Data",
            description: "Temporary files and images",
            size: "45 MB",
        },
        {
            id: "progress",
            label: "Training Progress",
            description: "Your learning history and stats",
            size: formatBytes(storageInfo.progressSize),
            dangerous: true,
        },
        {
            id: "palaces",
            label: "Memory Palaces",
            description: "All created palaces and rooms",
            size: "8 MB",
            dangerous: true,
        },
        {
            id: "achievements",
            label: "Achievements",
            description: "Your earned badges and milestones",
            size: "1 MB",
            dangerous: true,
        },
    ];

    const toggleOption = (id: string) => {
        setSelectedOptions(prev =>
            prev.includes(id) ? prev.filter(opt => opt !== id) : [...prev, id]
        );
    };

    const handleClearData = async () => {
        setIsClearing(true);

        if (selectedOptions.includes("progress")) {
            ProgressUtils.clearProgress();
        }

        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsClearing(false);
        setShowConfirmDialog(false);
        setSelectedOptions([]);
    };

    const hasDangerousSelections = selectedOptions.some(id =>
        dataOptions.find(opt => opt.id === id)?.dangerous
    );

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
                            className="w-12 h-12 bg-card-glass backdrop-blur-lg rounded-full flex items-center justify-center shadow-card border border-white/20"
                        >
                            <ArrowLeft className="w-5 h-5 text-[#091A7A]"/>
                        </motion.button>
                        <h1 className="text-2xl font-bold text-[#091A7A]">Clear Data</h1>
                    </div>
                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"/>
                        <div>
                            <p className="text-sm font-medium text-amber-900">Warning</p>
                            <p className="text-xs text-amber-700 mt-1">
                                Some data cannot be recovered once deleted. Please review your selections carefully.
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
                                    <div className="flex items-start gap-4 flex-1">
                                        <div
                                            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                option.dangerous ? "bg-red-100" : "bg-[#ADC8FF]/20"
                                            }`}
                                        >
                                            <Trash2
                                                className={`w-5 h-5 ${
                                                    option.dangerous ? "text-red-600" : "text-[#091A7A]"
                                                }`}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-[#091A7A]">
                                                    {option.label}
                                                </h3>
                                                {option.dangerous && (
                                                    <span
                                                        className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            Permanent
                          </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-[#091A7A]/70 mb-2">
                                                {option.description}
                                            </p>
                                            <p className="text-xs text-[#091A7A]/70">
                                                Size: {option.size}
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
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M5 13l4 4L19 7"/>
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
                            Clear {selectedOptions.length} Item{selectedOptions.length > 1 ? "s" : ""}
                        </button>
                    </motion.div>
                )}
            </div>

            <AlertDialog open={showConfirmDialog} onOpenChange={(open) => !isClearing && setShowConfirmDialog(open)}>
                <AlertDialogContent size="sm" className="max-w-[340px] rounded-2xl p-6">
                    <AlertDialogHeader className="gap-3">
                        <div
                            className={`w-14 h-14 rounded-full flex items-center justify-center ${
                                hasDangerousSelections ? "bg-red-100" : "bg-[#EAF4FF]"
                            }`}
                        >
                            {hasDangerousSelections ? (
                                <AlertTriangle className="w-6 h-6 text-[#EF4444]" strokeWidth={2.2}/>
                            ) : (
                                <Trash2 className="w-6 h-6 text-[#091A7A]" strokeWidth={2.2}/>
                            )}
                        </div>
                        <AlertDialogTitle className="text-center text-[18px] font-bold text-[#091A7A]">
                            {hasDangerousSelections ? "Delete selected data?" : "Clear cache?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-[14px] text-[#091A7A]/70 text-pretty">
                            {hasDangerousSelections
                                ? "This permanently deletes your selected data and can't be undone."
                                : "This frees up space on your device. You can rebuild your cache anytime."}
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
                            className={`flex-1 h-11 rounded-xl flex items-center justify-center font-semibold text-[14px] text-white transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 ${
                                hasDangerousSelections
                                    ? "bg-[#EF4444] hover:bg-[#dc2626] shadow-[0_8px_20px_rgba(239,68,68,0.25)] focus-visible:ring-[#EF4444]/40"
                                    : "bg-[#091A7A] hover:bg-[#0a2090] shadow-[0_8px_20px_rgba(9,26,122,0.25)] focus-visible:ring-[#091A7A]/40"
                            }`}
                        >
                            {isClearing ? (
                                <motion.div
                                    animate={{rotate: 360}}
                                    transition={{duration: 1, repeat: Infinity, ease: "linear"}}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                />
                            ) : hasDangerousSelections ? (
                                "Delete data"
                            ) : (
                                "Clear cache"
                            )}
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
