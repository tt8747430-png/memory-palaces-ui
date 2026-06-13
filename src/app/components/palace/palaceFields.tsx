import {type ChangeEvent, useRef} from "react";
import {motion} from "motion/react";
import {Check, ImagePlus, Plus, Trash2} from "lucide-react";
import {toast} from "sonner";
import {PalaceCover} from "../cards/PalaceCover";
import {fileToCoverDataUrl} from "../../utils/image";
import {colorOptions, iconOptions} from "./palaceForm";

/**
 * Shared palace appearance pickers, in the daylight (white/navy) palette so the
 * create sheet and the settings screen present them identically. Lifted out of
 * the old navy-gradient PalaceEditor so there's one source of truth.
 */

export function IconPicker({
                               value,
                               onChange,
                           }: {
    value: string;
    onChange: (icon: string) => void;
}) {
    return (
        <div className="grid grid-cols-6 gap-2.5" role="radiogroup" aria-label="Palace icon">
            {iconOptions.map((option) => {
                const active = value === option;
                return (
                    <motion.button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        whileTap={{scale: 0.9}}
                        onClick={() => onChange(option)}
                        className={`aspect-square rounded-xl flex items-center justify-center text-[24px] transition-colors ${
                            active
                                ? "bg-white shadow-card ring-2 ring-[#091A7A]"
                                : "bg-[#F4F8FF] active:bg-[#EAF4FF]"
                        }`}
                    >
                        {option}
                    </motion.button>
                );
            })}
        </div>
    );
}

export function ColorPicker({
                                value,
                                onChange,
                            }: {
    value: string;
    onChange: (color: string) => void;
}) {
    const isCustom = !value?.startsWith("from-");
    return (
        <div className="grid grid-cols-5 gap-3" role="radiogroup" aria-label="Color scheme">
            {colorOptions.map((option) => {
                const active = value === option.value;
                return (
                    <motion.button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        aria-label={option.name}
                        whileTap={{scale: 0.92}}
                        onClick={() => onChange(option.value)}
                        className={`relative aspect-square rounded-2xl bg-gradient-to-br ${option.value} shadow-card flex items-center justify-center transition-transform ${
                            active ? "ring-2 ring-[#091A7A] ring-offset-2 ring-offset-white" : ""
                        }`}
                    >
                        {active && <Check className="w-5 h-5 text-white drop-shadow"/>}
                    </motion.button>
                );
            })}

            {/* Free custom color */}
            <label
                aria-label="Custom color"
                className={`relative aspect-square rounded-2xl shadow-card flex items-center justify-center cursor-pointer transition-transform ${
                    isCustom ? "ring-2 ring-[#091A7A] ring-offset-2 ring-offset-white" : ""
                }`}
                style={
                    isCustom
                        ? {
                              backgroundImage: `linear-gradient(135deg, ${value}, color-mix(in oklab, ${value}, #000 22%))`,
                          }
                        : {
                              backgroundImage:
                                  "conic-gradient(from 180deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ef4444)",
                          }
                }
            >
                <input
                    type="color"
                    value={isCustom && value.startsWith("#") ? value : "#7C3AED"}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
                {isCustom ? (
                    <Check className="w-5 h-5 text-white drop-shadow"/>
                ) : (
                    <Plus className="w-5 h-5 text-[#091A7A] drop-shadow"/>
                )}
            </label>
        </div>
    );
}

export function CoverField({
                               icon,
                               color,
                               image,
                               onPick,
                               onRemove,
                           }: {
    icon: string;
    color: string;
    image?: string;
    onPick: (dataUrl: string) => void;
    onRemove: () => void;
}) {
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        try {
            onPick(await fileToCoverDataUrl(file));
        } catch {
            toast.error("Couldn't use that image. Try another.");
        }
    };

    return (
        <div>
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
            />
            {image ? (
                <div className="flex items-center gap-3">
                    <PalaceCover
                        icon={icon}
                        color={color}
                        image={image}
                        hideIcon
                        className="w-16 h-16 rounded-2xl flex-shrink-0 shadow-card"
                    />
                    <div className="flex flex-1 gap-2">
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="flex-1 py-3 rounded-2xl bg-[#EAF4FF] text-[#091A7A] text-[14px] font-semibold active:scale-[0.98] transition-transform"
                        >
                            Replace
                        </button>
                        <button
                            type="button"
                            aria-label="Remove cover photo"
                            onClick={onRemove}
                            className="w-12 flex-shrink-0 rounded-2xl bg-[#F4F8FF] text-[#091A7A] flex items-center justify-center active:scale-[0.98] transition-transform"
                        >
                            <Trash2 size={18}/>
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 py-5 rounded-2xl border-2 border-dashed border-[#091A7A]/20 bg-[#F4F8FF] text-[#091A7A] text-[14px] font-semibold active:bg-[#EAF4FF] transition-colors"
                >
                    <ImagePlus size={18}/>
                    Upload a photo
                </button>
            )}
        </div>
    );
}
