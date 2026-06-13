import {useEffect, useState} from "react";
import {BookOpen, Sparkles} from "lucide-react";
import {useProgressState} from "../../hooks/useProgressState";
import {KeyboardSheet} from "../ui/KeyboardSheet";
import {Input} from "../ui/input";
import {PalaceCover} from "../cards/PalaceCover";
import {ColorPicker, IconPicker} from "./palaceFields";

interface CreatePalaceScreenProps {
    open: boolean;
    onClose: () => void;
    /** Called with the new palace's id so the caller can navigate into it. */
    onSuccess: (palaceId: string) => void;
}

const DEFAULT_ICON = "🏛️";
const DEFAULT_COLOR = "from-purple-500 to-pink-500";

/**
 * Minimal create: a name, a quick icon and color, and the Bible-mode choice.
 * Everything else (description, category, cover) is set later in the palace
 * settings, so making a palace is a couple of taps. A keyboard-aware bottom
 * sheet, not a full-screen drawer.
 */
export function CreatePalaceScreen({open, onClose, onSuccess}: CreatePalaceScreenProps) {
    const {actions} = useProgressState();
    const [name, setName] = useState("");
    const [icon, setIcon] = useState(DEFAULT_ICON);
    const [color, setColor] = useState(DEFAULT_COLOR);
    const [bibleMode, setBibleMode] = useState(false);

    // Fresh state every time the sheet opens.
    useEffect(() => {
        if (open) {
            setName("");
            setIcon(DEFAULT_ICON);
            setColor(DEFAULT_COLOR);
            setBibleMode(false);
        }
    }, [open]);

    const valid = name.trim().length >= 2;

    const create = () => {
        if (!valid) return;
        const palaceId = actions.createPalace({
            name: name.trim(),
            description: "",
            category: bibleMode ? "Scripture" : "General",
            icon,
            color,
            bibleMode,
        });
        onSuccess(palaceId);
    };

    return (
        <KeyboardSheet
            open={open}
            onClose={onClose}
            title="New palace"
            footer={
                <button
                    onClick={create}
                    disabled={!valid}
                    className={`w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                        valid
                            ? "bg-[#091A7A] text-white shadow-[0_8px_20px_rgba(9,26,122,0.25)] active:scale-[0.98]"
                            : "bg-[#E2E8F0] text-[#94a3b8] cursor-not-allowed"
                    }`}
                >
                    <Sparkles size={18}/>
                    Create palace
                </button>
            }
        >
            {/* Live preview + name */}
            <div className="flex items-center gap-3.5">
                <PalaceCover
                    icon={icon}
                    color={color}
                    className="w-16 h-16 rounded-2xl flex-shrink-0 shadow-card"
                    iconClassName="text-[34px]"
                />
                <div className="flex-1 min-w-0">
                    <label
                        htmlFor="create-palace-name"
                        className="block text-[13px] font-semibold text-[#091A7A] mb-1.5"
                    >
                        Name
                    </label>
                    <Input
                        id="create-palace-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && create()}
                        placeholder="e.g., Ancient Rome"
                        autoFocus
                        enterKeyHint="done"
                        className="w-full bg-[#F4F8FF] rounded-xl px-4 h-12 text-[15px] text-[#091A7A] placeholder:text-[#091A7A]/45 outline-none border-2 border-transparent focus:border-[#4F8EFF]/60 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Bible mode */}
            <button
                role="switch"
                aria-checked={bibleMode}
                aria-label="Bible mode"
                onClick={() => setBibleMode((b) => !b)}
                className="flex w-full items-center gap-3.5 rounded-2xl bg-[#F4F8FF] px-4 py-3 text-left transition-transform active:scale-[0.99]"
            >
                <span
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                        bibleMode ? "bg-[#091A7A] text-white" : "bg-white text-[#091A7A]"
                    }`}
                >
                    <BookOpen size={20}/>
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-semibold text-[#091A7A]">
                        Bible mode
                    </span>
                    <span className="mt-0.5 block text-[12px] leading-snug text-[#475569]">
                        Each locus is a verse. Unlocks Blur, Words, Initials &amp; Type.
                    </span>
                </span>
                <span
                    className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors ${
                        bibleMode ? "bg-[#091A7A]" : "bg-[#CBD5E1]"
                    }`}
                >
                    <span
                        className={`absolute top-0.5 block h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                            bibleMode ? "translate-x-[22px]" : "translate-x-0.5"
                        }`}
                    />
                </span>
            </button>

            <div>
                <p className="mb-2 text-[13px] font-semibold text-[#091A7A]">Icon</p>
                <IconPicker value={icon} onChange={setIcon}/>
            </div>

            <div>
                <p className="mb-2 text-[13px] font-semibold text-[#091A7A]">Color</p>
                <ColorPicker value={color} onChange={setColor}/>
            </div>

            <p className="text-center text-[12px] text-[#64748b]">
                Add a description, category, and cover later in palace settings.
            </p>
        </KeyboardSheet>
    );
}
