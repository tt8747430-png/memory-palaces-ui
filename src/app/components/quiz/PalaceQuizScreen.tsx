import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {
    ArrowLeft,
    Brain,
    CheckCircle,
    Clock,
    MoreVertical,
    RotateCcw,
    SkipForward,
    X,
    XCircle,
} from "lucide-react";
import {type Palace, palaceSettings, useProgressState} from "../../hooks/useProgressState";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface PalaceQuizScreenProps {
    palaceId: string;
    onBack: () => void;
    onComplete: (results: QuizResults) => void;
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
                                 }: PalaceQuizScreenProps) {
    const {state, actions} = useProgressState();
    const palace = state.palaces.find((p) => p.id === palaceId);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<
        number | null
    >(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [startTime] = useState(Date.now());
    const [questions] = useState<QuizQuestion[]>(() =>
        buildQuizQuestions(palace, palaceSettings(palace).shuffleQuestions),
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
            actions.addXP(20);
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
        setTimeLeft(30);
    };

    // Skip advances without scoring (counts as not answered).
    const skipQuestion = () => {
        setShowFeedback(false);
        handleNextQuestion();
    };

    if (!palace) return null;

    return (
        <div className="h-full bg-gradient-to-b from-[#ADC8FF]/30 via-[#F8FBFF]/50 to-white flex flex-col">
            {/* Header */}
            <div className="p-6 flex items-center justify-between">
                <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    onClick={onBack}
                    className="w-12 h-12 bg-white/95 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg border border-white/40"
                >
                    <ArrowLeft className="w-5 h-5 text-[#091A7A]"/>
                </motion.button>

                <div className="flex items-center gap-2">
                    <div className="text-2xl">{palace.icon}</div>
                    <h1 className="font-semibold text-[#091A7A]">
                        {palace.name} Quiz
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    {timerEnabled && (
                        <motion.div
                            animate={{
                                scale: timeLeft <= 5 ? [1, 1.1, 1] : 1,
                                backgroundColor:
                                    timeLeft <= 5
                                        ? [
                                            "rgba(255,255,255,0.95)",
                                            "rgba(239,68,68,0.2)",
                                            "rgba(255,255,255,0.95)",
                                        ]
                                        : "rgba(255,255,255,0.95)",
                            }}
                            transition={{
                                duration: timeLeft <= 5 ? 0.5 : 0,
                                repeat: timeLeft <= 5 ? Infinity : 0,
                            }}
                            className="flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-xl rounded-full border border-white/40 shadow-md"
                        >
                            <Clock
                                className={`w-4 h-4 ${timeLeft <= 5 ? "text-red-500" : "text-[#091A7A]"}`}
                            />
                            <span
                                className={`text-sm font-medium ${timeLeft <= 5 ? "text-red-500" : "text-[#091A7A]"}`}
                            >
                                {timeLeft}s
                            </span>
                        </motion.div>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <motion.button
                                    whileTap={{scale: 0.92}}
                                    aria-label="Quiz options"
                                    className="w-12 h-12 bg-white/95 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg border border-white/40 text-[#091A7A] outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                                >
                                    <MoreVertical className="w-5 h-5"/>
                                </motion.button>
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

            {/* Progress */}
            <div className="px-6 mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            Question {currentQuestion + 1} of {questions.length}
          </span>
                    <span className="font-medium text-[#091A7A]">
            {Math.round(
                ((currentQuestion + 1) / questions.length) * 100,
            )}
                        %
          </span>
                </div>
                <div className="h-2 bg-white/60 rounded-full overflow-hidden border border-white/40">
                    <motion.div
                        initial={{width: 0}}
                        animate={{
                            width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                        }}
                        className="h-full bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] rounded-full"
                        transition={{duration: 0.3}}
                    />
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
                            <div className="flex items-center gap-2">
                                {selectedAnswer === currentQ.correctAnswer ? (
                                    <>
                                        <CheckCircle className="w-5 h-5 text-emerald-600"/>
                                        <div>
                                            <p className="font-semibold text-emerald-700">
                                                Correct! +20 XP
                                            </p>
                                            <p className="text-sm text-emerald-600">
                                                {currentQ.explanation || "Great job!"}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-5 h-5 text-red-600"/>
                                        <div>
                                            <p className="font-semibold text-red-700">
                                                Not quite
                                            </p>
                                            <p className="text-sm text-red-600">
                                                {currentQ.explanation ||
                                                    "Try again next time!"}
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
 * Build the quiz from the palace's own room questions. Falls back to the
 * sample bank only when the user hasn't authored any questions yet, so a fresh
 * palace still has something to quiz against.
 */
function buildQuizQuestions(
    palace: Palace | undefined,
    shuffleQuestions: boolean,
): QuizQuestion[] {
    const authored = (palace?.rooms || []).flatMap((room) =>
        (room.questions || []).map((q) => ({
            id: q.id,
            question: q.prompt,
            options: q.options,
            correctAnswer: q.correctAnswer,
            roomTitle: room.title,
            explanation: q.explanation,
        })),
    );
    const built =
        authored.length > 0
            ? authored
            : generateQuizQuestions(palace?.id || "default");
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

// Generate quiz questions from palace content
function generateQuizQuestions(
    palaceId: string,
): QuizQuestion[] {
    // Sample questions - in production, these would come from palace rooms
    const questionBank: Record<string, QuizQuestion[]> = {
        "solar-system": [
            {
                id: "1",
                question: "Which planet is closest to the Sun?",
                options: ["Venus", "Mercury", "Mars", "Earth"],
                correctAnswer: 1,
                roomTitle: "Inner Planets",
            },
            {
                id: "2",
                question:
                    "What is the largest planet in our solar system?",
                options: ["Saturn", "Neptune", "Jupiter", "Uranus"],
                correctAnswer: 2,
                roomTitle: "Gas Giants",
            },
            {
                id: "3",
                question: "How many planets are in our solar system?",
                options: ["7", "8", "9", "10"],
                correctAnswer: 1,
                roomTitle: "Solar System Overview",
            },
            {
                id: "4",
                question: "Which planet has the most moons?",
                options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
                correctAnswer: 1,
                roomTitle: "Moons",
            },
            {
                id: "5",
                question: "What is the smallest planet?",
                options: ["Mercury", "Mars", "Venus", "Pluto"],
                correctAnswer: 0,
                roomTitle: "Planet Sizes",
            },
        ],
        default: [
            {
                id: "1",
                question:
                    "What memory technique uses spatial visualization?",
                options: [
                    "Flashcards",
                    "Method of Loci",
                    "Repetition",
                    "Mnemonics",
                ],
                correctAnswer: 1,
                roomTitle: "Memory Techniques",
            },
            {
                id: "2",
                question:
                    "Which part of the brain is crucial for memory formation?",
                options: [
                    "Cerebellum",
                    "Hippocampus",
                    "Amygdala",
                    "Cortex",
                ],
                correctAnswer: 1,
                roomTitle: "Brain Anatomy",
            },
            {
                id: "3",
                question:
                    "How many items can working memory typically hold?",
                options: ["5-9", "10-15", "2-4", "15-20"],
                correctAnswer: 0,
                roomTitle: "Memory Capacity",
            },
        ],
    };

    return questionBank[palaceId] || questionBank["default"];
}