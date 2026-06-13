import {type ChangeEvent, useRef, useState} from "react";
import {BookOpen, ChevronRight, FileSpreadsheet, Layers} from "lucide-react";
import {toast} from "sonner";
import {useProgressState} from "../../hooks/useProgressState";
import {
    ContentImportError,
    importContentFile,
    parseEBibliaChapters,
} from "../../utils/contentUtils";
import {importAnkiFile} from "../../utils/ankiImport";
import {KeyboardSheet} from "../ui/KeyboardSheet";
import {Textarea} from "../ui/textarea";

interface ImportRoomsSheetProps {
    palaceId: string;
    open: boolean;
    onClose: () => void;
    /** Open the newest imported room once the import lands. */
    onImported?: () => void;
}

const EBIBLIA_EXAMPLE = `3 Ioan 1
(1:1) Prezbiterul către preaiubitul Gaius, pe care-l iubesc în adevăr:
(1:2) preaiubitule, doresc ca toate lucrurile tale să-ți meargă bine...`;

/** Drop the extension and tidy a file name into a room title. */
function roomTitleFromFile(name: string): string {
    return name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim() || "Imported";
}

/**
 * Palace-level import: bring in a whole chapter or deck as its own room (not
 * just loci into the current one). eBiblia text becomes one room per chapter
 * named after the heading; an Anki deck or CSV becomes a room named after the
 * file.
 */
