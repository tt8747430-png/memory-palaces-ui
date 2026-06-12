import {useEffect} from "react";
import {useLocalStorage} from "./useLocalStorage";
import {setHapticsEnabled} from "../utils/haptics";
import {setSoundEnabled} from "../utils/sound";

/**
 * App-wide user preferences. One persisted object replaces the handful of
 * loose `mindscape:*` keys settings used to write individually, so any screen
 * can read or change a preference and stay in sync (the `useLocalStorage`
 * primitive broadcasts writes across hook instances and tabs).
 *
 * Three of these drive real behavior on change: `haptics` and `soundEffects`
 * sync module-level flags in the haptics/sound utils, and `reducedMotion` is
 * read by the root to override Motion's global config. `darkMode` is kept and
 * persisted but intentionally not applied (the app is a daylit design); the
 * toggle stays so the preference survives for a future theme.
 */
export interface Preferences {
    /** Play short confirmation tones on answers and session completion. */
    soundEffects: boolean;
    /** Vibrate on swipe thresholds and commits (supported devices only). */
    haptics: boolean;
    /** Force reduced motion app-wide, regardless of the OS setting. */
    reducedMotion: boolean;
    /** Show in-app milestone notifications (level-ups, streaks, completions). */
    notifications: boolean;
    /** Persisted only; the app stays daylit (see note above). */
    darkMode: boolean;
    /** UI language code. */
    language: string;
    /** Default room view inside a palace: spatial journey map or list. */
    roomView: "map" | "list";
}

export const DEFAULT_PREFERENCES: Preferences = {
    soundEffects: true,
    haptics: true,
    reducedMotion: false,
    notifications: true,
    darkMode: false,
    language: "en",
    roomView: "map",
};

const PREFERENCES_KEY = "mindscape:preferences";

/** Legacy individual keys settings wrote before the consolidated object. */
const LEGACY_KEYS = {
    notifications: "mindscape:notifications",
    darkMode: "mindscape:darkMode",
    language: "mindscape:language",
} as const;

/** Read a legacy boolean/string key, returning undefined when absent/invalid. */
function readLegacy<T>(key: string): T | undefined {
    try {
        const raw = localStorage.getItem(key);
        return raw === null ? undefined : (JSON.parse(raw) as T);
    } catch {
        return undefined;
    }
}

/** Merge defaults, any pre-consolidation keys, then the saved object on top. */
function withLegacyFallback(stored: Partial<Preferences>): Preferences {
    return {
        ...DEFAULT_PREFERENCES,
        notifications:
            readLegacy<boolean>(LEGACY_KEYS.notifications) ??
            DEFAULT_PREFERENCES.notifications,
        darkMode:
            readLegacy<boolean>(LEGACY_KEYS.darkMode) ??
            DEFAULT_PREFERENCES.darkMode,
        language:
            readLegacy<string>(LEGACY_KEYS.language) ??
            DEFAULT_PREFERENCES.language,
        ...stored,
    };
}

export function usePreferences() {
    const [raw, setRaw] = useLocalStorage<Partial<Preferences>>(
        PREFERENCES_KEY,
        {},
    );
    const preferences = withLegacyFallback(raw);

    const setPreference = <K extends keyof Preferences>(
        key: K,
        value: Preferences[K],
    ) => {
        setRaw((prev) => ({...withLegacyFallback(prev), [key]: value}));
    };

    // Mirror the behavior-driving prefs into their module flags whenever they
    // change. Idempotent, so it's safe for multiple hook instances to run it.
    useEffect(() => {
        setHapticsEnabled(preferences.haptics);
        setSoundEnabled(preferences.soundEffects);
    }, [preferences.haptics, preferences.soundEffects]);

    return {preferences, setPreference};
}
