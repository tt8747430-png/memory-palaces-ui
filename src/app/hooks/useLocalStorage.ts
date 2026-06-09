import {useCallback, useEffect, useState} from "react";

/**
 * Fired on `window` after any `useLocalStorage` setter writes, so every hook
 * instance in THIS tab re-reads. The native `storage` event only covers other
 * tabs, which left sibling components (e.g. HomePage vs. PalaceDetailScreen,
 * which each own a `useProgressState()`) holding stale state until reload.
 */
const LOCAL_STORAGE_EVENT = "local-storage";

function readValue<T>(key: string, initialValue: T): T {
    try {
        const item = localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
        // Corrupted JSON or storage access denied: fall back rather than crash.
        return initialValue;
    }
}

export function useLocalStorage<T>(
    key: string,
    initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() =>
        readValue(key, initialValue),
    );

    const setValue = useCallback(
        (value: T | ((val: T) => T)) => {
            // localStorage is the source of truth: deriving updates from it (not
            // from this instance's state) keeps concurrent hook instances correct.
            const newValue =
                value instanceof Function
                    ? value(readValue(key, initialValue))
                    : value;
            try {
                localStorage.setItem(key, JSON.stringify(newValue));
            } catch {
                // Quota exceeded / private mode: keep the in-memory value usable.
            }
            setStoredValue(newValue);
            window.dispatchEvent(
                new CustomEvent(LOCAL_STORAGE_EVENT, {detail: {key}}),
            );
        },
        [key],
    );

    useEffect(() => {
        const handleStorageChange = (e: Event) => {
            if (e instanceof StorageEvent) {
                // Another tab wrote this key.
                if (e.key === key && e.newValue !== null) {
                    try {
                        setStoredValue(JSON.parse(e.newValue) as T);
                    } catch {
                        // Ignore unparseable cross-tab writes.
                    }
                }
            } else if ((e as CustomEvent).detail?.key === key) {
                // Another hook instance in this tab wrote this key.
                setStoredValue(readValue(key, initialValue));
            }
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener(LOCAL_STORAGE_EVENT, handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener(LOCAL_STORAGE_EVENT, handleStorageChange);
        };
    }, [key]);

    return [storedValue, setValue];
}
