import {useEffect, useRef, useState} from "react";

export type SaveStatus = "saving" | "saved" | "error";

const SAVE_DURATION = 300;
const SAVED_DISPLAY_DURATION = 1500;
const ERROR_DISPLAY_DURATION = 3000;

export function useSaveStatus() {
    const [saveStatus, setSaveStatus] =
        useState<SaveStatus>("saved");
    const [showIndicator, setShowIndicator] = useState(false);
    const timeoutRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const triggerSave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setSaveStatus("saving");
        setShowIndicator(true);

        timeoutRef.current = window.setTimeout(() => {
            setSaveStatus("saved");

            timeoutRef.current = window.setTimeout(() => {
                setShowIndicator(false);
            }, SAVED_DISPLAY_DURATION);
        }, SAVE_DURATION);
    };

    const triggerError = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setSaveStatus("error");
        setShowIndicator(true);

        timeoutRef.current = window.setTimeout(() => {
            setShowIndicator(false);
        }, ERROR_DISPLAY_DURATION);
    };

    return {
        saveStatus,
        showIndicator,
        triggerSave,
        triggerError,
    };
}

export function calculateLevel(xp: number) {
    const baseXP = 250;
    const currentLevel = Math.floor(xp / baseXP) + 1;
    const xpInCurrentLevel = xp % baseXP;
    const xpForNextLevel = baseXP;

    return {
        currentLevel,
        xpForNextLevel,
        xpInCurrentLevel,
    };
}