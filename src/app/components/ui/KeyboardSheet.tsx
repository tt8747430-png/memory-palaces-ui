import {type ReactNode, useEffect} from "react";
import {createPortal} from "react-dom";
import {AnimatePresence, motion} from "motion/react";
import {X} from "lucide-react";
import {useKeyboardInset} from "../../hooks/useKeyboardInset";

interface KeyboardSheetProps {
    open: boolean;
    onClose: () => void;
    title: string;
    /** Scrollable field area. */
    children: ReactNode;
    /** Pinned action area, kept above the keyboard. */
    footer?: ReactNode;
}

/**
 * A bottom sheet whose bottom edge tracks the on-screen keyboard, so the input
 * fields and the primary action stay visible just above the keys instead of
 * being covered (the pattern in Anki / Todoist composers). Falls back to a
 * normal bottom sheet with safe-area padding when no keyboard is shown.
 */
export function KeyboardSheet({
                                 open,
                                 onClose,
                                 title,
                                 children,
                                 footer,
                             }: KeyboardSheetProps) {
    const inset = useKeyboardInset();

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    return createPortal(
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        key="overlay"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.2}}
                        onClick={onClose}
                        className="fixed inset-0 z-[120] bg-[#091A7A]/40 backdrop-blur-[2px]"
                    />
                    <motion.div
                        key="sheet"
                        initial={{y: "100%"}}
                        animate={{y: 0}}
                        exit={{y: "100%"}}
                        transition={{type: "spring", stiffness: 420, damping: 38, mass: 0.9}}
                        style={{
                            bottom: inset,
                            maxHeight: `calc(92dvh - ${inset}px)`,
                        }}
                        className="fixed left-0 right-0 z-[121] bg-white rounded-t-[24px] shadow-[0_-12px_40px_rgba(9,26,122,0.18)] flex flex-col overflow-hidden"
                    >
                        <div className="mx-auto w-10 h-1 rounded-full bg-[#091A7A]/15 mt-2.5"/>
                        <div className="flex items-center justify-between px-5 pt-2 pb-3">
                            <h2 className="text-[17px] font-bold text-[#091A7A]">{title}</h2>
                            <button
                                onClick={onClose}
                                aria-label="Close"
                                className="w-9 h-9 rounded-full bg-[#F4F8FF] flex items-center justify-center text-[#091A7A] active:scale-95 transition-transform"
                            >
                                <X size={18}/>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-4 space-y-4">
                            {children}
                        </div>
                        {footer && (
                            <div className="px-5 pt-3 pb-[max(env(safe-area-inset-bottom),1rem)] border-t border-[#091A7A]/[0.07] bg-white space-y-2.5">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body,
    );
}
