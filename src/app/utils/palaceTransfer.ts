import type {Locus, Palace, Question, Room} from "../hooks/useProgressState";
import {coerceQuestions, lociToAnkiTSV} from "./contentUtils";

/**
 * Palace-level import / export. Round-trips whole palaces (and many at once) as
 * Mindscape JSON, and exports an Anki-ready text deck. The importer is lenient:
 * it accepts a single palace, an array, the multi-palace envelope, or a full
 * app backup, and rebuilds clean palaces (the store assigns fresh ids).
 */

const PALACE_TYPE = "mindscape-palace";
const EXPORT_TYPE = "mindscape-export";
const VERSION = 2;

/** Importable palace shape — ids are assigned by the store on insert. */
export type ImportedPalace = Omit<
    Palace,
    "id" | "progress" | "roomsCompleted" | "totalRooms"
>;

export class PalaceImportError extends Error {}

function download(filename: string, text: string, mime: string) {
    const blob = new Blob([text], {type: mime});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function slug(name: string): string {
    return (
        name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) ||
        "palace"
    );
}

// --- Export -----------------------------------------------------------------

/** A single palace as round-trippable Mindscape JSON. */
export function exportPalaceJSON(palace: Palace) {
    const envelope = {type: PALACE_TYPE, version: VERSION, exportedAt: new Date().toISOString(), palace};
    download(`${slug(palace.name)}.mindscape.json`, JSON.stringify(envelope, null, 2), "application/json");
}

/** Several palaces in one file. */
export function exportPalacesJSON(palaces: Palace[], label = "palaces") {
    const envelope = {
        type: EXPORT_TYPE,
        version: VERSION,
        exportedAt: new Date().toISOString(),
        palaces,
    };
    download(`${slug(label)}.mindscape.json`, JSON.stringify(envelope, null, 2), "application/json");
}

/** All of a palace's loci as an Anki "Notes in Plain Text" deck. */
export function exportPalaceAnki(palace: Palace) {
    const loci = (palace.rooms ?? []).flatMap((r) => r.loci ?? []);
    download(`${slug(palace.name)}-anki.txt`, lociToAnkiTSV(loci), "text/plain");
}

// --- Import -----------------------------------------------------------------

function asObject(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function coerceLocus(raw: unknown): Locus | null {
    const o = asObject(raw);
    const front = String(o.front ?? o.term ?? "").trim();
    const back = String(o.back ?? o.definition ?? "").trim();
    if (!front || !back) return null;
    return {
        id: "",
        front,
        back,
        ...(o.hint ? {hint: String(o.hint)} : {}),
        ...(o.tip ? {tip: String(o.tip)} : {}),
        // Preserve schedule and markers so a re-import keeps progress.
        ...(o.srs ? {srs: o.srs as Locus["srs"]} : {}),
        ...(o.flagged ? {flagged: true} : {}),
        ...(o.memorized ? {memorized: true} : {}),
    };
}

export function coerceRoom(raw: unknown): Room {
    const o = asObject(raw);
    const loci = (Array.isArray(o.loci) ? o.loci : Array.isArray(o.flashcards) ? o.flashcards : [])
        .map(coerceLocus)
        .filter((l): l is Locus => l !== null);
    const questions: Question[] = coerceQuestions(o.questions);
    return {
        id: "",
        title: String(o.title ?? "Room").trim() || "Room",
        description: String(o.description ?? "").trim(),
        duration: Number(o.duration) || 10,
        content: "",
        isUnlocked: o.isUnlocked !== false,
        isCompleted: !!o.isCompleted,
        progress: Number(o.progress) || 0,
        order: Number(o.order) || 0,
        loci,
        questions,
    };
}

function coercePalace(raw: unknown): ImportedPalace | null {
    const o = asObject(raw);
    const name = String(o.name ?? "").trim();
    const rooms = Array.isArray(o.rooms) ? o.rooms.map(coerceRoom) : [];
    // Need at least a name or some content to be worth importing.
    if (!name && rooms.length === 0) return null;
    return {
        name: name || "Imported palace",
        description: String(o.description ?? "").trim(),
        icon: String(o.icon ?? "🏛️"),
        color: String(o.color ?? "from-blue-500 to-cyan-500"),
        ...(typeof o.image === "string" ? {image: o.image} : {}),
        category: String(o.category ?? "General"),
        bibleMode: !!o.bibleMode,
        rooms,
        createdAt: typeof o.createdAt === "string" ? o.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

/** Pull a palace array out of whatever supported JSON shape was provided. */
function rawPalaces(data: unknown): unknown[] {
    const o = asObject(data);
    if (o.type === PALACE_TYPE && o.palace) return [o.palace];
    if (Array.isArray(o.palaces)) return o.palaces; // export envelope OR full app backup
    if (Array.isArray(data)) return data;
    if (o.name || o.rooms) return [data]; // a bare palace object
    return [];
}

/** Read a `.json` file into importable palaces. Throws `PalaceImportError`. */
export function parsePalacesFile(file: File): Promise<ImportedPalace[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new PalaceImportError("Couldn't read that file."));
        reader.onload = () => {
            try {
                const data = JSON.parse(String(reader.result ?? ""));
                const palaces = rawPalaces(data)
                    .map(coercePalace)
                    .filter((p): p is ImportedPalace => p !== null);
                if (palaces.length === 0) {
                    reject(new PalaceImportError("No palaces found in that file."));
                    return;
                }
                resolve(palaces);
            } catch {
                reject(new PalaceImportError("That isn't a valid Mindscape palace file (.json)."));
            }
        };
        reader.readAsText(file);
    });
}
