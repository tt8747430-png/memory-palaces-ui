import type {Locus} from "../hooks/useProgressState";
import {ContentImportError, type RoomContent, stripHtml} from "./contentUtils";
// Vite serves this as a hashed asset URL (a string), so it adds no weight to
// the main bundle; the wasm binary is only fetched if an .apkg is imported.
import sqlWasmUrl from "sql.js/dist/sql-wasm.wasm?url";

/** Anki joins a note's fields with the ASCII unit-separator. */
const FIELD_SEPARATOR = String.fromCharCode(0x1f);

/**
 * Import an Anki export into room content (loci only).
 *
 * Two shapes are handled:
 *  - **Plain text** (`.txt` / `.tsv`): Anki's "Notes in Plain Text" export —
 *    tab-separated fields, `#`-prefixed directive lines skipped. (Also the
 *    format Quizlet/Anki copy-paste produces.) No dependencies.
 *  - **`.apkg` / `.colpkg`**: a zip containing a SQLite collection. We unzip
 *    (fflate) and read the `notes` table (sql.js), both lazily imported.
 *
 * Field 0 of each note becomes `front`, field 1 becomes `back`; HTML is
 * stripped. The newest zstd-compressed `collection.anki21b` can't be read in
 * the browser — we surface a clear "re-export as plain text" message.
 */
export async function importAnkiFile(file: File): Promise<RoomContent> {
    const name = file.name.toLowerCase();
    const isZip = name.endsWith(".apkg") || name.endsWith(".colpkg");

    const loci = isZip
        ? await lociFromApkg(file)
        : lociFromText(await file.text());

    if (loci.length === 0) {
        throw new ContentImportError("No cards found in that Anki file.");
    }
    return {loci, questions: []};
}

/** Build a locus from two fields, dropping empties. */
function toLocus(front: string, back: string): Locus | null {
    const f = stripHtml(front);
    const b = stripHtml(back);
    if (!f || !b) return null;
    return {id: "", front: f, back: b};
}

const SEPARATORS: Record<string, string> = {
    tab: "\t",
    comma: ",",
    semicolon: ";",
    space: " ",
    pipe: "|",
    colon: ":",
};

function lociFromText(text: string): Locus[] {
    let separator = "\t";
    const loci: Locus[] = [];
    for (const raw of text.split(/\r?\n/)) {
        const line = raw.replace(/\r$/, "");
        if (!line.trim()) continue;
        // Anki directive lines: "#separator:tab", "#html:true", "#columns:…".
        if (line.startsWith("#")) {
            const sep = line.match(/^#separator:(.+)$/i)?.[1]?.trim();
            if (sep) separator = SEPARATORS[sep.toLowerCase()] ?? sep;
            continue;
        }
        const fields = line.split(separator);
        if (fields.length < 2) continue;
        const locus = toLocus(fields[0], fields[1]);
        if (locus) loci.push(locus);
    }
    return loci;
}

async function lociFromApkg(file: File): Promise<Locus[]> {
    const {unzipSync} = await import("fflate");
    const buffer = new Uint8Array(await file.arrayBuffer());

    let entries: Record<string, Uint8Array>;
    try {
        entries = unzipSync(buffer);
    } catch {
        throw new ContentImportError("That Anki file couldn't be unpacked.");
    }

    // Prefer the legacy uncompressed collections sql.js can read.
    const dbName =
        ["collection.anki2", "collection.anki21"].find((n) => entries[n]) ?? null;
    if (!dbName) {
        if (entries["collection.anki21b"]) {
            throw new ContentImportError(
                "This deck uses Anki's newest format. In Anki, export it again with " +
                    "“Support older Anki versions”, or as Notes in Plain Text (.txt).",
            );
        }
        throw new ContentImportError("No Anki collection found in that file.");
    }

    const initSqlJs = (await import("sql.js")).default;
    const SQL = await initSqlJs({locateFile: () => sqlWasmUrl});
    const db = new SQL.Database(entries[dbName]);
    try {
        const result = db.exec("SELECT flds FROM notes");
        const rows = result[0]?.values ?? [];
        const loci: Locus[] = [];
        for (const [flds] of rows) {
            const fields = String(flds ?? "").split(FIELD_SEPARATOR);
            const locus = toLocus(fields[0] ?? "", fields[1] ?? "");
            if (locus) loci.push(locus);
        }
        return loci;
    } finally {
        db.close();
    }
}
