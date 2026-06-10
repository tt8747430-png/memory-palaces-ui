import {Drawer} from "vaul";
import {useProgressState} from "../../hooks/useProgressState";
import {PalaceEditor} from "./PalaceEditor";
import {PalaceFormData} from "./palaceForm";

interface CreatePalaceScreenProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onBack?: () => void;
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

export function CreatePalaceScreen({
                                       open = true,
                                       onOpenChange,
                                       onBack,
                                       onSuccess,
                                   }: CreatePalaceScreenProps) {
    const {actions} = useProgressState();

    const close = () => {
        onOpenChange?.(false);
        onBack?.();
    };

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
        <Drawer.Root
            open={open}
            onOpenChange={(isOpen) => {
                onOpenChange?.(isOpen);
                if (!isOpen) onBack?.();
            }}
        >
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-[#091A7A]/40 z-[100]"/>
                <Drawer.Content
                    aria-describedby={undefined}
                    className="bg-[#091A7A] flex flex-col rounded-t-[16px] h-[96%] mt-24 fixed bottom-0 left-0 right-0 z-[101] outline-none overflow-hidden"
                >
                    <Drawer.Title className="sr-only">Create Palace</Drawer.Title>
                    <div className="pt-3 flex-1 flex flex-col overflow-hidden">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-white/50 mb-1"/>
                        <div className="flex-1 overflow-hidden">
                            <PalaceEditor
                                mode="create"
                                initial={CREATE_DEFAULTS}
                                onSubmit={handleSubmit}
                                onClose={close}
                            />
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
