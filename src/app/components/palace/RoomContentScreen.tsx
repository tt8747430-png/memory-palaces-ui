import {type ChangeEvent, useEffect, useMemo, useRef, useState} from "react";
import {AnimatePresence, motion, useScroll, useTransform} from "motion/react";
import {
    ArrowLeft,
    Check,
    CheckSquare,
    ChevronDown,
    ChevronUp,
    Copy,
    DownloadCloud,
    FileUp,
    Flag,
    GraduationCap,
    HelpCircle,
    Lightbulb,
    ListChecks,
    MapPin,
    MoreVertical,
    Pencil,
    Plus,
    RotateCcw,
    Search,
    Square,
    Trash2,
    UploadCloud,
    X,
} from "lucide-react";
import {toast} from "sonner";
import {
    type Locus,
    type Question,
    useProgressState,
} from "../../hooks/useProgressState";
import {srsStatus, type SrsStatus} from "../../utils/srs";
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
import {KeyboardSheet} from "../ui/KeyboardSheet";
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
    const [query, setQuery] = useState("");
    const [selectMode, setSelectMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [quickFront, setQuickFront] = useState("");
    const [quickBack, setQuickBack] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const quickFrontRef = useRef<HTMLInputElement>(null);

    // Collapse the room title on scroll; tabs + search stay pinned below.
    const listRef = useRef<HTMLDivElement>(null);
    const {scrollY} = useScroll({container: listRef});
    const titleScale = useTransform(scrollY, [0, 70], [1, 0.84]);
    const titleMb = useTransform(scrollY, [0, 70], [16, 6]);
    const nameHeight = useTransform(scrollY, [0, 60], [18, 0]);
    const nameOpacity = useTransform(scrollY, [0, 40], [1, 0]);

    const loci = useMemo(() => room?.loci ?? [], [room]);
    const questions = useMemo(() => room?.questions ?? [], [room]);

    const q = query.trim().toLowerCase();
    const visibleLoci = useMemo(
        () =>
            q
                ? loci.filter((l) =>
                    [l.front, l.back, l.hint, l.tip]
                        .filter(Boolean)
                        .some((t) => (t as string).toLowerCase().includes(q)),
                )
                : loci,
        [loci, q],
    );
    const visibleQuestions = useMemo(
        () =>
            q
                ? questions.filter((item) =>
                    [item.prompt, ...item.options].some((t) =>
                        t.toLowerCase().includes(q),
                    ),
                )
                : questions,
        [questions, q],
    );

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

    // --- Selection / bulk ---------------------------------------------------

    const visibleIds = (tab === "loci" ? visibleLoci : visibleQuestions).map(
        (x) => x.id,
    );
    const allVisibleSelected =
        visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
    const selectedCount = selectedIds.size;

    const toggleSelect = (id: string) =>
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    const toggleSelectAll = () =>
        setSelectedIds((prev) => {
            if (allVisibleSelected) {
                const next = new Set(prev);
                visibleIds.forEach((id) => next.delete(id));
                return next;
            }
            return new Set([...prev, ...visibleIds]);
        });

    const exitSelect = () => {
        setSelectMode(false);
        setSelectedIds(new Set());
    };

    const changeTab = (next: Tab) => {
        setTab(next);
        exitSelect();
    };

    const bulkDelete = () => {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;
        if (tab === "loci") actions.deleteLoci(palaceId, roomId, ids);
        else actions.deleteQuestions(palaceId, roomId, ids);
        toast.success(
            `Deleted ${ids.length} ${
                tab === "loci"
                    ? ids.length === 1
                        ? "locus"
                        : "loci"
                    : `question${ids.length === 1 ? "" : "s"}`
            }`,
        );
        exitSelect();
    };

    const bulkResetSrs = () => {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;
        actions.resetLociSrs(palaceId, roomId, ids);
        toast.success("Schedule reset");
        exitSelect();
    };

    const bulkMarkKnown = () => {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;
        actions.markLociKnown(palaceId, roomId, ids);
        toast.success("Marked as known");
        exitSelect();
    };

    const quickAdd = () => {
        if (!quickFront.trim() || !quickBack.trim()) return;
        actions.createLocus(palaceId, roomId, {
            front: quickFront.trim(),
            back: quickBack.trim(),
        });
        setQuickFront("");
        setQuickBack("");
        quickFrontRef.current?.focus();
    };

    const total = tab === "loci" ? loci.length : questions.length;
    const visibleCount = tab === "loci" ? visibleLoci.length : visibleQuestions.length;
    const hasItems = total > 0;

    return (
        <div className="size-full flex flex-col relative bg-[#091A7A]">
            <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-b from-[#091A7A] to-[#3D6FE0] relative flex-shrink-0 pb-5 pt-2">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.12),transparent_55%)]"/>
                    <div className="h-safe-top relative z-10"/>
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

                        <motion.div style={{marginBottom: titleMb}}>
                            <motion.p
                                style={{height: nameHeight, opacity: nameOpacity}}
                                className="text-[13px] font-medium text-white/70 overflow-hidden"
                            >
                                {palace.name}
                            </motion.p>
                            <motion.h1
                                style={{scale: titleScale}}
                                className="text-[24px] font-bold text-white leading-tight text-balance origin-left"
                            >
                                {room.title}
                            </motion.h1>
                        </motion.div>

                        {/* Tabs */}
                        <Tabs
                            value={tab}
                            onValueChange={(v) => changeTab(v as Tab)}
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

                {/* Search + selection controls */}
                {hasItems && (
                    <div className="flex-shrink-0 bg-[#EEF4FF] px-5 pt-4 pb-2">
                        {selectMode ? (
                            <div className="flex items-center justify-between gap-3">
                                <button
                                    onClick={toggleSelectAll}
                                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#091A7A]"
                                >
                                    {allVisibleSelected ? (
                                        <CheckSquare size={18} className="text-[#3D8FEF]"/>
                                    ) : (
                                        <Square size={18} className="text-[#94a3b8]"/>
                                    )}
                                    {allVisibleSelected ? "Clear all" : "Select all"}
                                </button>
                                <span className="text-[13px] font-semibold text-[#475569]">
                                    {selectedCount} selected
                                </span>
                                <button
                                    onClick={exitSelect}
                                    className="text-[13px] font-semibold text-[#3D8FEF]"
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none"/>
                                    <Input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder={
                                            tab === "loci" ? "Search loci" : "Search questions"
                                        }
                                        className="w-full bg-white rounded-xl text-[15px] text-[#091A7A] placeholder:text-[#94a3b8] outline-none border-2 border-transparent focus:border-[#4F8EFF]/60 pl-9 pr-9 h-11"
                                    />
                                    {query && (
                                        <button
                                            onClick={() => setQuery("")}
                                            aria-label="Clear search"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-[#091A7A]"
                                        >
                                            <X size={16}/>
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSelectMode(true)}
                                    aria-label="Select multiple"
                                    className="h-11 px-3 rounded-xl bg-white text-[#091A7A] flex items-center gap-1.5 text-[13px] font-semibold border-2 border-transparent active:bg-[#EAF4FF]"
                                >
                                    <ListChecks size={17}/>
                                    Select
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* List */}
                <div ref={listRef} className="flex-1 overflow-y-auto scrollbar-hide bg-[#EEF4FF] px-5 pt-3 pb-[120px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={tab}
                            initial={{opacity: 0, y: 8}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -8}}
                            transition={{duration: 0.2}}
                            className="space-y-3"
                        >
                            {/* Inline quick-add (loci, when the list already has items) */}
                            {tab === "loci" && hasItems && !selectMode && (
                                <QuickAddLocus
                                    front={quickFront}
                                    back={quickBack}
                                    onFront={setQuickFront}
                                    onBack={setQuickBack}
                                    onAdd={quickAdd}
                                    frontRef={quickFrontRef}
                                />
                            )}

                            {tab === "loci" &&
                                (total === 0 ? (
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
                                ) : visibleCount === 0 ? (
                                    <NoResults onClear={() => setQuery("")}/>
                                ) : (
                                    visibleLoci.map((locus) => (
                                        <LocusRow
                                            key={locus.id}
                                            locus={locus}
                                            index={loci.indexOf(locus)}
                                            selectMode={selectMode}
                                            selected={selectedIds.has(locus.id)}
                                            onToggleSelect={() => toggleSelect(locus.id)}
                                            canMoveUp={loci.indexOf(locus) > 0}
                                            canMoveDown={loci.indexOf(locus) < loci.length - 1}
                                            onEdit={() => setEditor({kind: "locus", locus})}
                                            onDuplicate={() => {
                                                actions.duplicateLocus(palaceId, roomId, locus.id);
                                                toast.success("Locus duplicated");
                                            }}
                                            onMove={(dir) =>
                                                actions.moveLocus(palaceId, roomId, locus.id, dir)
                                            }
                                            onDelete={() =>
                                                setPendingDelete({kind: "loci", id: locus.id})
                                            }
                                            onToggleFlag={() => {
                                                actions.toggleLocusFlag(palaceId, roomId, locus.id);
                                            }}
                                            onMarkKnown={() => {
                                                actions.markLociKnown(palaceId, roomId, [locus.id]);
                                                toast.success("Marked as known");
                                            }}
                                            onResetSrs={() => {
                                                actions.resetLociSrs(palaceId, roomId, [locus.id]);
                                                toast.success("Schedule reset");
                                            }}
                                        />
                                    ))
                                ))}

                            {tab === "questions" &&
                                (total === 0 ? (
                                    <EmptyState
                                        icon={<HelpCircle className="w-7 h-7"/>}
                                        title="No questions yet"
                                        description="Write multiple-choice questions to test recall. These power this palace's quiz."
                                        action={
                                            <ImportOrAddButtons
                                                addLabel="Add a question"
                                                onAdd={() =>
                                                    setEditor({kind: "question", question: null})
                                                }
                                                onImport={handleImportClick}
                                            />
                                        }
                                    />
                                ) : visibleCount === 0 ? (
                                    <NoResults onClear={() => setQuery("")}/>
                                ) : (
                                    visibleQuestions.map((item) => (
                                        <QuestionRow
                                            key={item.id}
                                            question={item}
                                            index={questions.indexOf(item)}
                                            selectMode={selectMode}
                                            selected={selectedIds.has(item.id)}
                                            onToggleSelect={() => toggleSelect(item.id)}
                                            canMoveUp={questions.indexOf(item) > 0}
                                            canMoveDown={
                                                questions.indexOf(item) < questions.length - 1
                                            }
                                            onEdit={() =>
                                                setEditor({kind: "question", question: item})
                                            }
                                            onDuplicate={() => {
                                                actions.duplicateQuestion(palaceId, roomId, item.id);
                                                toast.success("Question duplicated");
                                            }}
                                            onMove={(dir) =>
                                                actions.moveQuestion(palaceId, roomId, item.id, dir)
                                            }
                                            onDelete={() =>
                                                setPendingDelete({kind: "questions", id: item.id})
                                            }
                                        />
                                    ))
                                ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Bottom bar: bulk actions in select mode, otherwise Add */}
                {selectMode ? (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-[#091A7A]/[0.07] flex items-center gap-2">
                        {tab === "loci" && (
                            <>
                                <BulkButton
                                    onClick={bulkMarkKnown}
                                    disabled={selectedCount === 0}
                                    icon={<GraduationCap size={17}/>}
                                    label="Known"
                                />
                                <BulkButton
                                    onClick={bulkResetSrs}
                                    disabled={selectedCount === 0}
                                    icon={<RotateCcw size={17}/>}
                                    label="Reset"
                                />
                            </>
                        )}
                        <BulkButton
                            onClick={bulkDelete}
                            disabled={selectedCount === 0}
                            icon={<Trash2 size={17}/>}
                            label="Delete"
                            tone="danger"
                        />
                    </div>
                ) : (
                    hasItems && (
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
                    )
                )}
            </div>

            {/* Editors — keyboard-docked bottom sheets */}
            <LocusEditor
                open={editor?.kind === "locus"}
                initial={editor?.kind === "locus" ? editor.locus : null}
                onCancel={() => setEditor(null)}
                onSave={(data) => {
                    if (editor?.kind === "locus" && editor.locus) {
                        actions.updateLocus(palaceId, roomId, editor.locus.id, data);
                        toast.success("Locus updated");
                    } else {
                        actions.createLocus(palaceId, roomId, data);
                        toast.success("Locus added");
                    }
                    setEditor(null);
                }}
                onSaveAndAddAnother={(data) => {
                    actions.createLocus(palaceId, roomId, data);
                    toast.success("Locus added — next one");
                }}
            />

            <QuestionEditor
                open={editor?.kind === "question"}
                initial={editor?.kind === "question" ? editor.question : null}
                onCancel={() => setEditor(null)}
                onSave={(data) => {
                    if (editor?.kind === "question" && editor.question) {
                        actions.updateQuestion(palaceId, roomId, editor.question.id, data);
                        toast.success("Question updated");
                    } else {
                        actions.createQuestion(palaceId, roomId, data);
                        toast.success("Question added");
                    }
                    setEditor(null);
                }}
            />

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

interface RowSelection {
    selectMode?: boolean;
    selected?: boolean;
    onToggleSelect?: () => void;
}

interface LocusActions {
    onToggleFlag: () => void;
    onMarkKnown: () => void;
    onResetSrs: () => void;
}

const SRS_BADGE: Record<SrsStatus, {label: string; cls: string}> = {
    new: {label: "New", cls: "bg-[#EEF2F7] text-[#64748b]"},
    due: {label: "Due", cls: "bg-[#FEE2E2] text-[#B91C1C]"},
    learning: {label: "Learning", cls: "bg-[#FEF3C7] text-[#B45309]"},
    known: {label: "Known", cls: "bg-[#D1FAE5] text-[#047857]"},
};

function SrsBadge({status}: {status: SrsStatus}) {
    const {label, cls} = SRS_BADGE[status];
    return (
        <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cls}`}
        >
            {label}
        </span>
    );
}

function SelectDot({selected}: {selected: boolean}) {
    return (
        <div
            className={`mt-0.5 w-6 h-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                selected
                    ? "bg-[#3D8FEF] border-[#3D8FEF] text-white"
                    : "bg-white border-[#cbd5e1] text-transparent"
            }`}
        >
            <Check size={14} strokeWidth={3}/>
        </div>
    );
}

function LocusRow({
                      locus,
                      index,
                      selectMode,
                      selected,
                      onToggleSelect,
                      onToggleFlag,
                      onMarkKnown,
                      onResetSrs,
                      ...controls
                  }: {locus: Locus; index: number} & RowControls &
    RowSelection &
    LocusActions) {
    const status = srsStatus(locus.srs);
    return (
        <motion.div
            layout
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, scale: 0.97}}
            onClick={selectMode ? onToggleSelect : undefined}
            className={`bg-white rounded-2xl p-4 shadow-[0_6px_16px_rgba(19,44,74,0.06)] border transition-colors ${
                selected
                    ? "border-[#3D8FEF] ring-2 ring-[#3D8FEF]/25"
                    : "border-[#091A7A]/[0.05]"
            } ${selectMode ? "cursor-pointer" : ""}`}
        >
            <div className="flex items-start gap-3">
                {selectMode && <SelectDot selected={!!selected}/>}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-[#EAF4FF] text-[11px] font-bold text-[#3D8FEF]">
                            {index + 1}
                        </span>
                        <p className="text-[15px] font-semibold text-[#091A7A] leading-snug">
                            {locus.front}
                        </p>
                        {locus.flagged && (
                            <Flag
                                size={14}
                                className="fill-[#FFC71E] text-[#B8860B] flex-shrink-0"
                            />
                        )}
                    </div>
                    <p className="text-[14px] text-[#475569] mt-1 leading-relaxed">
                        {locus.back}
                    </p>
                    <div className="mt-2">
                        <SrsBadge status={status}/>
                    </div>
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
                {!selectMode && (
                    <RowMenu
                        {...controls}
                        flagged={locus.flagged}
                        onToggleFlag={onToggleFlag}
                        onMarkKnown={onMarkKnown}
                        onResetSrs={onResetSrs}
                    />
                )}
            </div>
        </motion.div>
    );
}

function QuestionRow({
                         question,
                         index,
                         selectMode,
                         selected,
                         onToggleSelect,
                         ...controls
                     }: {question: Question; index: number} & RowControls &
    RowSelection) {
    return (
        <motion.div
            layout
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, scale: 0.97}}
            onClick={selectMode ? onToggleSelect : undefined}
            className={`bg-white rounded-2xl p-4 shadow-[0_6px_16px_rgba(19,44,74,0.06)] border transition-colors ${
                selected
                    ? "border-[#3D8FEF] ring-2 ring-[#3D8FEF]/25"
                    : "border-[#091A7A]/[0.05]"
            } ${selectMode ? "cursor-pointer" : ""}`}
        >
            <div className="flex items-start gap-3">
                {selectMode && <SelectDot selected={!!selected}/>}
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
                {!selectMode && <RowMenu {...controls}/>}
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
                     flagged,
                     onToggleFlag,
                     onMarkKnown,
                     onResetSrs,
                 }: RowControls & Partial<LocusActions> & {flagged?: boolean}) {
    const item =
        "rounded-[10px] px-3 py-2.5 cursor-pointer flex items-center gap-3 text-[14px] font-medium text-[#2C2C2C]";
    const isLocus = !!onToggleFlag;
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
            <DropdownMenuContent align="end" className="w-[190px] rounded-[16px] p-1.5">
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

                {isLocus && (
                    <>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={onToggleFlag} className={item}>
                            <Flag
                                size={16}
                                className={
                                    flagged
                                        ? "fill-[#FFC71E] text-[#B8860B]"
                                        : "text-[#091A7A]"
                                }
                            />
                            {flagged ? "Unflag" : "Flag"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onMarkKnown} className={item}>
                            <GraduationCap size={16} className="text-[#047857]"/>
                            Mark as known
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onResetSrs} className={item}>
                            <RotateCcw size={16} className="text-[#091A7A]"/>
                            Reset schedule
                        </DropdownMenuItem>
                    </>
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

const quickFieldCls =
    "w-full bg-[#F4F8FF] rounded-lg text-[14px] text-[#091A7A] placeholder:text-[#091A7A]/40 outline-none border-2 border-transparent focus:border-[#4F8EFF]/60 focus:bg-white px-3";

function QuickAddLocus({
                           front,
                           back,
                           onFront,
                           onBack,
                           onAdd,
                           frontRef,
                       }: {
    front: string;
    back: string;
    onFront: (v: string) => void;
    onBack: (v: string) => void;
    onAdd: () => void;
    frontRef: React.Ref<HTMLInputElement>;
}) {
    const backRef = useRef<HTMLInputElement>(null);
    const valid = front.trim().length > 0 && back.trim().length > 0;
    return (
        <div className="bg-white rounded-2xl p-3 shadow-[0_6px_16px_rgba(19,44,74,0.06)] border border-dashed border-[#3D8FEF]/50">
            <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 mt-0.5 rounded-full bg-[#EAF4FF] flex items-center justify-center flex-shrink-0">
                    <Plus size={15} className="text-[#3D8FEF]"/>
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                    <Input
                        ref={frontRef}
                        value={front}
                        onChange={(e) => onFront(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                backRef.current?.focus();
                            }
                        }}
                        placeholder="Front — what to recall"
                        enterKeyHint="next"
                        className={`${quickFieldCls} h-10`}
                    />
                    <Input
                        ref={backRef}
                        value={back}
                        onChange={(e) => onBack(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                onAdd();
                            }
                        }}
                        placeholder="Back — what it means"
                        enterKeyHint="done"
                        className={`${quickFieldCls} h-10`}
                    />
                </div>
                <button
                    onClick={onAdd}
                    disabled={!valid}
                    aria-label="Add locus"
                    className={`w-10 h-10 mt-0.5 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        valid
                            ? "bg-[#091A7A] text-white"
                            : "bg-[#E2E8F0] text-[#94a3b8]"
                    }`}
                >
                    <Plus size={18}/>
                </button>
            </div>
        </div>
    );
}

function NoResults({onClear}: {onClear: () => void}) {
    return (
        <div className="py-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white mx-auto mb-3 flex items-center justify-center shadow-sm">
                <Search className="w-6 h-6 text-[#94a3b8]"/>
            </div>
            <p className="text-[15px] font-semibold text-[#091A7A]">No matches</p>
            <p className="text-[13px] text-[#475569] mt-1">
                Nothing here matches your search.
            </p>
            <button
                onClick={onClear}
                className="mt-3 text-[13px] font-semibold text-[#3D8FEF]"
            >
                Clear search
            </button>
        </div>
    );
}

function BulkButton({
                        onClick,
                        disabled,
                        icon,
                        label,
                        tone = "default",
                    }: {
    onClick: () => void;
    disabled?: boolean;
    icon: React.ReactNode;
    label: string;
    tone?: "default" | "danger";
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-1.5 text-[13px] font-semibold transition-colors ${
                disabled
                    ? "bg-[#EEF2F7] text-[#94a3b8]"
                    : tone === "danger"
                        ? "bg-[#FEE2E2] text-[#B91C1C]"
                        : "bg-[#EAF0FF] text-[#091A7A]"
            }`}
        >
            {icon}
            {label}
        </button>
    );
}

// --- Editors ----------------------------------------------------------------

const sheetPrimaryBtn = (enabled: boolean) =>
    `w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors ${
        enabled
            ? "bg-[#091A7A] text-white shadow-[0_8px_20px_rgba(9,26,122,0.25)] active:scale-[0.98]"
            : "bg-[#E2E8F0] text-[#94a3b8] cursor-not-allowed"
    }`;

function FieldLabel({
                        children,
                        count,
                    }: {
    children: React.ReactNode;
    count?: number;
}) {
    return (
        <div className="flex items-baseline justify-between mb-1.5">
            <label className="block text-[13px] font-semibold text-[#091A7A]">
                {children}
            </label>
            {count !== undefined && (
                <span className="text-[11px] font-medium text-[#94a3b8] tabular-nums">
                    {count}
                </span>
            )}
        </div>
    );
}

function LocusEditor({
                         open,
                         initial,
                         onCancel,
                         onSave,
                         onSaveAndAddAnother,
                     }: {
    open: boolean;
    initial: Locus | null;
    onCancel: () => void;
    onSave: (data: Omit<Locus, "id">) => void;
    onSaveAndAddAnother?: (data: Omit<Locus, "id">) => void;
}) {
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");
    const [hint, setHint] = useState("");
    const [tip, setTip] = useState("");
    const frontRef = useRef<HTMLInputElement>(null);

    // Reset the fields each time the sheet opens (or switches target).
    useEffect(() => {
        if (open) {
            setFront(initial?.front ?? "");
            setBack(initial?.back ?? "");
            setHint(initial?.hint ?? "");
            setTip(initial?.tip ?? "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, initial?.id]);

    const valid = front.trim().length > 0 && back.trim().length > 0;
    const buildData = (): Omit<Locus, "id"> => ({
        front: front.trim(),
        back: back.trim(),
        ...(hint.trim() ? {hint: hint.trim()} : {}),
        ...(tip.trim() ? {tip: tip.trim()} : {}),
    });

    const handleAddAnother = () => {
        if (!valid || !onSaveAndAddAnother) return;
        onSaveAndAddAnother(buildData());
        setFront("");
        setBack("");
        setHint("");
        setTip("");
        frontRef.current?.focus();
    };

    return (
        <KeyboardSheet
            open={open}
            onClose={onCancel}
            title={initial ? "Edit locus" : "New locus"}
            footer={
                <>
                    {!initial && onSaveAndAddAnother && (
                        <button
                            onClick={handleAddAnother}
                            disabled={!valid}
                            className={`w-full py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 border-2 transition-colors ${
                                valid
                                    ? "border-[#091A7A]/15 text-[#091A7A] bg-white active:scale-[0.98]"
                                    : "border-transparent bg-[#F1F5F9] text-[#94a3b8] cursor-not-allowed"
                            }`}
                        >
                            <Plus size={17}/>
                            Save &amp; add another
                        </button>
                    )}
                    <button
                        onClick={() => valid && onSave(buildData())}
                        disabled={!valid}
                        className={sheetPrimaryBtn(valid)}
                    >
                        <Check size={18}/>
                        {initial ? "Save changes" : "Save locus"}
                    </button>
                </>
            }
        >
            <div>
                <FieldLabel count={front.length}>Front (what to recall)</FieldLabel>
                <Input
                    ref={frontRef}
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    placeholder="e.g., Zeus"
                    enterKeyHint="next"
                    className={`${navyField} px-4 h-12`}
                />
            </div>
            <div>
                <FieldLabel count={back.length}>Back (what it means)</FieldLabel>
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
        </KeyboardSheet>
    );
}

const MAX_OPTIONS = 6;
const MIN_OPTIONS = 2;

function QuestionEditor({
                            open,
                            initial,
                            onCancel,
                            onSave,
                        }: {
    open: boolean;
    initial: Question | null;
    onCancel: () => void;
    onSave: (data: Omit<Question, "id">) => void;
}) {
    const [prompt, setPrompt] = useState("");
    const [options, setOptions] = useState<string[]>(["", ""]);
    const [correct, setCorrect] = useState(0);
    const [explanation, setExplanation] = useState("");

    useEffect(() => {
        if (open) {
            setPrompt(initial?.prompt ?? "");
            setOptions(initial?.options ?? ["", ""]);
            setCorrect(initial?.correctAnswer ?? 0);
            setExplanation(initial?.explanation ?? "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, initial?.id]);

    const filled = options.map((o) => o.trim());
    const valid =
        prompt.trim().length > 0 &&
        filled.filter(Boolean).length >= MIN_OPTIONS &&
        filled[correct]?.length > 0;

    const setOption = (i: number, value: string) =>
        setOptions((prev) => prev.map((o, idx) => (idx === i ? value : o)));

    const addOption = () =>
        setOptions((prev) => (prev.length < MAX_OPTIONS ? [...prev, ""] : prev));

    const removeOption = (i: number) => {
        setOptions((prev) => prev.filter((_, idx) => idx !== i));
        setCorrect((prev) => {
            if (i === prev) return 0;
            return i < prev ? prev - 1 : prev;
        });
    };

    const save = () => {
        if (!valid) return;
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
            ...(explanation.trim() ? {explanation: explanation.trim()} : {}),
        });
    };

    return (
        <KeyboardSheet
            open={open}
            onClose={onCancel}
            title={initial ? "Edit question" : "New question"}
            footer={
                <button onClick={save} disabled={!valid} className={sheetPrimaryBtn(valid)}>
                    <Check size={18}/>
                    {initial ? "Save changes" : "Save question"}
                </button>
            }
        >
            <div>
                <FieldLabel count={prompt.length}>Question</FieldLabel>
                <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Which planet is closest to the Sun?"
                    rows={2}
                    className={`${navyField} px-4 py-3 resize-none`}
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
                                        isCorrect ? "Correct answer" : "Mark as correct"
                                    }
                                    className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
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
                                        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[#94a3b8] hover:text-red-500 hover:bg-red-50 transition-colors"
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
        </KeyboardSheet>
    );
}
