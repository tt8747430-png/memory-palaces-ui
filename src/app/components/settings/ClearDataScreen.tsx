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
    AlertDialogFooter,
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
                <AlertDialogContent className="sm:max-w-[400px] rounded-3xl!">
                    <AlertDialogHeader>
                        <div
                            className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-7 h-7 text-red-600"/>
                        </div>
                        <AlertDialogTitle className="text-center text-[#091A7A] text-xl">Clear Selected
                            Data?</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-[#091A7A]/70">
                            {hasDangerousSelections
                                ? "This action cannot be undone. Your selected data will be permanently deleted."
                                : "This will free up space on your device. You can always rebuild your cache."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-3 sm:justify-center mt-4">
                        <AlertDialogCancel
                            disabled={isClearing}
                            onClick={() => setShowConfirmDialog(false)}
                            className="flex-1 py-4 h-auto border-none hover:bg-gray-200 bg-gray-100 text-[#091A7A] font-semibold rounded-2xl disabled:opacity-50"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleClearData();
                            }}
                            disabled={isClearing}
                            className="flex-1 py-4 h-auto bg-gradient-to-r hover:bg-gradient-to-r from-red-500 hover:from-red-600 to-red-600 hover:to-red-700 text-white font-semibold rounded-2xl disabled:opacity-50"
                        >
                            {isClearing ? (
                                <span className="flex items-center justify-center gap-2">
                  <motion.div
                      animate={{rotate: 360}}
                      transition={{duration: 1, repeat: Infinity, ease: "linear"}}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                </span>
                            ) : (
                                "Clear Data"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
