import {type ReactNode, useEffect, useMemo, useState} from "react";
import {AnimatePresence, motion, useReducedMotion} from "motion/react";
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Eye,
    EyeOff,
    Lightbulb,
    Pencil,
    RotateCcw,
    Settings2,
    Shuffle,
    Sparkles,
    Type as TypeIcon,
    Volume2,
} from "lucide-react";
import {type Locus, useProgressState} from "../../hooks/useProgressState";
import {usePreferences} from "../../hooks/usePreferences";
import {cancelSpeech, speak, speechAvailable} from "../../utils/speech";
import {tick} from "../../utils/haptics";
import {tapCard, tapNav, tapSmall} from "../../utils/motion";
import {
    isVerseMarker,
    normalizeWord,
    scramble,
    tokenizeWords,
    verseText,
    wordInitial,
} from "../../utils/verse";
import {KeyboardSheet} from "../ui/KeyboardSheet";
import {Input} from "../ui/input";
import {Textarea} from "../ui/textarea";

interface VerseStudyScreenProps {
    onBack: () => void;
    palaceId: string;
    roomTitle: string;
    palaceTitle?: string;
}

type VerseMode = "blur" | "words" | "initials" | "type";

const MODES: {value: VerseMode; label: string}[] = [
    {value: "blur", label: "Blur"},
    {value: "words", label: "Words"},
    {value: "initials", label: "Initials"},
    {value: "type", label: "Type"},
];

