import {Chip} from "../ui/Chip";
import {type SrsState, srsStatus} from "../../utils/srs";

const META = {
    new: {tone: "neutral", label: "New"},
    due: {tone: "navy", label: "Due"},
    learning: {tone: "amber", label: "Learning"},
    known: {tone: "emerald", label: "Known"},
} as const;

/**
 * A one-glance badge for a card's spaced-repetition status (New / Due /
 * Learning / Known), so the schedule is visible wherever loci are shown.
 */
export function SrsStatusChip({srs, size = "sm"}: {srs?: SrsState; size?: "sm" | "md"}) {
    const {tone, label} = META[srsStatus(srs)];
    return (
        <Chip tone={tone} size={size}>
            {label}
        </Chip>
    );
}
