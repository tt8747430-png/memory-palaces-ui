import {useProgressState} from "../../hooks/useProgressState";
import {PalaceEditor} from "./PalaceEditor";
import {PalaceFormData} from "./palaceForm";

interface EditPalaceScreenProps {
    palaceId: string;
    onBack: () => void;
    onSuccess: () => void;
}

export function EditPalaceScreen({palaceId, onBack, onSuccess}: EditPalaceScreenProps) {
    const {state, actions} = useProgressState();
    const palace = state.palaces.find((p) => p.id === palaceId);

    if (!palace) {
        return (
            <div className="h-full flex items-center justify-center bg-[#091A7A]">
                <p className="text-white text-[15px]">Palace not found</p>
            </div>
        );
    }

    const initial: PalaceFormData = {
        name: palace.name,
        description: palace.description,
        category: palace.category,
        icon: palace.icon,
        color: palace.color,
        image: palace.image,
        bibleMode: palace.bibleMode ?? false,
    };

    const handleSubmit = (data: PalaceFormData) => {
        actions.updatePalace(palaceId, {
            name: data.name.trim(),
            description: data.description.trim(),
            category: data.category,
            icon: data.icon,
            color: data.color,
            image: data.image || undefined,
            bibleMode: data.bibleMode,
        });
        onSuccess();
    };

    return (
        <PalaceEditor
            mode="edit"
            initial={initial}
            onSubmit={handleSubmit}
            onClose={onBack}
            safeTop
        />
    );
}
