import type {Locus, Question} from "../hooks/useProgressState";

/**
 * Import / export for a room's study content (loci + questions).
 *
 * Two formats are supported:
 *  - JSON  — full fidelity: loci and questions together, round-trips exactly.
 *  - CSV   — loci (`front,back,hint`) or questions
 *            (`prompt,option1..,answer,explanation`), so decks from Anki /
 *            Quizlet / a spreadsheet drop straight in.
 *
 * Imported items carry a placeholder id; the store reassigns fresh ids on
 * insert, so a file imported twice never collides with itself.
 */

const JSON_TYPE = "mindscape-room-content";
const JSON_VERSION = 2;

export interface RoomContent {
    loci: Locus[];
    questions: Question[];
}

interface ContentEnvelope extends RoomContent {
    type: string;
    version: number;
    room: string;
    exportedAt: string;
}

const placeholderId = "";

/** Browser download helper. */
function download(filename: string, text: string, mime: string) {
    const blob = new Blob([text], {type: mime});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/** Filesystem-safe slug for the download name. */
function slug(name: string): string {
    return (
        name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 40) || "room"
    );
}

/** Wrap a single CSV cell, escaping quotes and only quoting when needed. */
function csvCell(value: string): string {
    const v = value ?? "";
    return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

/** Parse a full CSV document into rows of string cells (RFC-4180-ish). */
function parseCsv(text: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let cell = "";
    let inQuotes = false;
    const src = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    for (let i = 0; i < src.length; i++) {
        const ch = src[i];
        if (inQuotes) {
            if (ch === '"') {
                if (src[i + 1] === '"') {
                    cell += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                cell += ch;
            }
        } else if (ch === '"') {
            inQuotes = true;
        } else if (ch === ",") {
            row.push(cell);
            cell = "";
        } else if (ch === "\n") {
            row.push(cell);
            rows.push(row);
            row = [];
            cell = "";
        } else {
            cell += ch;
        }
    }
    if (cell.length > 0 || row.length > 0) {
        row.push(cell);
        rows.push(row);
    }
    return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

// --- Export -----------------------------------------------------------------

export function exportRoomContentJSON(roomName: string, content: RoomContent) {
    const envelope: ContentEnvelope = {
        type: JSON_TYPE,
        version: JSON_VERSION,
        room: roomName,
        exportedAt: new Date().toISOString(),
        loci: content.loci,
        questions: content.questions,
    };
    download(
        `${slug(roomName)}-content.json`,
        JSON.stringify(envelope, null, 2),
        "application/json",
    );
}

export function exportLociCSV(roomName: string, loci: Locus[]) {
    const header = "front,back,hint";
    const lines = loci.map((c) =>
        [csvCell(c.front), csvCell(c.back), csvCell(c.hint || "")].join(","),
    );
    download(
        `${slug(roomName)}-loci.csv`,
        [header, ...lines].join("\n"),
        "text/csv",
    );
}

export function exportQuestionsCSV(roomName: string, questions: Question[]) {
    const maxOptions = questions.reduce(
        (max, q) => Math.max(max, q.options.length),
        2,
    );
    const optionHeaders = Array.from(
        {length: maxOptions},
        (_, i) => `option${i + 1}`,
    );
    const header = ["prompt", ...optionHeaders, "answer", "explanation"].join(
        ",",
    );
    const lines = questions.map((q) => {
        const cells = [csvCell(q.prompt)];
        for (let i = 0; i < maxOptions; i++) {
            cells.push(csvCell(q.options[i] || ""));
        }
        // 1-based answer column reads naturally in a spreadsheet.
        cells.push(String(q.correctAnswer + 1));
        cells.push(csvCell(q.explanation || ""));
        return cells.join(",");
    });
    download(
        `${slug(roomName)}-questions.csv`,
        [header, ...lines].join("\n"),
        "text/csv",
    );
}

// --- Import -----------------------------------------------------------------

function coerceLoci(raw: unknown): Locus[] {
    if (!Array.isArray(raw)) return [];
    return raw
        .map((item) => {
            if (!item || typeof item !== "object") return null;
            const o = item as Record<string, unknown>;
            const front = String(o.front ?? o.term ?? o.question ?? "").trim();
            const back = String(o.back ?? o.definition ?? o.answer ?? "").trim();
            if (!front || !back) return null;
            const hint = o.hint ?? o.cue ?? o.note ?? o.place;
            return {
                id: placeholderId,
                front,
                back,
                ...(hint ? {hint: String(hint).trim()} : {}),
            } as Locus;
        })
        .filter((c): c is Locus => c !== null);
}

function coerceQuestions(raw: unknown): Question[] {
    if (!Array.isArray(raw)) return [];
    return raw
        .map((item) => {
            if (!item || typeof item !== "object") return null;
            const o = item as Record<string, unknown>;
            const prompt = String(o.prompt ?? o.question ?? "").trim();
            const options = Array.isArray(o.options)
                ? o.options.map((x) => String(x).trim()).filter(Boolean)
                : [];
            if (!prompt || options.length < 2) return null;
            let correct = Number(o.correctAnswer ?? o.answer ?? 0);
            if (!Number.isFinite(correct)) correct = 0;
            correct = Math.max(0, Math.min(options.length - 1, correct));
            const explanation = o.explanation;
            return {
                id: placeholderId,
                prompt,
                options,
                correctAnswer: correct,
                ...(explanation ? {explanation: String(explanation).trim()} : {}),
            } as Question;
        })
        .filter((q): q is Question => q !== null);
}

/** Map CSV rows (with a header) onto loci or questions by their columns. */
function contentFromCsv(rows: string[][]): RoomContent {
    if (rows.length === 0) return {loci: [], questions: []};
    const header = rows[0].map((h) => h.trim().toLowerCase());
    const body = rows.slice(1);

    const isQuestions =
        header.includes("prompt") ||
        header.some((h) => h.startsWith("option")) ||
        header.includes("answer");

    if (isQuestions) {
        const promptIdx = header.findIndex(
            (h) => h === "prompt" || h === "question",
        );
        const optionIdxs = header
            .map((h, i) => (h.startsWith("option") ? i : -1))
            .filter((i) => i >= 0);
        const answerIdx = header.findIndex(
            (h) => h === "answer" || h === "correctanswer" || h === "correct",
        );
        const explIdx = header.findIndex(
            (h) => h === "explanation" || h === "explain",
        );
        const questions = body
            .map((cells) => {
                const prompt = (cells[promptIdx] ?? "").trim();
                const options = optionIdxs
                    .map((i) => (cells[i] ?? "").trim())
                    .filter(Boolean);
                if (!prompt || options.length < 2) return null;
                let answer = answerIdx >= 0 ? Number(cells[answerIdx]) : 1;
                if (!Number.isFinite(answer)) answer = 1;
                // CSV answer is 1-based; clamp into range then make 0-based.
                answer = Math.max(1, Math.min(options.length, answer)) - 1;
                const explanation =
                    explIdx >= 0 ? (cells[explIdx] ?? "").trim() : "";
                return {
                    id: placeholderId,
                    prompt,
                    options,
                    correctAnswer: answer,
                    ...(explanation ? {explanation} : {}),
                } as Question;
            })
            .filter((q): q is Question => q !== null);
        return {loci: [], questions};
    }

    // Loci: front,back,hint (header optional but assumed present).
    const frontIdx = Math.max(
        0,
        header.findIndex((h) => h === "front" || h === "term" || h === "question"),
    );
    const backIdx = (() => {
        const i = header.findIndex(
            (h) => h === "back" || h === "definition" || h === "answer",
        );
        return i >= 0 ? i : 1;
    })();
    const hintIdx = header.findIndex(
        (h) => h === "hint" || h === "cue" || h === "note",
    );
    const loci = body
        .map((cells) => {
            const front = (cells[frontIdx] ?? "").trim();
            const back = (cells[backIdx] ?? "").trim();
            if (!front || !back) return null;
            const hint = hintIdx >= 0 ? (cells[hintIdx] ?? "").trim() : "";
            return {
                id: placeholderId,
                front,
                back,
                ...(hint ? {hint} : {}),
            } as Locus;
        })
        .filter((c): c is Locus => c !== null);
    return {loci, questions: []};
}

/**
 * Parse pasted text into loci. Each non-empty line is one card, split on the
 * first tab, semicolon, or comma into `front` then `back`. Lines without a
 * separator (or an empty side) are skipped.
 */
export function parsePastedLoci(text: string): Locus[] {
    return text
        .split(/\r?\n/)
        .map((line) => {
            const trimmed = line.trim();
            if (!trimmed) return null;
            const m = trimmed.match(/^(.*?)[\t;,](.*)$/);
            if (!m) return null;
            const front = m[1].trim();
            const back = m[2].trim();
            if (!front || !back) return null;
            return {id: placeholderId, front, back} as Locus;
        })
        .filter((l): l is Locus => l !== null);
}

/**
 * Strip HTML to plain text. Anki notes store rich-text fields, so imported
 * cards need their tags, entities, and `<br>` line breaks reduced to text.
 */
export function stripHtml(input: string): string {
    return input
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/(p|div|li)>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

/** One chapter from an eBiblia paste: a title and its verse cards. */
export interface EBibliaChapter {
    /** The heading line, e.g. "3 Ioan 1" — used as the room title. */
    title: string;
    loci: Locus[];
}

/**
 * Parse the **eBiblia** verse format, grouped by chapter. Input looks like:
 *
 *   3 Ioan 1
 *   (1:1) Prezbiterul către preaiubitul Gaius...
 *   (1:2) preaiubitule, doresc...
 *
 * A header line ("Book Chapter", ending in a chapter number) opens a new
 * chapter; each `(chapter:verse) text` line becomes a card with
 * `front = "Book chapter:verse"` and `back = "Book chapter:verse text"`.
 * Lines that wrap a verse onto the next row are appended to it. Multiple
 * books/chapters in one paste each become their own chapter group.
 */
export function parseEBibliaChapters(text: string): EBibliaChapter[] {
    const verseRe = /^\((\d+):(\d+)\)\s*(.*)$/;
    // A header ends in a chapter number, optionally a range like "1:1-31".
    const headerRe = /^(.*\p{L})\s+\d+(?:\s*[-–:]\s*\d+)*\.?$/u;
    const chapterTail = /\s+\d+(?:\s*[-–:]\s*\d+)*\.?$/u;

    const chapters: EBibliaChapter[] = [];
    let current: EBibliaChapter | null = null;
    let book = "";
    let last: Locus | null = null;

    const ensureChapter = () => {
        if (!current) {
            current = {title: book || "Verses", loci: []};
            chapters.push(current);
        }
        return current;
    };

    for (const raw of text.split(/\r?\n/)) {
        const line = raw.trim();
        if (!line) continue;

        const verse = line.match(verseRe);
        if (verse) {
            const [, ch, vs, body] = verse;
            const ref = `${book ? `${book} ` : ""}${ch}:${vs}`.trim();
            const locus: Locus = {
                id: placeholderId,
                front: ref,
                back: body ? `${ref} ${body}`.trim() : ref,
            };
            ensureChapter().loci.push(locus);
            last = locus;
            continue;
        }

        if (headerRe.test(line)) {
            book = line.replace(chapterTail, "").trim();
            current = {title: line, loci: []};
            chapters.push(current);
            last = null;
            continue;
        }

        // Otherwise it's the previous verse wrapping onto a new line.
        if (last) last.back = `${last.back} ${line}`.trim();
    }

    // Drop headings that had no verses under them.
    return chapters.filter((c) => c.loci.length > 0);
}

/** Flatten an eBiblia paste into one locus per verse (chapter-agnostic). */
export function parseEBiblia(text: string): Locus[] {
    return parseEBibliaChapters(text).flatMap((c) => c.loci);
}

export class ContentImportError extends Error {}

/**
 * Read a `.json` or `.csv` file into room content. Throws
 * `ContentImportError` with a user-facing message when the file can't be read
 * as Mindscape content.
 */
export function importContentFile(file: File): Promise<RoomContent> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () =>
            reject(new ContentImportError("Couldn't read that file."));
        reader.onload = () => {
            const text = String(reader.result ?? "");
            const isCsv =
                file.name.toLowerCase().endsWith(".csv") ||
                (!file.name.toLowerCase().endsWith(".json") &&
                    !text.trimStart().startsWith("{"));
            try {
                let content: RoomContent;
                if (isCsv) {
                    content = contentFromCsv(parseCsv(text));
                } else {
                    const data = JSON.parse(text) as Record<string, unknown>;
                    content = {
                        // Accept the legacy `flashcards` key too.
                        loci: coerceLoci(data.loci ?? data.flashcards),
                        questions: coerceQuestions(data.questions),
                    };
                }
                if (
                    content.loci.length === 0 &&
                    content.questions.length === 0
                ) {
                    reject(
                        new ContentImportError(
                            "No loci or questions found in that file.",
                        ),
                    );
                    return;
                }
                resolve(content);
            } catch {
                reject(
                    new ContentImportError(
                        "That file isn't a valid Mindscape export (.json or .csv).",
                    ),
                );
            }
        };
        reader.readAsText(file);
    });
}
