import {type ChangeEvent, useMemo, useRef, useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {
    ArrowLeft,
    Check,
    ChevronDown,
    ChevronUp,
    Copy,
    DownloadCloud,
    FileUp,
    HelpCircle,
    Lightbulb,
    MapPin,
    MoreVertical,
    Pencil,
    Plus,
    Trash2,
    UploadCloud,
    X,
} from "lucide-react";
import {toast} from "sonner";
import {StatusBar} from "../ui/StatusBar";
import {
    type Locus,
    type Question,
    useProgressState,
} from "../../hooks/useProgressState";
import {Input} from "../ui/input";
import {Textarea} from "../ui/textarea";
import {EmptyState} from "../ui/EmptyState";
import {Tabs, TabsList, TabsTrigger} from "../ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import {Dialog, DialogContent, DialogTitle} from "../ui/dialog";
import {
    ContentImportError,
    exportLociCSV,
    exportQuestionsCSV,
    exportRoomContentJSON,
    importContentFile,
} from "../../utils/contentUtils";

interface RoomContentScreenProps {
    palaceId: string;
    roomId: string;
    onBack: () => void;
}

type Tab = "loci" | "questions";
type Editor =
    | {kind: "locus"; locus: Locus | null}
    | {kind: "question"; question: Question | null}
    | null;

const navyField =
    "w-full bg-[#F4F8FF] rounded-xl text-[15px] text-[#091A7A] placeholder:text-[#091A7A]/40 outline-none border-2 border-transparent focus:border-[#4F8EFF]/60 focus:bg-white transition-all";

export function RoomContentScreen({
                                      palaceId,
                                      roomId,
                                      onBack,
                                  }: RoomContentScreenProps) {
    const {state, actions} = useProgressState();
    const palace = state.palaces.find((p) => p.id === palaceId);
    const room = palace?.rooms?.find((r) => r.id === roomId);

    const [tab, setTab] = useState<Tab>("loci");
    const [editor, setEditor] = useState<Editor>(null);
    const [pendingDelete, setPendingDelete] = useState<
        {kind: Tab; id: string} | null
    >(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loci = useMemo(() => room?.loci ?? [], [room]);
    const questions = useMemo(() => room?.questions ?? [], [room]);

    if (!palace || !room) {
        return (
            <div className="h-full flex items-center justify-center bg-[#091A7A]">
                <p className="text-white text-[15px]">Room not found</p>
            </div>
        );
    }

    const handleImportClick = () => fileInputRef.current?.click();

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const content = await importContentFile(file);
                const {loci: lociCount, questions: qCount} =
                    actions.importRoomContent(palaceId, roomId, content, "merge");
                const parts = [
                    lociCount > 0 &&
                        `${lociCount} ${lociCount === 1 ? "locus" : "loci"}`,
                    qCount > 0 &&
                        `${qCount} question${qCount === 1 ? "" : "s"}`,
                ].filter(Boolean);
                toast.success(`Imported ${parts.join(" and ")}`);
                if (lociCount > 0 && qCount === 0) setTab("loci");
                if (qCount > 0 && lociCount === 0) setTab("questions");
            } catch (error) {
                toast.error(
                    error instanceof ContentImportError
                        ? error.message
                        : "Couldn't import that file.",
                );
            }
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleExportJSON = () => {
        if (loci.length === 0 && questions.length === 0) {
            toast.warning("Nothing to export yet");
            return;
        }
        exportRoomContentJSON(room.title, {loci, questions});
        toast.success("Exported as JSON");
    };

    const handleExportCSV = () => {
        if (tab === "loci") {
            if (loci.length === 0) {
                toast.warning("No loci to export");
                return;
            }
            exportLociCSV(room.title, loci);
        } else {
            if (questions.length === 0) {
                toast.warning("No questions to export");
                return;
            }
            exportQuestionsCSV(room.title, questions);
        }
        toast.success("Exported as CSV");
    };

    const confirmDelete = () => {
        if (!pendingDelete) return;
        if (pendingDelete.kind === "loci") {
            actions.deleteLocus(palaceId, roomId, pendingDelete.id);
            toast.success("Locus deleted");
        } else {
            actions.deleteQuestion(palaceId, roomId, pendingDelete.id);
            toast.success("Question deleted");
        }
        setPendingDelete(null);
    };

    const count = tab === "loci" ? loci.length : questions.length;

    return (
        <div className="size-full flex flex-col relative bg-[#091A7A]">
            <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-b from-[#091A7A] to-[#3D6FE0] relative flex-shrink-0 pb-5 pt-2">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.12),transparent_55%)]"/>
                    <div className="relative z-10">
                        <StatusBar textColor="white"/>
                    </div>
                    <div className="px-5 relative z-10">
                        <div className="flex items-center justify-between mb-4 mt-3">
                            <motion.button
                                whileTap={{scale: 0.92}}
                                aria-label="Go back"
                                onClick={onBack}
                                className="w-11 h-11 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                            >
                                <ArrowLeft className="w-5 h-5"/>
                            </motion.button>

                            <ContentMenu
                                onImport={handleImportClick}
                                onExportJSON={handleExportJSON}
                                onExportCSV={handleExportCSV}
                                csvLabel={
                                    tab === "loci"
                                        ? "Export loci (CSV)"
                                        : "Export questions (CSV)"
                                }
                            />
                        </div>

                        <div className="mb-4">
                            <p className="text-[13px] font-medium text-white/70 mb-0.5">
                                {palace.name}
                            </p>
                            <h1 className="text-[24px] font-bold text-white leading-tight text-balance">
                                {room.title}
                            </h1>
                        </div>

                        {/* Tabs */}
                        <Tabs
                            value={tab}
                            onValueChange={(v) => setTab(v as Tab)}
                            className="w-full"
                        >
                            <TabsList className="grid w-full grid-cols-2 bg-white/15 backdrop-blur-md rounded-[14px] p-1 h-11 group-data-horizontal/tabs:h-11">
                                <TabsTrigger
                                    value="loci"
                                    className="rounded-[10px] text-[14px] font-semibold text-white/75 hover:text-white data-active:bg-white data-active:text-[#091A7A]"
                                >
                                    <MapPin size={16} strokeWidth={2.4}/>
                                    Loci
                                    <span className="ml-1 text-[12px] opacity-70">
                                        {loci.length}
                                    </span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="questions"
                                    className="rounded-[10px] text-[14px] font-semibold text-white/75 hover:text-white data-active:bg-white data-active:text-[#091A7A]"
                                >
                                    <HelpCircle size={16} strokeWidth={2.4}/>
                                    Questions
                                    <span className="ml-1 text-[12px] opacity-70">
                                        {questions.length}
                                    </span>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#EEF4FF] px-5 pt-5 pb-[120px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={tab}
                            initial={{opacity: 0, y: 8}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -8}}
                            transition={{duration: 0.2}}
                            className="space-y-3"
                        >
                            {tab === "loci" &&
                                (loci.length === 0 ? (
                                    <EmptyState
                                        icon={<MapPin className="w-7 h-7"/>}
                                        title="No loci yet"
                                        description="Each locus is a spot in this room. Add what to recall, what it means, and the vivid image to picture there."
                                        action={
                                            <ImportOrAddButtons
                                                addLabel="Add a locus"
                                                onAdd={() =>
                                                    setEditor({kind: "locus", locus: null})
                                                }
                                                onImport={handleImportClick}
                                            />
                                        }
                                    />
                                ) : (
                                    loci.map((locus, i) => (
                                        <LocusRow
                                            key={locus.id}
                                            locus={locus}
                                            index={i}
                                            canMoveUp={i > 0}
                                            canMoveDown={i < loci.length - 1}
                                            onEdit={() =>
                                                setEditor({kind: "locus", locus})
                                            }
                                            onDuplicate={() => {
                                                actions.duplicateLocus(palaceId, roomId, locus.id);
                                                toast.success("Locus duplicated");
                                            }}
                                            onMove={(dir) =>
                                                actions.moveLocus(palaceId, roomId, locus.id, dir)
                                            }
                                            onDelete={() =>
                                                setPendingDelete({
                                                    kind: "loci",
                                                    id: locus.id,
                                                })
                                            }
                                        />
                                    ))
                                ))}

                            {tab === "questions" &&
                                (questions.length === 0 ? (
                                    <EmptyState
                                        icon={<HelpCircle className="w-7 h-7"/>}
                                        title="No questions yet"
                                        description="Write multiple-choice questions to test recall. These power this palace's quiz."
                                        action={
                                            <ImportOrAddButtons
                                                addLabel="Add a question"
                                                onAdd={() =>
                                                    setEditor({
                                                        kind: "question",
                                                        question: null,
                                                    })
                                                }
                                                onImport={handleImportClick}
                                            />
                                        }
                                    />
                                ) : (
                                    questions.map((q, i) => (
                                        <QuestionRow
                                            key={q.id}
                                            question={q}
                                            index={i}
                                            canMoveUp={i > 0}
                                            canMoveDown={i < questions.length - 1}
                                            onEdit={() =>
                                                setEditor({
                                                    kind: "question",
                                                    question: q,
                                                })
                                            }
                                            onDuplicate={() => {
                                                actions.duplicateQuestion(palaceId, roomId, q.id);
                                                toast.success("Question duplicated");
                                            }}
                                            onMove={(dir) =>
                                                actions.moveQuestion(palaceId, roomId, q.id, dir)
                                            }
                                            onDelete={() =>
                                                setPendingDelete({
                                                    kind: "questions",
                                                    id: q.id,
                                                })
                                            }
                                        />
                                    ))
                                ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Add button (only when the list has items; empty state has its own) */}
                {count > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#EEF4FF] via-[#EEF4FF]/95 to-transparent pointer-events-none">
                        <motion.button
                            whileTap={{scale: 0.98}}
                            onClick={() =>
                                setEditor(
                                    tab === "loci"
                                        ? {kind: "locus", locus: null}
                                        : {kind: "question", question: null},
                                )
                            }
                            className="pointer-events-auto w-full py-4 bg-[#091A7A] text-white rounded-2xl font-semibold shadow-[0_12px_28px_rgba(9,26,122,0.30)] flex items-center justify-center gap-2"
                        >
                            <Plus size={20}/>
                            {tab === "loci" ? "Add locus" : "Add question"}
                        </motion.button>
                    </div>
                )}
            </div>

            {/* Editors */}
            <Dialog
                open={editor?.kind === "locus"}
                onOpenChange={(o) => !o && setEditor(null)}
            >
                <DialogContent
                    showCloseButton={false}
                    className="max-w-[400px] rounded-3xl p-0 overflow-hidden gap-0 bg-white"
                >
                    <DialogTitle className="sr-only">
                        {editor?.kind === "locus" && editor.locus
                            ? "Edit locus"
                            : "New locus"}
                    </DialogTitle>
                    {editor?.kind === "locus" && (
                        <LocusEditor
                            initial={editor.locus}
                            onCancel={() => setEditor(null)}
                            onSave={(data) => {
                                if (editor.locus) {
                                    actions.updateLocus(
                                        palaceId,
                                        roomId,
                                        editor.locus.id,
                                        data,
                                    );
                                    toast.success("Locus updated");
                                } else {
                                    actions.createLocus(palaceId, roomId, data);
                                    toast.success("Locus added");
                                }
                                setEditor(null);
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Dialog
                open={editor?.kind === "question"}
                onOpenChange={(o) => !o && setEditor(null)}
            >
                <DialogContent
                    showCloseButton={false}
                    className="max-w-[420px] rounded-3xl p-0 overflow-hidden gap-0 bg-white"
                >
                    <DialogTitle className="sr-only">
                        {editor?.kind === "question" && editor.question
                            ? "Edit question"
                            : "New question"}
                    </DialogTitle>
                    {editor?.kind === "question" && (
                        <QuestionEditor
                            initial={editor.question}
                            onCancel={() => setEditor(null)}
                            onSave={(data) => {
                                if (editor.question) {
                                    actions.updateQuestion(
                                        palaceId,
                                        roomId,
                                        editor.question.id,
                                        data,
                                    );
                                    toast.success("Question updated");
                                } else {
                                    actions.createQuestion(palaceId, roomId, data);
                                    toast.success("Question added");
                                }
                                setEditor(null);
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete confirm */}
            <AlertDialog
                open={!!pendingDelete}
                onOpenChange={(o) => !o && setPendingDelete(null)}
            >
                <AlertDialogContent className="sm:max-w-[360px] rounded-3xl!">
                    <AlertDialogHeader>
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Trash2 size={26} className="text-red-600"/>
                        </div>
                        <AlertDialogTitle className="text-center text-[#091A7A] text-lg">
                            Delete this{" "}
                            {pendingDelete?.kind === "loci" ? "locus" : "question"}
                            ?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-[#475569]">
                            This can't be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-3 sm:justify-center mt-2">
                        <AlertDialogCancel className="flex-1 py-3.5 h-auto border-none bg-[#EAF4FF] hover:bg-[#dcebff] text-[#091A7A] font-semibold rounded-2xl">
                            Keep
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                confirmDelete();
                            }}
                            className="flex-1 py-3.5 h-auto bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json,.csv"
                onChange={handleFileChange}
            />
        </div>
    );
}

// --- Header menu ------------------------------------------------------------

function ContentMenu({
                         onImport,
                         onExportJSON,
                         onExportCSV,
                         csvLabel,
                     }: {
    onImport: () => void;
    onExportJSON: () => void;
    onExportCSV: () => void;
    csvLabel: string;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <motion.button
                        whileTap={{scale: 0.92}}
                        aria-label="Import or export"
                        className="h-11 px-4 bg-white/15 backdrop-blur-md rounded-full flex items-center gap-2 text-white text-[14px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                        <FileUp size={17} strokeWidth={2.4}/>
                        Import / Export
                    </motion.button>
                }
            />
            <DropdownMenuContent align="end" className="w-[220px] rounded-[16px] p-1.5">
                <DropdownMenuItem
                    onClick={onImport}
                    className="rounded-[10px] px-3 py-2.5 cursor-pointer flex items-center gap-3"
                >
                    <UploadCloud size={17} className="text-[#091A7A]"/>
                    <span className="text-[14px] font-medium text-[#2C2C2C]">
                        Import file (.json / .csv)
                    </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                    onClick={onExportJSON}
                    className="rounded-[10px] px-3 py-2.5 cursor-pointer flex items-center gap-3"
                >
                    <DownloadCloud size={17} className="text-[#091A7A]"/>
                    <span className="text-[14px] font-medium text-[#2C2C2C]">
                        Export all (JSON)
                    </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={onExportCSV}
                    className="rounded-[10px] px-3 py-2.5 cursor-pointer flex items-center gap-3"
                >
                    <DownloadCloud size={17} className="text-[#091A7A]"/>
                    <span className="text-[14px] font-medium text-[#2C2C2C]">
                        {csvLabel}
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function ImportOrAddButtons({
                                addLabel,
                                onAdd,
                                onImport,
                            }: {
    addLabel: string;
    onAdd: () => void;
    onImport: () => void;
}) {
    return (
        <div className="flex flex-col items-center gap-3">
            <button
                onClick={onAdd}
                className="inline-flex items-center gap-2 rounded-full bg-[#091A7A] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(9,26,122,0.22)]"
            >
                <Plus className="h-4 w-4"/>
                {addLabel}
            </button>
            <button
                onClick={onImport}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#091A7A] border border-[#091A7A]/12"
            >
                <UploadCloud className="h-4 w-4"/>
                Import a file
            </button>
        </div>
    );
}

// --- List rows --------------------------------------------------------------

interface RowControls {
    canMoveUp: boolean;
    canMoveDown: boolean;
    onEdit: () => void;
    onDuplicate: () => void;
    onMove: (direction: "up" | "down") => void;
    onDelete: () => void;
}

function LocusRow({
                      locus,
                      index,
                      ...controls
                  }: {locus: Locus; index: number} & RowControls) {
    return (
        <motion.div
            layout
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, scale: 0.97}}
            className="bg-white rounded-2xl p-4 shadow-[0_6px_16px_rgba(19,44,74,0.06)] border border-[#091A7A]/[0.05]"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-[#EAF4FF] text-[11px] font-bold text-[#3D8FEF]">
                            {index + 1}
                        </span>
                        <p className="text-[15px] font-semibold text-[#091A7A] leading-snug">
                            {locus.front}
                        </p>
                    </div>
                    <p className="text-[14px] text-[#475569] mt-1 leading-relaxed">
                        {locus.back}
                    </p>
                    {locus.hint && (
                        <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-[#EAF4FF] px-3 py-2">
                            <MapPin
                                size={14}
                                className="text-[#3D8FEF] mt-0.5 flex-shrink-0"
                            />
                            <p className="text-[13px] text-[#3D6FE0] italic leading-snug">
                                {locus.hint}
                            </p>
                        </div>
                    )}
                    {locus.tip && (
                        <div className="mt-2 flex items-start gap-2 rounded-xl bg-[#FFF7E0] px-3 py-2">
                            <Lightbulb
                                size={14}
                                className="text-[#B8860B] mt-0.5 flex-shrink-0"
                            />
                            <p className="text-[13px] text-[#8a6d1a] italic leading-snug">
                                {locus.tip}
                            </p>
                        </div>
                    )}
                </div>
                <RowMenu {...controls}/>
            </div>
        </motion.div>
    );
}

function QuestionRow({
                         question,
                         index,
                         ...controls
                     }: {question: Question; index: number} & RowControls) {
    return (
        <motion.div
            layout
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, scale: 0.97}}
            className="bg-white rounded-2xl p-4 shadow-[0_6px_16px_rgba(19,44,74,0.06)] border border-[#091A7A]/[0.05]"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="flex h-6 min-w-6 px-1.5 items-center justify-center rounded-full bg-[#091A7A] text-[12px] font-bold text-white">
                            {index + 1}
                        </span>
                        <p className="text-[15px] font-semibold text-[#091A7A] leading-snug">
                            {question.prompt}
                        </p>
                    </div>
                    <ul className="space-y-1.5">
                        {question.options.map((opt, i) => {
                            const correct = i === question.correctAnswer;
                            return (
                                <li
                                    key={i}
                                    className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] ${
                                        correct
                                            ? "bg-emerald-50 text-emerald-700 font-semibold"
                                            : "bg-[#F4F8FF] text-[#475569]"
                                    }`}
                                >
                                    <span
                                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                                            correct
                                                ? "bg-emerald-500 text-white"
                                                : "bg-white text-[#94a3b8]"
                                        }`}
                                    >
                                        {correct ? (
                                            <Check size={12} strokeWidth={3}/>
                                        ) : (
                                            String.fromCharCode(65 + i)
                                        )}
                                    </span>
                                    {opt}
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <RowMenu {...controls}/>
            </div>
        </motion.div>
    );
}

function RowMenu({
                     canMoveUp,
                     canMoveDown,
                     onEdit,
                     onDuplicate,
                     onMove,
                     onDelete,
                 }: RowControls) {
    const item =
        "rounded-[10px] px-3 py-2.5 cursor-pointer flex items-center gap-3 text-[14px] font-medium text-[#2C2C2C]";
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <motion.button
                        whileTap={{scale: 0.9}}
                        aria-label="More actions"
                        className="w-9 h-9 rounded-full bg-[#F4F8FF] flex items-center justify-center text-[#091A7A] hover:bg-[#EAF4FF] transition-colors flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40"
                    >
                        <MoreVertical size={16}/>
                    </motion.button>
                }
            />
            <DropdownMenuContent align="end" className="w-[180px] rounded-[16px] p-1.5">
                <DropdownMenuItem onClick={onEdit} className={item}>
                    <Pencil size={16} className="text-[#091A7A]"/>
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDuplicate} className={item}>
                    <Copy size={16} className="text-[#091A7A]"/>
                    Duplicate
                </DropdownMenuItem>
                {canMoveUp && (
                    <DropdownMenuItem onClick={() => onMove("up")} className={item}>
                        <ChevronUp size={16} className="text-[#091A7A]"/>
                        Move up
                    </DropdownMenuItem>
                )}
                {canMoveDown && (
                    <DropdownMenuItem onClick={() => onMove("down")} className={item}>
                        <ChevronDown size={16} className="text-[#091A7A]"/>
                        Move down
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                    onClick={onDelete}
                    className="rounded-[10px] px-3 py-2.5 cursor-pointer flex items-center gap-3 text-[14px] font-medium text-red-600 hover:bg-red-50 focus:bg-red-50"
                >
                    <Trash2 size={16} className="text-red-600"/>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// --- Editors ----------------------------------------------------------------

function EditorShell({
                         title,
                         onCancel,
                         children,
                         onSave,
                         saveDisabled,
                     }: {
    title: string;
    onCancel: () => void;
    children: React.ReactNode;
    onSave: () => void;
    saveDisabled: boolean;
}) {
    return (
        <div className="flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#091A7A]/[0.07]">
                <h2 className="text-[17px] font-bold text-[#091A7A]">{title}</h2>
                <motion.button
                    whileTap={{scale: 0.9}}
                    onClick={onCancel}
                    aria-label="Close"
                    className="w-9 h-9 rounded-full bg-[#F4F8FF] flex items-center justify-center text-[#091A7A]"
                >
                    <X size={18}/>
                </motion.button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-5 space-y-4">
                {children}
            </div>
            <div className="px-5 py-4 border-t border-[#091A7A]/[0.07]">
                <motion.button
                    whileTap={{scale: saveDisabled ? 1 : 0.98}}
                    onClick={onSave}
                    disabled={saveDisabled}
                    className={`w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                        saveDisabled
                            ? "bg-[#E2E8F0] text-[#94a3b8] cursor-not-allowed"
                            : "bg-[#091A7A] text-white shadow-[0_8px_20px_rgba(9,26,122,0.25)]"
                    }`}
                >
                    <Check size={18}/>
                    Save
                </motion.button>
            </div>
        </div>
    );
}

function FieldLabel({children}: {children: React.ReactNode}) {
    return (
        <label className="block text-[13px] font-semibold text-[#091A7A] mb-1.5">
            {children}
        </label>
    );
}

function LocusEditor({
                         initial,
                         onCancel,
                         onSave,
                     }: {
    initial: Locus | null;
    onCancel: () => void;
    onSave: (data: Omit<Locus, "id">) => void;
}) {
    const [front, setFront] = useState(initial?.front ?? "");
    const [back, setBack] = useState(initial?.back ?? "");
    const [hint, setHint] = useState(initial?.hint ?? "");
    const [tip, setTip] = useState(initial?.tip ?? "");
    const valid = front.trim().length > 0 && back.trim().length > 0;

    return (
        <EditorShell
            title={initial ? "Edit locus" : "New locus"}
            onCancel={onCancel}
            saveDisabled={!valid}
            onSave={() =>
                onSave({
                    front: front.trim(),
                    back: back.trim(),
                    ...(hint.trim() ? {hint: hint.trim()} : {}),
                    ...(tip.trim() ? {tip: tip.trim()} : {}),
                })
            }
        >
            <div>
                <FieldLabel>Front (what to recall)</FieldLabel>
                <Input
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    placeholder="e.g., Zeus"
                    className={`${navyField} px-4 h-12`}
                    autoFocus
                />
            </div>
            <div>
                <FieldLabel>Back (what it means)</FieldLabel>
                <Textarea
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                    placeholder="King of the gods, god of sky and thunder."
                    rows={3}
                    className={`${navyField} px-4 py-3 resize-none`}
                />
            </div>
            <div>
                <FieldLabel>Place / image cue (optional)</FieldLabel>
                <Textarea
                    value={hint}
                    onChange={(e) => setHint(e.target.value)}
                    placeholder="Picture Zeus on a throne of clouds with a glowing bolt."
                    rows={2}
                    className={`${navyField} px-4 py-3 resize-none`}
                />
            </div>
            <div>
                <FieldLabel>Hint / tip (optional)</FieldLabel>
                <Textarea
                    value={tip}
                    onChange={(e) => setTip(e.target.value)}
                    placeholder="A short nudge you can peek at before flipping."
                    rows={2}
                    className={`${navyField} px-4 py-3 resize-none`}
                />
            </div>
        </EditorShell>
    );
}

const MAX_OPTIONS = 6;
const MIN_OPTIONS = 2;

function QuestionEditor({
                            initial,
                            onCancel,
                            onSave,
                        }: {
    initial: Question | null;
    onCancel: () => void;
    onSave: (data: Omit<Question, "id">) => void;
}) {
    const [prompt, setPrompt] = useState(initial?.prompt ?? "");
    const [options, setOptions] = useState<string[]>(
        initial?.options ?? ["", ""],
    );
    const [correct, setCorrect] = useState(initial?.correctAnswer ?? 0);
    const [explanation, setExplanation] = useState(initial?.explanation ?? "");

    const filled = options.map((o) => o.trim());
    const valid =
        prompt.trim().length > 0 &&
        filled.filter(Boolean).length >= MIN_OPTIONS &&
        filled[correct]?.length > 0;

    const setOption = (i: number, value: string) =>
        setOptions((prev) => prev.map((o, idx) => (idx === i ? value : o)));

    const addOption = () =>
        setOptions((prev) =>
            prev.length < MAX_OPTIONS ? [...prev, ""] : prev,
        );

    const removeOption = (i: number) => {
        setOptions((prev) => prev.filter((_, idx) => idx !== i));
        setCorrect((prev) => {
            if (i === prev) return 0;
            return i < prev ? prev - 1 : prev;
        });
    };

    return (
        <EditorShell
            title={initial ? "Edit question" : "New question"}
            onCancel={onCancel}
            saveDisabled={!valid}
            onSave={() => {
                // Drop blank options, remapping the correct index to survive it.
                const kept: string[] = [];
                let newCorrect = 0;
                options.forEach((o, i) => {
                    if (o.trim()) {
                        if (i === correct) newCorrect = kept.length;
                        kept.push(o.trim());
                    }
                });
                onSave({
                    prompt: prompt.trim(),
                    options: kept,
                    correctAnswer: newCorrect,
                    ...(explanation.trim()
                        ? {explanation: explanation.trim()}
                        : {}),
                });
            }}
        >
            <div>
                <FieldLabel>Question</FieldLabel>
                <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Which planet is closest to the Sun?"
                    rows={2}
                    className={`${navyField} px-4 py-3 resize-none`}
                    autoFocus
                />
            </div>

            <div>
                <FieldLabel>Answer options</FieldLabel>
                <p className="text-[12px] text-[#64748b] -mt-1 mb-2">
                    Tap the circle to mark the correct answer.
                </p>
                <div className="space-y-2">
                    {options.map((opt, i) => {
                        const isCorrect = i === correct;
                        return (
                            <div key={i} className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setCorrect(i)}
                                    aria-label={
                                        isCorrect
                                            ? "Correct answer"
                                            : "Mark as correct"
                                    }
                                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                                        isCorrect
                                            ? "bg-emerald-500 border-emerald-500 text-white"
                                            : "bg-white border-[#cbd5e1] text-[#94a3b8]"
                                    }`}
                                >
                                    {isCorrect ? (
                                        <Check size={15} strokeWidth={3}/>
                                    ) : (
                                        <span className="text-[12px] font-bold">
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                    )}
                                </button>
                                <Input
                                    value={opt}
                                    onChange={(e) => setOption(i, e.target.value)}
                                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                    className={`${navyField} px-4 h-11 flex-1`}
                                />
                                {options.length > MIN_OPTIONS && (
                                    <button
                                        type="button"
                                        onClick={() => removeOption(i)}
                                        aria-label="Remove option"
                                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <X size={16}/>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
                {options.length < MAX_OPTIONS && (
                    <button
                        type="button"
                        onClick={addOption}
                        className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#3D8FEF] hover:text-[#091A7A] transition-colors"
                    >
                        <Plus size={15}/>
                        Add option
                    </button>
                )}
            </div>

            <div>
                <FieldLabel>Explanation (optional)</FieldLabel>
                <Textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Shown after answering, to reinforce the recall."
                    rows={2}
                    className={`${navyField} px-4 py-3 resize-none`}
                />
            </div>
        </EditorShell>
    );
}