export function VerseStudyScreen({
                                     onBack,
                                     palaceId,
                                     roomTitle,
                                     palaceTitle = "Memory Palace",
                                 }: VerseStudyScreenProps) {
    const {state, actions} = useProgressState();
    const {preferences, setPreference} = usePreferences();
    const reduce = useReducedMotion();

    const palace = state.palaces.find((p) => p.id === palaceId);
    const room = (palace?.rooms || []).find((r) => r.title === roomTitle);
    const roomId = room?.id;
    const cards: Locus[] = useMemo(() => room?.loci ?? [], [room]);
    const byId = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards]);

    // Verse-study options persist across sessions (remembered everywhere).
    const mode = preferences.verseMode;
    const setMode = (m: VerseMode) => setPreference("verseMode", m);
    const shuffleVerses = preferences.verseShuffle;
    const showWordSpaces = preferences.verseWordSpaces;
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [index, setIndex] = useState(0);

    // Display order of verse ids; reshuffled when the user toggles shuffle.
    const [order, setOrder] = useState<string[]>(() => cards.map((c) => c.id));
    useEffect(() => {
        // Keep the order in sync if the deck changes (add/remove/import), and
        // honor the shuffle preference. Clamp the pointer back into range.
        const ids = cards.map((c) => c.id);
        setOrder(shuffleVerses ? scramble(ids) : ids);
        setIndex((i) => Math.min(i, Math.max(0, ids.length - 1)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cards.length, shuffleVerses]);

    const currentId = order[index];
    const current = currentId ? byId.get(currentId) : undefined;
    const canSpeak = speechAvailable();

    useEffect(() => () => cancelSpeech(), []);
    // Stop any narration when moving between verses or modes.
    useEffect(() => cancelSpeech(), [currentId, mode]);

    const go = (delta: number) => {
        setIndex((i) => Math.min(order.length - 1, Math.max(0, i + delta)));
    };

    if (cards.length === 0 || !current) {
        return (
            <div className="h-full bg-gradient-to-b from-[#ADC8FF] via-[#E8F2FF]/95 to-white flex flex-col items-center justify-center gap-5 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EAF4FF]">
                    <TypeIcon className="h-8 w-8 text-[#3D8FEF]"/>
                </div>
                <div>
                    <h2 className="mb-1 text-2xl font-bold text-[#091A7A]">No verses yet</h2>
                    <p className="mx-auto max-w-[34ch] text-[14px] text-[#475569]">
                        Add or import verses into &ldquo;{roomTitle}&rdquo; and they&rsquo;ll
                        appear here to memorize.
                    </p>
                </div>
                <motion.button
                    {...tapNav}
                    onClick={onBack}
                    className="rounded-full bg-[#091A7A] px-6 py-3 text-sm font-semibold text-white shadow-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                >
                    Back to room
                </motion.button>
            </div>
        );
    }

    const text = verseText(current);
    const reference = current.front?.trim() || "Verse";

    return (
        <div className="h-full bg-gradient-to-b from-[#ADC8FF] via-[#E8F2FF]/95 to-white flex flex-col">
            {/* Header */}
            <div className="px-6 pt-6 pb-3">
                <div className="flex items-center justify-between mb-4">
                    <motion.button
                        {...tapNav}
                        onClick={onBack}
                        aria-label="Go back"
                        className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-card border border-white/40 text-[#091A7A]"
                    >
                        <ArrowLeft className="w-5 h-5"/>
                    </motion.button>

                    <div className="flex-1 mx-4 text-center min-w-0">
                        <h1 className="text-section-header text-[#091A7A] font-semibold line-clamp-1">
                            {roomTitle}
                        </h1>
                        <p className="text-[12px] text-[#475569] line-clamp-1">{palaceTitle}</p>
                    </div>

                    <motion.button
                        {...tapNav}
                        onClick={() => setSettingsOpen(true)}
                        aria-label="Verse settings"
                        className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-card border border-white/40 text-[#091A7A]"
                    >
                        <Settings2 className="w-5 h-5"/>
                    </motion.button>
                </div>

                <ModeTabs value={mode} onChange={setMode}/>
            </div>

            {/* Verse card */}
            <div className="flex-1 min-h-0 px-6 pb-3 flex flex-col">
                <div className="relative flex-1 min-h-0 rounded-3xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-elevated flex flex-col overflow-hidden">
                    {/* Reference + counter + tools */}
                    <div className="flex items-center justify-between gap-2 px-5 pt-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF4FF] px-3 py-1.5 text-[12px] font-bold text-[#1E5FBF] min-w-0">
                            <span className="truncate">{reference}</span>
                        </span>
                        {current.memorized && (
                            <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">
                                <Check size={12} strokeWidth={3}/>
                                Memorized
                            </span>
                        )}
                    </div>

                    {/* Mode panel — keyed so state resets on verse / mode change */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${mode}-${currentId}`}
                            initial={reduce ? {opacity: 0} : {opacity: 0, y: 8}}
                            animate={{opacity: 1, y: 0}}
                            exit={reduce ? {opacity: 0} : {opacity: 0, y: -8}}
                            transition={{duration: 0.2}}
                            className="flex-1 min-h-0 flex flex-col"
                        >
                            {mode === "blur" && <BlurMode text={text}/>}
                            {mode === "words" && (
                                <WordsMode text={text} reduce={!!reduce}/>
                            )}
                            {mode === "initials" && (
                                <InitialsMode text={text} showWordSpaces={showWordSpaces}/>
                            )}
                            {mode === "type" && <TypeMode text={text}/>}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Tools + navigation */}
            <div className="px-6 pb-7 pt-1 space-y-3">
                <div className="flex items-center justify-center gap-2">
                    <ToolPill
                        onClick={() => {
                            if (roomId) actions.toggleLocusMemorized(palaceId, roomId, current.id);
                            tick();
                        }}
                        active={!!current.memorized}
                        icon={
                            current.memorized ? (
                                <CheckCircle2 className="w-4 h-4"/>
                            ) : (
                                <Check className="w-4 h-4"/>
                            )
                        }
                        label={current.memorized ? "Memorized" : "Mark memorized"}
                    />
                    {canSpeak && (
                        <ToolPill
                            onClick={() => speak(text)}
                            icon={<Volume2 className="w-4 h-4"/>}
                            label="Listen"
                        />
                    )}
                    <ToolPill
                        onClick={() => setEditing(true)}
                        icon={<Pencil className="w-4 h-4"/>}
                        label="Edit"
                    />
                </div>

                <div className="flex items-center justify-center gap-4">
                    <motion.button
                        {...tapNav}
                        onClick={() => go(-1)}
                        disabled={index === 0}
                        aria-label="Previous verse"
                        className={`w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-card border ${
                            index === 0
                                ? "bg-gray-100 border-gray-200 text-gray-400"
                                : "bg-white border-white/40 text-[#091A7A]"
                        }`}
                    >
                        <ChevronLeft className="w-6 h-6"/>
                    </motion.button>
                    <span className="text-subheading font-semibold text-[#091A7A] min-w-[64px] text-center tabular-nums">
                        {index + 1} / {order.length}
                    </span>
                    <motion.button
                        {...tapNav}
                        onClick={() => go(1)}
                        disabled={index >= order.length - 1}
                        aria-label="Next verse"
                        className={`w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-card border ${
                            index >= order.length - 1
                                ? "bg-gray-100 border-gray-200 text-gray-400"
                                : "bg-white border-white/40 text-[#091A7A]"
                        }`}
                    >
                        <ChevronRight className="w-6 h-6"/>
                    </motion.button>
                </div>
            </div>

            <VerseSettingsSheet
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                showWordSpaces={showWordSpaces}
                shuffleVerses={shuffleVerses}
                onShowWordSpaces={(v) => setPreference("verseWordSpaces", v)}
                onShuffleVerses={(v) => setPreference("verseShuffle", v)}
                onEditVerse={() => {
                    setSettingsOpen(false);
                    setEditing(true);
                }}
            />

            {roomId && (
                <VerseEditor
                    open={editing}
                    locus={current}
                    onClose={() => setEditing(false)}
                    onSave={(data) => {
                        actions.updateLocus(palaceId, roomId, current.id, data);
                        setEditing(false);
                    }}
                />
            )}
        </div>
    );
}

// --- Mode tabs --------------------------------------------------------------

function ModeTabs({
                      value,
                      onChange,
                  }: {
    value: VerseMode;
    onChange: (mode: VerseMode) => void;
}) {
    return (
        <div className="relative flex items-center gap-1 rounded-2xl bg-[#091A7A]/[0.06] p-1">
            {MODES.map((m) => {
                const active = m.value === value;
                return (
                    <button
                        key={m.value}
                        onClick={() => onChange(m.value)}
                        aria-pressed={active}
                        className="relative flex-1 rounded-xl px-2 py-2.5 text-[13px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                    >
                        {active && (
                            <motion.span
                                layoutId="verseModePill"
                                className="absolute inset-0 rounded-xl bg-white shadow-[0_4px_12px_rgba(9,26,122,0.12)]"
                                transition={{type: "spring", stiffness: 420, damping: 34}}
                            />
                        )}
                        <span
                            className={`relative z-10 ${active ? "text-[#091A7A]" : "text-[#64748b]"}`}
                        >
                            {m.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

// --- Blur mode --------------------------------------------------------------

function BlurMode({text}: {text: string}) {
    const tokens = useMemo(() => tokenizeWords(text), [text]);
    // Verse markers stay visible as anchors; the rest can be hidden.
    const hideable = useMemo(
        () => tokens.map((_, i) => i).filter((i) => !isVerseMarker(tokens[i])),
        [tokens],
    );
    // A stable random order in which words disappear as you tap "Blur".
    const order = useMemo(() => scramble(hideable), [hideable]);
    const step = Math.max(1, Math.round(order.length * 0.25));
    const [hiddenCount, setHiddenCount] = useState(0);
    const hidden = useMemo(
        () => new Set(order.slice(0, hiddenCount)),
        [order, hiddenCount],
    );

    return (
        <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
                <div className="min-h-full flex items-center justify-center px-6 py-6">
                <p className="w-full flex flex-wrap items-baseline justify-center gap-x-2 gap-y-2 text-[clamp(17px,4.6vw,22px)] font-semibold leading-relaxed text-[#091A7A]">
                    {tokens.map((token, i) => {
                        if (isVerseMarker(token)) {
                            return (
                                <span key={i} className="font-bold text-[#1E5FBF]">
                                    {token}
                                </span>
                            );
                        }
                        if (hidden.has(i)) {
                            return (
                                <span
                                    key={i}
                                    aria-hidden
                                    className="inline-block border-b-2 border-[#091A7A]/35 align-baseline"
                                    style={{width: `${Math.min(Math.max(token.length, 1), 18)}ch`}}
                                />
                            );
                        }
                        return (
                            <span key={i} className="whitespace-nowrap">
                                {token}
                            </span>
                        );
                    })}
                </p>
                </div>
            </div>
            <div className="flex items-center gap-2.5 px-5 pb-5">
                <motion.button
                    {...tapCard}
                    onClick={() => setHiddenCount((c) => Math.min(order.length, c + step))}
                    disabled={hiddenCount >= order.length}
                    className={`flex-1 rounded-2xl py-3.5 font-semibold flex items-center justify-center gap-2 transition-colors ${
                        hiddenCount >= order.length
                            ? "bg-[#E2E8F0] text-[#94a3b8]"
                            : "bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] text-white shadow-interactive"
                    }`}
                >
                    <EyeOff className="w-5 h-5"/>
                    Blur
                </motion.button>
                <motion.button
                    {...tapCard}
                    onClick={() => setHiddenCount((c) => Math.max(0, c - step))}
                    disabled={hiddenCount <= 0}
                    className={`flex-1 rounded-2xl py-3.5 font-semibold flex items-center justify-center gap-2 transition-colors ${
                        hiddenCount <= 0
                            ? "bg-[#E2E8F0] text-[#94a3b8]"
                            : "bg-[#EAF4FF] text-[#091A7A]"
                    }`}
                >
                    <Eye className="w-5 h-5"/>
                    Show
                </motion.button>
            </div>
        </div>
    );
}

// --- Words mode -------------------------------------------------------------

interface WordChip {
    /** Original position in the verse (the order to tap in). */
    pos: number;
    word: string;
    /** Stable key so duplicate words don't collide. */
    key: string;
}

function WordsMode({text, reduce}: {text: string; reduce: boolean}) {
    const words = useMemo(() => tokenizeWords(text), [text]);
    const chips = useMemo<WordChip[]>(
        () =>
            scramble(
                words.map((word, pos) => ({pos, word, key: `${pos}-${word}`})),
            ),
        [words],
    );
    const [placed, setPlaced] = useState(0);
    const [wrongKey, setWrongKey] = useState<string | null>(null);
    const done = placed >= words.length;

    const tapChip = (chip: WordChip) => {
        if (chip.pos === placed) {
            setPlaced((p) => p + 1);
            setWrongKey(null);
            tick();
        } else {
            setWrongKey(chip.key);
            window.setTimeout(() => setWrongKey((k) => (k === chip.key ? null : k)), 450);
        }
    };

    return (
        <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-5 py-4">
                {/* Built-so-far line */}
                <p className="min-h-[44px] text-center text-[clamp(16px,4.6vw,21px)] font-semibold leading-relaxed text-[#091A7A] text-balance">
                    {placed === 0 ? (
                        <span className="text-[14px] font-medium text-[#64748b]">
                            Tap the first word below.
                        </span>
                    ) : (
                        words.slice(0, placed).join(" ")
                    )}
                </p>

                {done ? (
                    <div className="mt-6 flex flex-col items-center gap-2 text-center">
                        <Sparkles className="h-7 w-7 text-[#FFC71E]"/>
                        <p className="text-[15px] font-semibold text-[#091A7A]">Verse rebuilt</p>
                    </div>
                ) : (
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {chips.map((chip) => {
                            const used = chip.pos < placed;
                            const isWrong = wrongKey === chip.key;
                            return (
                                <motion.button
                                    key={chip.key}
                                    onClick={() => !used && tapChip(chip)}
                                    disabled={used}
                                    animate={
                                        isWrong && !reduce
                                            ? {x: [0, -6, 6, -4, 4, 0]}
                                            : {x: 0}
                                    }
                                    transition={{duration: 0.4}}
                                    className={`rounded-full px-3.5 py-2 text-[15px] font-semibold transition-colors ${
                                        used
                                            ? "bg-[#EAF4FF] text-[#9db8e6] opacity-40"
                                            : isWrong
                                                ? "bg-red-50 text-red-600 ring-2 ring-red-300"
                                                : "bg-[#F1F5F9] text-[#091A7A] active:bg-[#EAF4FF]"
                                    }`}
                                >
                                    {chip.word}
                                </motion.button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2.5 px-5 pb-5">
                <button
                    onClick={() => {
                        setPlaced(0);
                        setWrongKey(null);
                    }}
                    className="flex-1 rounded-2xl bg-[#EAF4FF] py-3 font-semibold text-[#091A7A] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                    <RotateCcw size={17}/>
                    Start over
                </button>
                <button
                    onClick={() => {
                        if (!done) {
                            setPlaced((p) => Math.min(words.length, p + 1));
                            tick();
                        }
                    }}
                    disabled={done}
                    className={`flex-1 rounded-2xl py-3 font-semibold flex items-center justify-center gap-2 transition-transform active:scale-[0.98] ${
                        done
                            ? "bg-[#E2E8F0] text-[#94a3b8]"
                            : "bg-[#FFF7E0] text-[#B8860B]"
                    }`}
                >
                    <Lightbulb size={17}/>
                    Hint
                </button>
            </div>
        </div>
    );
}

// --- Initials mode ----------------------------------------------------------

function InitialsMode({
                          text,
                          showWordSpaces,
                      }: {
    text: string;
    showWordSpaces: boolean;
}) {
    const tokens = useMemo(() => tokenizeWords(text), [text]);
    const [revealed, setRevealed] = useState(false);

    return (
        <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
                <div className="min-h-full flex items-center justify-center px-6 py-6">
                {revealed ? (
                    <p className="text-center text-[clamp(16px,4.4vw,21px)] font-medium leading-relaxed text-[#091A7A] text-balance">
                        {text}
                    </p>
                ) : (
                    <p
                        className={`w-full flex flex-wrap items-baseline justify-center gap-y-2.5 text-[clamp(17px,4.6vw,22px)] font-semibold text-[#091A7A] ${
                            showWordSpaces ? "gap-x-3" : "gap-x-0"
                        }`}
                    >
                        {tokens.map((token, i) => {
                            if (isVerseMarker(token)) {
                                return (
                                    <span key={i} className="font-bold text-[#1E5FBF]">
                                        {token}
                                    </span>
                                );
                            }
                            const {lead, initial, hidden, trail} = wordInitial(token);
                            return (
                                <span key={i} className="whitespace-nowrap">
                                    {lead}
                                    <span className="font-bold">{initial}</span>
                                    {hidden > 0 && (
                                        <span
                                            aria-hidden
                                            className="ml-0.5 inline-block border-b-2 border-[#091A7A]/40 align-baseline"
                                            style={{width: `${Math.min(Math.max(hidden, 1), 16)}ch`}}
                                        />
                                    )}
                                    {trail}
                                </span>
                            );
                        })}
                    </p>
                )}
                </div>
            </div>
            <div className="px-5 pb-5">
                <motion.button
                    {...tapCard}
                    onClick={() => setRevealed((r) => !r)}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] py-3.5 font-semibold text-white shadow-interactive flex items-center justify-center gap-2"
                >
                    {revealed ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                    {revealed ? "Hide verse text" : "Show verse text"}
                </motion.button>
            </div>
        </div>
    );
}

// --- Type mode --------------------------------------------------------------

function TypeMode({text}: {text: string}) {
    const expected = useMemo(() => tokenizeWords(text), [text]);
    const [value, setValue] = useState("");
    const [revealed, setRevealed] = useState(false);

    const typed = tokenizeWords(value);
    const statuses = expected.map((word, i) =>
        i < typed.length
            ? normalizeWord(typed[i]) === normalizeWord(word)
                ? "correct"
                : "wrong"
            : "pending",
    );
    const correct = statuses.filter((s) => s === "correct").length;
    const complete =
        typed.length >= expected.length && statuses.every((s) => s === "correct");

    return (
        <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-5 py-4 space-y-3">
                <Textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Start typing the verse here…"
                    rows={4}
                    className="w-full bg-[#F4F8FF] rounded-2xl px-4 py-3 text-[16px] text-[#091A7A] placeholder:text-[#091A7A]/40 outline-none border-2 border-transparent focus:border-[#4F8EFF]/60 focus:bg-white transition-all resize-none"
                />

                <div className="rounded-2xl bg-[#F8FAFF] border border-[#091A7A]/[0.06] px-4 py-3">
                    <div className="mb-1.5 flex items-center justify-between">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">
                            Feedback
                        </p>
                        <span className="text-[12px] font-bold text-[#091A7A] tabular-nums">
                            {correct} / {expected.length}
                        </span>
                    </div>
                    {complete ? (
                        <p className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-emerald-600">
                            <Sparkles size={16}/>
                            Word-perfect.
                        </p>
                    ) : revealed ? (
                        <p className="text-[15px] font-medium leading-relaxed text-[#091A7A]">
                            {text}
                        </p>
                    ) : typed.length === 0 ? (
                        <p className="text-[13px] text-[#64748b]">
                            Type from memory; each word turns green when it&rsquo;s right.
                        </p>
                    ) : (
                        <p className="text-[15px] font-medium leading-relaxed flex flex-wrap gap-x-1.5 gap-y-1">
                            {typed.map((word, i) => (
                                <span
                                    key={i}
                                    className={
                                        statuses[i] === "correct"
                                            ? "text-emerald-600"
                                            : "text-red-500 line-through decoration-red-300"
                                    }
                                >
                                    {word}
                                </span>
                            ))}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2.5 px-5 pb-5">
                <button
                    onClick={() => {
                        setValue("");
                        setRevealed(false);
                    }}
                    className="flex-1 rounded-2xl bg-[#EAF4FF] py-3 font-semibold text-[#091A7A] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                    <RotateCcw size={17}/>
                    Start over
                </button>
                <button
                    onClick={() => setRevealed((r) => !r)}
                    className="flex-1 rounded-2xl bg-white border border-[#091A7A]/12 py-3 font-semibold text-[#091A7A] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                    {revealed ? <EyeOff size={17}/> : <Eye size={17}/>}
                    {revealed ? "Hide verse" : "Show verse"}
                </button>
            </div>
        </div>
    );
}

// --- Shared tool pill -------------------------------------------------------

function ToolPill({
                      icon,
                      label,
                      onClick,
                      active,
                  }: {
    icon: ReactNode;
    label: string;
    onClick: () => void;
    active?: boolean;
}) {
    return (
        <motion.button
            {...tapSmall}
            onClick={onClick}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold border transition-colors ${
                active
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-white/90 border-white/60 text-[#091A7A]"
            }`}
        >
            {icon}
            {label}
        </motion.button>
    );
}

// --- Settings sheet ---------------------------------------------------------

function VerseSettingsSheet({
                                open,
                                onClose,
                                showWordSpaces,
                                shuffleVerses,
                                onShowWordSpaces,
                                onShuffleVerses,
                                onEditVerse,
                            }: {
    open: boolean;
    onClose: () => void;
    showWordSpaces: boolean;
    shuffleVerses: boolean;
    onShowWordSpaces: (value: boolean) => void;
    onShuffleVerses: (value: boolean) => void;
    onEditVerse: () => void;
}) {
    return (
        <KeyboardSheet open={open} onClose={onClose} title="Verse settings">
            <div className="space-y-2.5">
                <SettingToggle
                    icon={<TypeIcon size={18}/>}
                    label="Show word spaces"
                    description="Keep gaps between words in the Initials view."
                    checked={showWordSpaces}
                    onChange={onShowWordSpaces}
                />
                <SettingToggle
                    icon={<Shuffle size={18}/>}
                    label="Shuffle verses"
                    description="Practise the verses in a random order."
                    checked={shuffleVerses}
                    onChange={onShuffleVerses}
                />
                <button
                    onClick={onEditVerse}
                    className="flex w-full items-center gap-3.5 rounded-2xl bg-[#F4F8FF] px-4 py-3.5 text-left active:scale-[0.99] transition-transform"
                >
                    <span className="text-[#091A7A]">
                        <Pencil size={18}/>
                    </span>
                    <span className="flex-1">
                        <span className="block text-[14px] font-semibold text-[#091A7A]">
                            Edit verse
                        </span>
                        <span className="mt-0.5 block text-[12px] leading-snug text-[#475569]">
                            Fix the reference or wording of this verse.
                        </span>
                    </span>
                    <ChevronRight className="w-5 h-5 text-[#94a3b8]"/>
                </button>
            </div>
        </KeyboardSheet>
    );
}

function SettingToggle({
                           icon,
                           label,
                           description,
                           checked,
                           onChange,
                       }: {
    icon: ReactNode;
    label: string;
    description: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <button
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={() => onChange(!checked)}
            className="flex w-full items-center justify-between gap-3 rounded-2xl bg-[#F4F8FF] px-4 py-3 text-left transition-transform active:scale-[0.99]"
        >
            <span className="flex min-w-0 items-center gap-3">
                <span className="text-[#091A7A]">{icon}</span>
                <span className="min-w-0">
                    <span className="block text-[14px] font-semibold text-[#091A7A]">{label}</span>
                    <span className="mt-0.5 block text-[12px] leading-snug text-[#475569]">
                        {description}
                    </span>
                </span>
            </span>
            <span
                className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors ${
                    checked ? "bg-[#091A7A]" : "bg-[#CBD5E1]"
                }`}
            >
                <span
                    className={`absolute top-0.5 block h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                        checked ? "translate-x-[22px]" : "translate-x-0.5"
                    }`}
                />
            </span>
        </button>
    );
}

// --- Verse editor -----------------------------------------------------------

const verseField =
    "w-full bg-[#F4F8FF] rounded-xl text-[15px] text-[#091A7A] placeholder:text-[#091A7A]/40 outline-none border-2 border-transparent focus:border-[#4F8EFF]/60 focus:bg-white transition-all";

function VerseEditor({
                         open,
                         locus,
                         onClose,
                         onSave,
                     }: {
    open: boolean;
    locus: Locus;
    onClose: () => void;
    onSave: (data: Omit<Locus, "id" | "srs" | "flagged" | "memorized">) => void;
}) {
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");

    useEffect(() => {
        if (open) {
            setFront(locus.front);
            setBack(locus.back);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, locus.id]);

    const valid = front.trim().length > 0 && back.trim().length > 0;

    return (
        <KeyboardSheet
            open={open}
            onClose={onClose}
            title="Edit verse"
            footer={
                <button
                    onClick={() => valid && onSave({front: front.trim(), back: back.trim()})}
                    disabled={!valid}
                    className={`w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                        valid
                            ? "bg-[#091A7A] text-white shadow-[0_8px_20px_rgba(9,26,122,0.25)] active:scale-[0.98]"
                            : "bg-[#E2E8F0] text-[#94a3b8] cursor-not-allowed"
                    }`}
                >
                    <Check size={18}/>
                    Save verse
                </button>
            }
        >
            <div>
                <label className="block text-[13px] font-semibold text-[#091A7A] mb-1.5">
                    Reference
                </label>
                <Input
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    placeholder="e.g., John 15:1"
                    enterKeyHint="next"
                    className={`${verseField} px-4 h-12`}
                />
            </div>
            <div>
                <label className="block text-[13px] font-semibold text-[#091A7A] mb-1.5">
                    Verse text
                </label>
                <Textarea
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                    placeholder="The full text of the verse."
                    rows={5}
                    className={`${verseField} px-4 py-3 resize-none`}
                />
            </div>
        </KeyboardSheet>
    );
}
