import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {
    ArrowLeft,
    Brain,
    CheckCircle,
    Clock,
    Flame,
    MoreVertical,
    RotateCcw,
    SkipForward,
    X,
    XCircle,
    Zap,
} from "lucide-react";
import {type Palace, palaceSettings, useProgressState} from "../../hooks/useProgressState";
import {impact} from "../../utils/haptics";
import {playComplete, playCorrect, playWrong} from "../../utils/sound";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {IconButton} from "../ui/IconButton";

interface PalaceQuizScreenProps {
    palaceId: string;
    onBack: () => void;
    onComplete: (results: QuizResults) => void;
    /** When set, only quiz on this room's questions (room-scoped test). */
    roomTitle?: string;
}

export interface QuizResults {
    palaceId: string;
    score: number;
    totalQuestions: number;
    accuracy: number;
    timeSpent: number;
    xpGained: number;
}

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    roomTitle: string;
    explanation?: string;
}

export function PalaceQuizScreen({
                                     palaceId,
                                     onBack,
                                     onComplete,
                                     roomTitle,
                                 }: PalaceQuizScreenProps) {
    const {state, actions} = useProgressState();
    const palace = state.palaces.find((p) => p.id === palaceId);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<
        number | null
    >(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    // Consecutive correct answers, for the in-flow "on a roll" indicator.
    const [correctStreak, setCorrectStreak] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [startTime] = useState(Date.now());
    const [questions] = useState<QuizQuestion[]>(() =>
        buildQuizQuestions(palace, palaceSettings(palace).shuffleQuestions, roomTitle),
    );
    // Per-palace "Quiz timer" setting; when off, learners answer at their pace.
    const [timerEnabled] = useState(() => palaceSettings(palace).quizTimer);

    const currentQ = questions[currentQuestion];

    // Timer
    useEffect(() => {
        if (showFeedback || !timerEnabled) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestion, showFeedback]);

    const handleTimeUp = () => {
        setShowFeedback(true);
        setCorrectStreak(0);
        playWrong();
        setTimeout(() => handleNextQuestion(), 2000);
    };

    const handleAnswerSelect = (answerIndex: number) => {
        if (showFeedback) return;
        setSelectedAnswer(answerIndex);
    };

    const handleSubmitAnswer = () => {
        if (selectedAnswer === null) return;

        const isCorrect = selectedAnswer === currentQ.correctAnswer;
        setShowFeedback(true);

        if (isCorrect) {
            setScore((prev) => prev + 1);
            setCorrectStreak((prev) => prev + 1);
            actions.addXP(20);
            impact();
            playCorrect();
        } else {
            setCorrectStreak(0);
            playWrong();
        }

        setTimeout(() => handleNextQuestion(), 2500);
    };

    const handleNextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
            setSelectedAnswer(null);
            setShowFeedback(false);
            setTimeLeft(30);
        } else {
            completeQuiz();
        }
    };

    const completeQuiz = () => {
        const timeSpent = Math.floor(
            (Date.now() - startTime) / 1000,
        );
        const accuracy = Math.round(
            (score / questions.length) * 100,
        );
        const xpGained = score * 20;

        actions.recordQuizResult(accuracy);
        playComplete();
        if (accuracy >= 80) {
            actions.recordTrainingDay();
        }

        onComplete({
            palaceId,
            score,
            totalQuestions: questions.length,
            accuracy,
            timeSpent,
            xpGained,
        });
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setScore(0);
        setCorrectStreak(0);
        setTimeLeft(30);
    };

    // Skip advances without scoring (counts as not answered).
    const skipQuestion = () => {
        setShowFeedback(false);
        handleNextQuestion();
    };

    if (!palace) return null;

    // No authored questions yet (palace-wide or room-scoped): a real empty state.
    if (questions.length === 0) {
        return (
            <div className="h-full bg-gradient-to-b from-[#ADC8FF] via-[#E8F2FF]/95 to-white flex flex-col items-center justify-center gap-5 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EAF4FF]">
                    <Brain className="h-8 w-8 text-[#3D8FEF]"/>
                </div>
                <div>
                    <h2 className="mb-1 text-2xl font-bold text-[#091A7A]">No questions yet</h2>
                    <p className="mx-auto max-w-[34ch] text-[14px] text-[#475569]">
                        {roomTitle
                            ? `Add some questions to “${roomTitle}” to test yourself on this room.`
                            : "Add questions to this palace to start a quiz."}
                    </p>
                </div>
                <button
                    onClick={onBack}
                    className="rounded-full bg-[#091A7A] px-6 py-3 text-sm font-semibold text-white shadow-interactive"
                >
                    Back
                </button>
            </div>
        );
    }

    return (
        <div className="h-full bg-gradient-to-b from-[#ADC8FF]/30 via-[#F8FBFF]/50 to-white flex flex-col">
            {/* Header — one compact block: controls row + tight progress */}
            <div className="h-safe-top"/>
            <div className="px-4 pt-2 pb-3">
                <div className="flex items-center gap-2.5">
                    <IconButton aria-label="Go back" variant="glass" size="md" onClick={onBack}>
                        <ArrowLeft className="w-5 h-5"/>
                    </IconButton>

                    <h1 className="flex-1 min-w-0 flex items-center justify-center gap-1.5 text-[15px] font-bold text-[#091A7A]">
                        <span className="text-[17px] leading-none flex-shrink-0">{palace.icon}</span>
                        <span className="truncate">{roomTitle ?? `${palace.name} Quiz`}</span>
                    </h1>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        {timerEnabled && (
                            <motion.div
                                animate={{scale: timeLeft <= 5 ? [1, 1.1, 1] : 1}}
                                transition={{
                                    duration: timeLeft <= 5 ? 0.5 : 0,
                                    repeat: timeLeft <= 5 ? Infinity : 0,
                                }}
                                className={`flex items-center gap-1 px-2.5 h-9 rounded-full border shadow-sm tabular-nums ${
                                    timeLeft <= 5
                                        ? "bg-red-50 border-red-200 text-red-600"
                                        : "bg-white/95 border-white/40 text-[#091A7A]"
                                }`}
                            >
                                <Clock className="w-3.5 h-3.5"/>
                                <span className="text-[13px] font-semibold">{timeLeft}s</span>
                            </motion.div>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <IconButton aria-label="Quiz options" variant="glass" size="md">
                                        <MoreVertical className="w-5 h-5"/>
                                    </IconButton>
                                }
                            />
                            <DropdownMenuContent align="end" className="w-[180px] rounded-[16px] p-1.5">
                                <DropdownMenuItem
                                    onClick={skipQuestion}
                                    className="rounded-[10px] px-3 py-2.5 cursor-pointer flex items-center gap-3 text-[14px] font-medium text-[#2C2C2C]"
                                >
                                    <SkipForward size={16} className="text-[#091A7A]"/>
                                    Skip question
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={restartQuiz}
                                    className="rounded-[10px] px-3 py-2.5 cursor-pointer flex items-center gap-3 text-[14px] font-medium text-[#2C2C2C]"
                                >
                                    <RotateCcw size={16} className="text-[#091A7A]"/>
                                    Restart quiz
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem
                                    onClick={onBack}
                                    className="rounded-[10px] px-3 py-2.5 cursor-pointer flex items-center gap-3 text-[14px] font-medium text-red-600 hover:bg-red-50 focus:bg-red-50"
                                >
                                    <X size={16} className="text-red-600"/>
                                    End quiz
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Tight progress: bar + count on one line */}
                <div className="mt-2.5 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/60 rounded-full overflow-hidden border border-white/40">
                        <motion.div
                            initial={{width: 0}}
                            animate={{width: `${((currentQuestion + 1) / questions.length) * 100}%`}}
                            className="h-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] rounded-full"
                            transition={{duration: 0.3}}
                        />
                    </div>
                    <span className="text-[12px] font-semibold text-[#091A7A] tabular-nums flex-shrink-0">
                        {currentQuestion + 1}/{questions.length}
                    </span>
                </div>
            </div>

            {/* Question Card */}
            <div className="flex-1 px-6 pb-6 space-y-4 overflow-y-auto scrollbar-hide">
                <motion.div
                    key={currentQuestion}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/40"
                >
                    <div className="flex items-start gap-3 mb-6">
                        <div
                            className="w-10 h-10 bg-[#091A7A]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Brain className="w-5 h-5 text-[#091A7A]"/>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-2">
                                Room: {currentQ.roomTitle}
                            </p>
                            <h2 className="text-lg font-medium text-[#091A7A] leading-relaxed">
                                {currentQ.question}
                            </h2>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {currentQ.options.map((option, index) => {
                            let cardStyle = "bg-white/60 border-gray-200";
                            let textColor = "text-[#091A7A]";

                            if (showFeedback) {
                                if (index === currentQ.correctAnswer) {
                                    cardStyle =
                                        "bg-emerald-50 border-emerald-300";
                                    textColor = "text-emerald-700";
                                } else if (index === selectedAnswer) {
                                    cardStyle = "bg-red-50 border-red-300";
                                    textColor = "text-red-700";
                                }
                            } else if (selectedAnswer === index) {
                                cardStyle =
                                    "bg-[#091A7A]/10 border-[#091A7A]/30";
                            }

                            return (
                                <motion.button
                                    key={index}
                                    initial={{opacity: 0, x: -10}}
                                    animate={{opacity: 1, x: 0}}
                                    transition={{delay: index * 0.05}}
                                    whileHover={{
                                        scale: showFeedback ? 1 : 1.01,
                                    }}
                                    whileTap={{scale: showFeedback ? 1 : 0.99}}
                                    onClick={() => handleAnswerSelect(index)}
                                    disabled={showFeedback}
                                    className={`w-full p-4 text-left rounded-xl border-2 transition-all ${cardStyle}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 bg-white/80 rounded-lg flex items-center justify-center">
                        <span className="font-semibold text-sm text-gray-700">
                          {String.fromCharCode(65 + index)}
                        </span>
                                            </div>
                                            <span
                                                className={`font-medium ${textColor}`}
                                            >
                        {option}
                      </span>
                                        </div>
                                        {showFeedback && (
                                            <>
                                                {index === currentQ.correctAnswer && (
                                                    <CheckCircle className="w-5 h-5 text-emerald-600"/>
                                                )}
                                                {selectedAnswer === index &&
                                                    index !== currentQ.correctAnswer && (
                                                        <XCircle className="w-5 h-5 text-red-600"/>
                                                    )}
                                            </>
                                        )}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Feedback */}
                <AnimatePresence>
                    {showFeedback && (
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0}}
                            className={`p-4 rounded-2xl backdrop-blur-xl border ${
                                selectedAnswer === currentQ.correctAnswer
                                    ? "bg-emerald-50/95 border-emerald-200"
                                    : "bg-red-50/95 border-red-200"
                            }`}
                        >
                            <div className="flex items-start gap-2.5">
                                {selectedAnswer === currentQ.correctAnswer ? (
                                    <>
                                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"/>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-semibold text-emerald-700">
                                                    Correct
                                                </p>
                                                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF6DC] px-2 py-0.5 text-[12px] font-semibold text-[#A9791A]">
                                                    <Zap size={11} className="fill-[#FFC71E] text-[#FFC71E]"/>
                                                    +20 XP
                                                </span>
                                                {correctStreak >= 2 && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[12px] font-semibold text-orange-700">
                                                        <Flame size={11} className="fill-orange-500 text-orange-500"/>
                                                        {correctStreak} in a row
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-sm text-emerald-700/90">
                                                {currentQ.explanation || "Well recalled."}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5"/>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-[#B42318]">
                                                Not quite
                                            </p>
                                            <p className="mt-1 text-sm text-[#B42318]/85">
                                                {currentQ.explanation ||
                                                    "Review this one and it'll stick next time."}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Submit Button */}
                {!showFeedback && (
                    <motion.button
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        whileHover={{
                            scale: selectedAnswer !== null ? 1.02 : 1,
                        }}
                        whileTap={{
                            scale: selectedAnswer !== null ? 0.98 : 1,
                        }}
                        onClick={handleSubmitAnswer}
                        disabled={selectedAnswer === null}
                        className={`w-full py-4 rounded-2xl font-semibold shadow-lg transition-all ${
                            selectedAnswer !== null
                                ? "bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] text-white"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        {selectedAnswer !== null
                            ? "Submit Answer"
                            : "Select an answer"}
                    </motion.button>
                )}
            </div>
        </div>
    );
}

/**
 * Build the quiz from the palace's own authored room questions only. No sample
 * fallback: a palace (or room) with no questions yet shows the empty state, so
 * the quiz only ever tests the user's real content.
 */
function buildQuizQuestions(
    palace: Palace | undefined,
    shuffleQuestions: boolean,
    roomTitle?: string,
): QuizQuestion[] {
    const rooms = roomTitle
        ? (palace?.rooms || []).filter((r) => r.title === roomTitle)
        : palace?.rooms || [];
    const built = rooms.flatMap((room) =>
        (room.questions || []).map((q) => ({
            id: q.id,
            question: q.prompt,
            options: q.options,
            correctAnswer: q.correctAnswer,
            roomTitle: room.title,
            explanation: q.explanation,
        })),
    );
    if (shuffleQuestions && built.length > 1) {
        const a = [...built];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    return built;
}