import {motion} from "motion/react";
import {useProgressState} from "../../hooks/useProgressState";
import {PalaceEditor} from "./PalaceEditor";
import {PalaceFormData} from "./palaceForm";

interface CreatePalaceScreenProps {
    onBack: () => void;
    /** Called with the new palace's id so the caller can navigate into it. */
    onSuccess: (palaceId: string) => void;
}

const CREATE_DEFAULTS: PalaceFormData = {
    name: "",
    description: "",
    category: "",
    icon: "🏛️",
    color: "from-purple-500 to-pink-500",
};

/**
 * Full-screen create flow. Previously a vaul drawer, which fought the keyboard
 * handling on iOS; a plain full-screen sheet gives the form room to breathe and
 * keeps the footer reliably docked above the keyboard (see PalaceEditor).
 */
export function CreatePalaceScreen({onBack, onSuccess}: CreatePalaceScreenProps) {
    const {actions} = useProgressState();

    const handleSubmit = (data: PalaceFormData) => {
        const palaceId = actions.createPalace({
            name: data.name.trim(),
            description: data.description.trim(),
            category: data.category,
            icon: data.icon,
            color: data.color,
        });
        onSuccess(palaceId);
    };

    return (
        <motion.div
            initial={{y: "100%"}}
            animate={{y: 0}}
            exit={{y: "100%"}}
            transition={{type: "spring", stiffness: 360, damping: 38, mass: 0.9}}
            className="fixed inset-0 z-[100]"
        >
            <PalaceEditor
                mode="create"
                initial={CREATE_DEFAULTS}
                onSubmit={handleSubmit}
                onClose={onBack}
                safeTop
            />
        </motion.div>
    );
}
