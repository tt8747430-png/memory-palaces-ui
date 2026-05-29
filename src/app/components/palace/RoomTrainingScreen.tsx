import {useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {
  ArrowLeft,
  Bookmark,
  Brain,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import {useProgressState} from "../../hooks/useProgressState";
import {RiveAnimation} from "../ui/RiveAnimation";

interface RoomTrainingScreenProps {
    onBack: () => void;
    onComplete: () => void;
    roomTitle?: string;
    palaceTitle?: string;
    roomContent?: {
        technique: string;
        items: string[];
        visualCue: string;
    };
}

interface FlashCard {
    id: number;
    front: string;
    back: string;
    visualCue: string;
    isFlipped: boolean;
}

export function RoomTrainingScreen({
                                       onBack,
                                       onComplete,
                                       roomTitle = "Ancient Greek Gods",
                                       palaceTitle = "Greek Mythology Palace",
                                   }: RoomTrainingScreenProps) {
    const {actions} = useProgressState();
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [flashCards, setFlashCards] = useState<FlashCard[]>([
        {
            id: 1,
            front: "Zeus",
            back: "King of the gods, god of sky and thunder. Symbol: Lightning bolt",
            visualCue:
                "Imagine Zeus on a throne made of clouds, holding a glowing lightning bolt",
            isFlipped: false,
        },
        {
            id: 2,
            front: "Poseidon",
            back: "God of the sea, earthquakes, and horses. Symbol: Trident",
            visualCue:
                "Picture Poseidon riding a massive wave with a golden trident in hand",
            isFlipped: false,
        },
        {
            id: 3,
            front: "Athena",
            back: "Goddess of wisdom, warfare, and crafts. Symbol: Owl",
            visualCue:
                "See Athena in gleaming armor with an owl perched on her shoulder",
            isFlipped: false,
        },
        {
            id: 4,
            front: "Apollo",
            back: "God of music, poetry, sun, and prophecy. Symbol: Lyre",
            visualCue:
                "Apollo playing a golden lyre while the sun rises behind him",
            isFlipped: false,
        },
    ]);

    const currentCard = flashCards[currentCardIndex];
    const progress =
        ((currentCardIndex + 1) / flashCards.length) * 100;

    const handleCardFlip = () => {
        setFlashCards((prev) =>
            prev.map((card, idx) =>
                idx === currentCardIndex
                    ? {...card, isFlipped: !card.isFlipped}
                    : card,
            ),
        );
    };

    const handleNext = () => {
        if (currentCardIndex < flashCards.length - 1) {
            setCurrentCardIndex((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex((prev) => prev - 1);
        }
    };

    const handleComplete = () => {
        setShowSuccess(true);
        setTimeout(() => {
            actions.recordTrainingDay();
            actions.addXP(100);
            onComplete();
        }, 2500);
    };

    const handleLike = () => {
        if (isDisliked) setIsDisliked(false);
        setIsLiked(!isLiked);
    };

    const handleDislike = () => {
        if (isLiked) setIsLiked(false);
        setIsDisliked(!isDisliked);
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
    };

    return (
        <div className="h-full bg-gradient-to-b from-[#ADC8FF] via-[#E8F2FF]/95 to-white flex flex-col">
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={onBack}
                        className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/40"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#091A7A]"/>
                    </motion.button>

                    <div className="flex-1 mx-4 text-center">
                        <h1 className="text-section-header text-[#091A7A] font-semibold">
                            {roomTitle}
                        </h1>
                        <p className="text-small text-[#6B7280]">
                            {palaceTitle}
                        </p>
                    </div>

                    <div
                        className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/40">
                        <Brain className="w-5 h-5 text-[#091A7A]"/>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
            <span className="text-tiny text-[#6B7280]">
              Card {currentCardIndex + 1} of {flashCards.length}
            </span>
                        <span className="text-tiny font-medium text-[#091A7A]">
              {Math.round(progress)}% Complete
            </span>
                    </div>
                    <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#091A7A] to-[#1A2FB8] rounded-full"
                            initial={{width: 0}}
                            animate={{width: `${progress}%`}}
                            transition={{duration: 0.3}}
                        />
                    </div>
                </div>
            </div>

            {/* Flashcard Container */}
            <div className="flex-1 px-6 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentCardIndex}
                        initial={{opacity: 0, scale: 0.9, rotateY: 0}}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            rotateY: currentCard.isFlipped ? 180 : 0,
                        }}
                        exit={{opacity: 0, scale: 0.9}}
                        transition={{duration: 0.4}}
                        onClick={handleCardFlip}
                        className="relative w-full max-w-md cursor-pointer"
                        style={{perspective: "1000px"}}
                    >
                        <div
                            className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60 min-h-[400px] flex flex-col items-center justify-center"
                            style={{transformStyle: "preserve-3d"}}
                        >
                            {/* Front/Back Content */}
                            <div
                                style={{
                                    transform: currentCard.isFlipped
                                        ? "rotateY(180deg)"
                                        : "none",
                                }}
                            >
                                {!currentCard.isFlipped ? (
                                    <div className="text-center">
                                        <div className="mb-6">
                                            <Sparkles className="w-16 h-16 text-[#F59E0B] mx-auto mb-4"/>
                                        </div>
                                        <h2 className="text-4xl font-bold text-[#091A7A] mb-4">
                                            {currentCard.front}
                                        </h2>
                                        <p className="text-small text-[#6B7280]">
                                            Tap to reveal
                                        </p>
                                    </div>
                                ) : (
                                    <div
                                        className="text-center"
                                        style={{transform: "rotateY(180deg)"}}
                                    >
                                        <p className="text-body text-[#091A7A] mb-6 leading-relaxed">
                                            {currentCard.back}
                                        </p>
                                        <div className="bg-[#ADC8FF]/20 rounded-2xl p-4 border border-[#ADC8FF]/30">
                                            <div className="flex items-start gap-2 mb-2">
                                                <Brain className="w-4 h-4 text-[#091A7A] mt-0.5 flex-shrink-0"/>
                                                <p className="text-small font-medium text-[#091A7A]">
                                                    Memory Technique:
                                                </p>
                                            </div>
                                            <p className="text-small text-[#6B7280] italic">
                                                {currentCard.visualCue}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Flip Indicator */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                                <motion.div
                                    animate={{rotate: [0, 10, -10, 0]}}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatDelay: 3,
                                    }}
                                    className="w-8 h-8 bg-[#ADC8FF]/30 rounded-full flex items-center justify-center"
                                >
                  <span className="text-xs text-[#091A7A]">
                    ↻
                  </span>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-4 mt-8">
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={handlePrevious}
                        disabled={currentCardIndex === 0}
                        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border ${
                            currentCardIndex === 0
                                ? "bg-gray-100 border-gray-200 text-gray-400"
                                : "bg-white border-white/40 text-[#091A7A]"
                        }`}
                    >
                        <ChevronLeft className="w-6 h-6"/>
                    </motion.button>

                    <span className="text-subheading font-medium text-[#091A7A] min-w-[60px] text-center">
            {currentCardIndex + 1} / {flashCards.length}
          </span>

                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={handleNext}
                        disabled={
                            currentCardIndex === flashCards.length - 1
                        }
                        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border ${
                            currentCardIndex === flashCards.length - 1
                                ? "bg-gray-100 border-gray-200 text-gray-400"
                                : "bg-white border-white/40 text-[#091A7A]"
                        }`}
                    >
                        <ChevronRight className="w-6 h-6"/>
                    </motion.button>
                </div>
            </div>

            {/* Engagement & Actions */}
            <div className="px-6 pb-6">
                {/* Engagement Buttons */}
                <div className="flex items-center justify-center gap-3 mb-4">
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                            isLiked
                                ? "bg-[#10B981] border-[#10B981] text-white"
                                : "bg-white/90 border-white/40 text-[#10B981]"
                        }`}
                    >
                        <ThumbsUp className="w-4 h-4"/>
                    </motion.button>

                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={handleDislike}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                            isDisliked
                                ? "bg-gray-500 border-gray-500 text-white"
                                : "bg-white/90 border-white/40 text-gray-600"
                        }`}
                    >
                        <ThumbsDown className="w-4 h-4"/>
                    </motion.button>

                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                            isSaved
                                ? "bg-[#F59E0B] border-[#F59E0B] text-white"
                                : "bg-white/90 border-white/40 text-[#F59E0B]"
                        }`}
                    >
                        <Bookmark className="w-4 h-4"/>
                        <span className="text-sm font-medium">
              {isSaved ? "Saved" : "Save"}
            </span>
                    </motion.button>
                </div>

                {/* Complete Button */}
                <motion.button
                    whileHover={{scale: 1.02, y: -2}}
                    whileTap={{scale: 0.98}}
                    onClick={handleComplete}
                    className="w-full bg-gradient-to-r from-[#091A7A] to-[#1A2FB8] text-white rounded-full p-4 shadow-lg flex items-center justify-center gap-2"
                >
                    <Check className="w-5 h-5"/>
                    <span className="text-subheading font-semibold">
            Complete Room Training (+100 XP)
          </span>
                </motion.button>
            </div>

            {showSuccess && (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center"
                >
                    <div className="w-64 h-64 mb-8">
                        {/* Using a public Rive animation as a placeholder for the success state */}
                        <RiveAnimation
                            src="https://cdn.rive.app/animations/vehicles.riv"
                            className="w-full h-full"
                        />
                    </div>
                    <motion.h2
                        initial={{y: 20, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        transition={{delay: 0.5}}
                        className="text-4xl font-bold text-[#091A7A] mb-2"
                    >
                        Room Mastered!
                    </motion.h2>
                    <motion.p
                        initial={{y: 20, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        transition={{delay: 0.7}}
                        className="text-2xl text-[#10B981] font-semibold flex items-center gap-2"
                    >
                        <Sparkles className="w-6 h-6"/>
                        +100 XP
                    </motion.p>
                </motion.div>
            )}
        </div>
    );
}