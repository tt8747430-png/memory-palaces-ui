import {motion} from "motion/react";
import {type Grade, nextIntervalLabel, type SrsState} from "../../utils/srs";
import {tapSmall} from "../../utils/motion";

/**
 * The four spaced-repetition grades, shared by the daily review and per-room
 * flashcard footers so the rating surface is identical everywhere (it was
 * duplicated verbatim in both screens before this).
 */
export const GRADE_META: {grade: Grade; label: string; classes: string}[] = [
    {grade: "again", label: "Again", classes: "bg-red-50 text-red-600 border-red-200"},
    {grade: "hard", label: "Hard", classes: "bg-amber-50 text-amber-700 border-amber-200"},
    {grade: "good", label: "Good", classes: "bg-[#EAF4FF] text-[#091A7A] border-[#ADC8FF]"},
    {grade: "easy", label: "Easy", classes: "bg-emerald-50 text-emerald-700 border-emerald-200"},
];

interface GradeButtonsProps {
    /** Current schedule, used to preview each grade's next interval. */
    srs?: SrsState;
    onGrade: (grade: Grade) => void;
}

/**
 * The "how well did you recall it?" rating row. Each button previews when the
 * card comes back (e.g. "2d", "1w"), and announces that to screen readers, so
 * the spaced-repetition consequence of each choice is legible.
 */
export function GradeButtons({srs, onGrade}: GradeButtonsProps) {
    return (
        <motion.div
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.2}}
        >
            <p className="text-center text-[12px] font-medium text-[#475569] mb-2.5">
                How well did you recall it?
            </p>
            <div className="grid grid-cols-4 gap-2.5">
                {GRADE_META.map(({grade, label, classes}) => {
                    const interval = nextIntervalLabel(srs, grade);
                    return (
                        <motion.button
                            key={grade}
                            {...tapSmall}
                            onClick={() => onGrade(grade)}
                            aria-label={`${label}. Next review in ${interval}.`}
                            className={`flex flex-col items-center gap-0.5 rounded-2xl border py-2.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#091A7A]/40 ${classes}`}
                        >
                            <span className="text-[14px] font-bold">{label}</span>
                            <span className="text-[10px] font-semibold opacity-70">{interval}</span>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}
