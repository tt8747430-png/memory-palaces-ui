import {motion} from "motion/react";
import {Check} from "lucide-react";
import {categoryOptions, colorOptions, iconOptions} from "./palaceForm";

/**
 * Shared pickers for the palace create/edit dialogs. Both screens render on
 * the drenched navy→sky flow gradient, so the white-on-blue styling is baked
 * in here; recolor deliberately if these ever move to a daylight surface.
 */

/** Validation message, legible on any flow-gradient stop. */
export function FieldError({message}: { message?: string }) {
    if (!message) return null;
    return (
        <p
            role="alert"
            className="mt-2 inline-block rounded-lg bg-[#B91C1C]/90 px-2.5 py-1 text-[12px] font-medium text-white"
        >
            {message}
        </p>
    );
}

/** The palace card preview: selected icon over the selected gradient. */
export function PalacePreview({
                                  icon,
                                  color,
                                  size = "md",
                              }: {
    icon: string;
    color: string;
    size?: "md" | "lg";
}) {
    const box = size === "lg" ? "w-32 h-32 text-[64px]" : "w-24 h-24 text-[56px]";
    return (
        <div className="flex items-center justify-center">
            <motion.div
                key={`${icon}-${color}`}
                initial={{scale: 0.9, opacity: 0.6}}
                animate={{scale: 1, opacity: 1}}
                transition={{duration: 0.25, ease: [0.16, 1, 0.3, 1]}}
                className={`${box} rounded-3xl bg-gradient-to-br ${color} flex items-center justify-center shadow-2xl`}
            >
                <span>{icon}</span>
            </motion.div>
        </div>
    );
}

export function CategoryGrid({
                                 value,
                                 onChange,
                             }: {
    value: string;
    onChange: (category: string) => void;
}) {
    return (
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Category">
            {categoryOptions.map((category) => (
                <motion.button
                    key={category}
                    type="button"
                    role="radio"
                    aria-checked={value === category}
                    whileTap={{scale: 0.96}}
                    onClick={() => onChange(category)}
                    className={`px-4 py-3 rounded-2xl font-medium text-[14px] transition-all ${
                        value === category
                            ? "bg-white text-[#091A7A] shadow-md"
                            : "bg-white/20 text-white"
                    }`}
                >
                    {category}
                </motion.button>
            ))}
        </div>
    );
}

export function IconGrid({
                             value,
                             onChange,
                         }: {
    value: string;
    onChange: (icon: string) => void;
}) {
    return (
        <div className="grid grid-cols-5 gap-3" role="radiogroup" aria-label="Palace icon">
            {iconOptions.map((icon) => (
                <motion.button
                    key={icon}
                    type="button"
                    role="radio"
                    aria-checked={value === icon}
                    whileTap={{scale: 0.9}}
                    onClick={() => onChange(icon)}
                    className={`aspect-square rounded-2xl flex items-center justify-center text-[28px] transition-all ${
                        value === icon
                            ? "bg-white shadow-lg"
                            : "bg-white/20 active:bg-white/30"
                    }`}
                >
                    {icon}
                </motion.button>
            ))}
        </div>
    );
}

export function ColorList({
                              value,
                              onChange,
                          }: {
    value: string;
    onChange: (color: string) => void;
}) {
    return (
        <div className="space-y-3" role="radiogroup" aria-label="Color scheme">
            {colorOptions.map((color) => (
                <motion.button
                    key={color.value}
                    type="button"
                    role="radio"
                    aria-checked={value === color.value}
                    whileTap={{scale: 0.98}}
                    onClick={() => onChange(color.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                        value === color.value
                            ? "bg-white shadow-lg"
                            : "bg-white/20 active:bg-white/30"
                    }`}
                >
                    <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.value} flex-shrink-0 shadow-md`}
                    />
                    <span
                        className={`font-medium text-[15px] ${
                            value === color.value ? "text-[#091A7A]" : "text-white"
                        }`}
                    >
                        {color.name}
                    </span>
                    {value === color.value && (
                        <Check size={20} className="text-[#091A7A] ml-auto"/>
                    )}
                </motion.button>
            ))}
        </div>
    );
}