export function ImportRoomsSheet({
                                     palaceId,
                                     open,
                                     onClose,
                                     onImported,
                                 }: ImportRoomsSheetProps) {
    const {actions} = useProgressState();
    const [step, setStep] = useState<"menu" | "verses">("menu");
    const [verseInput, setVerseInput] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);
    const fileKindRef = useRef<"anki" | "csv">("anki");

    const reset = () => {
        setStep("menu");
        setVerseInput("");
    };

    const close = () => {
        reset();
        onClose();
    };

    const pickFile = (accept: string, kind: "anki" | "csv") => {
        fileKindRef.current = kind;
        const input = fileRef.current;
        if (input) {
            input.accept = accept;
            input.click();
        }
    };

    const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const content =
                    fileKindRef.current === "anki"
                        ? await importAnkiFile(file)
                        : await importContentFile(file);
                if (content.loci.length === 0) {
                    toast.warning("No cards found in that file.");
                } else {
                    const {rooms, loci} = actions.importRoomsWithContent(palaceId, [
                        {
                            title: roomTitleFromFile(file.name),
                            loci: content.loci,
                            questions: content.questions,
                        },
                    ]);
                    toast.success(
                        `Added ${rooms === 1 ? "1 room" : `${rooms} rooms`} · ${loci} ${
                            loci === 1 ? "card" : "cards"
                        }`,
                    );
                    onImported?.();
                    close();
                }
            } catch (error) {
                toast.error(
                    error instanceof ContentImportError
                        ? error.message
                        : "Couldn't import that file.",
                );
            }
        }
        if (fileRef.current) fileRef.current.value = "";
    };

    const chapters = parseEBibliaChapters(verseInput);
    const verseCount = chapters.reduce((s, c) => s + c.loci.length, 0);

    const createVerseRooms = () => {
        if (chapters.length === 0) {
            toast.warning("Paste verses like “(1:1) In the beginning…”");
            return;
        }
        const {rooms, loci} = actions.importRoomsWithContent(
            palaceId,
            chapters.map((c) => ({title: c.title, loci: c.loci})),
        );
        toast.success(
            `Added ${rooms === 1 ? "1 room" : `${rooms} rooms`} · ${loci} ${
                loci === 1 ? "verse" : "verses"
            }`,
        );
        onImported?.();
        close();
    };

    return (
        <>
            <input
                type="file"
                ref={fileRef}
                className="hidden"
                accept=".apkg,.colpkg,.txt"
                onChange={handleFile}
            />

            <KeyboardSheet
                open={open}
                onClose={close}
                title={step === "verses" ? "Import Bible chapter" : "Import a room"}
                footer={
                    step === "verses" ? (
                        <button
                            onClick={createVerseRooms}
                            disabled={verseCount === 0}
                            className={`w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                                verseCount > 0
                                    ? "bg-[#091A7A] text-white shadow-[0_8px_20px_rgba(9,26,122,0.25)] active:scale-[0.98]"
                                    : "bg-[#E2E8F0] text-[#94a3b8] cursor-not-allowed"
                            }`}
                        >
                            <BookOpen size={18}/>
                            {verseCount > 0
                                ? `Create ${
                                      chapters.length === 1
                                          ? "1 room"
                                          : `${chapters.length} rooms`
                                  } · ${verseCount} ${verseCount === 1 ? "verse" : "verses"}`
                                : "Create rooms"}
                        </button>
                    ) : undefined
                }
            >
                {step === "menu" ? (
                    <div className="space-y-2.5">
                        <p className="px-1 text-[13px] text-[#475569] leading-relaxed">
                            Bring in a whole chapter or deck as its own room. Each verse or
                            card lands inside it, ready to study.
                        </p>
                        <ImportRow
                            icon={<BookOpen size={20} className="text-[#091A7A]"/>}
                            tint="bg-[#EAF0FF]"
                            title="Bible chapter (eBiblia)"
                            sub="One room per chapter, one card per verse"
                            onClick={() => setStep("verses")}
                        />
                        <ImportRow
                            icon={<Layers size={20} className="text-[#6D5BD0]"/>}
                            tint="bg-[#EEEBFF]"
                            title="Anki deck"
                            sub="An .apkg / .colpkg deck or notes (.txt) → one room"
                            onClick={() => pickFile(".apkg,.colpkg,.txt", "anki")}
                        />
                        <ImportRow
                            icon={<FileSpreadsheet size={20} className="text-[#0E9F6E]"/>}
                            tint="bg-[#E3F6EE]"
                            title="CSV file"
                            sub="A spreadsheet or Quizlet export → one room"
                            onClick={() => pickFile(".csv", "csv")}
                        />
                    </div>
                ) : (
                    <>
                        <p className="text-[13px] text-[#475569] leading-relaxed">
                            Paste eBiblia text. Each{" "}
                            <span className="font-mono">Book Chapter</span> heading becomes a
                            room, and every <span className="font-mono">(chapter:verse)</span>{" "}
                            line a card.
                        </p>
                        {verseCount > 0 && (
                            <p className="text-[12px] font-semibold text-[#3D8FEF]">
                                {chapters.length} {chapters.length === 1 ? "chapter" : "chapters"}{" "}
                                · {verseCount} {verseCount === 1 ? "verse" : "verses"}
                            </p>
                        )}
                        <Textarea
                            value={verseInput}
                            onChange={(e) => setVerseInput(e.target.value)}
                            placeholder={EBIBLIA_EXAMPLE}
                            rows={9}
                            className="w-full bg-[#F4F8FF] rounded-xl px-4 py-3 text-[13px] text-[#091A7A] placeholder:text-[#091A7A]/40 outline-none border-2 border-transparent focus:border-[#4F8EFF]/60 focus:bg-white transition-all resize-none font-mono"
                        />
                        <button
                            onClick={() => setStep("menu")}
                            className="text-[13px] font-semibold text-[#3D8FEF]"
                        >
                            ← Back to options
                        </button>
                    </>
                )}
            </KeyboardSheet>
        </>
    );
}

function ImportRow({
                       icon,
                       tint,
                       title,
                       sub,
                       onClick,
                   }: {
    icon: React.ReactNode;
    tint: string;
    title: string;
    sub: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3.5 rounded-2xl bg-[#F4F8FF] p-3 text-left active:bg-[#EAF4FF] transition-colors"
        >
            <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${tint}`}
            >
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#091A7A]">{title}</p>
                <p className="text-[13px] text-[#64748b] leading-snug">{sub}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#94a3b8] flex-shrink-0"/>
        </button>
    );
}
