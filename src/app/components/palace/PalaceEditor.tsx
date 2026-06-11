import {type ChangeEvent, type ReactNode, useRef} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {motion} from "motion/react";
import {ArrowLeft, Check, ImagePlus, Plus, Save, Sparkles, Trash2} from "lucide-react";
import {toast} from "sonner";
import {DynamicBackground} from "../DynamicBackground";
import {AmbientParticles} from "../AmbientParticles";
import {PalaceCover} from "../cards/PalaceCover";
import {Input} from "../ui/input";
import {Textarea} from "../ui/textarea";
import {useKeyboardInset} from "../../hooks/useKeyboardInset";
import {fileToCoverDataUrl} from "../../utils/image";
import {
    categoryOptions,
    colorOptions,
    iconOptions,
    PalaceFormData,
    palaceFormSchema,
} from "./palaceForm";

interface PalaceEditorProps {
    mode: "create" | "edit";
    initial: PalaceFormData;
    onSubmit: (data: PalaceFormData) => void;
    onClose: () => void;
    /** Edit renders full-screen (needs notch clearance); create lives in a drawer. */
    safeTop?: boolean;
}

const FORM_ID = "palace-form";

/**
 * The one palace editor used by both create and edit. A live preview hero sits
 * above a single scrolling form (Details → Appearance), so the two flows can
 * never drift and the user always sees exactly what they're building.
 */
export function PalaceEditor({
                                 mode,
                                 initial,
                                 onSubmit,
                                 onClose,
                                 safeTop = false,
                             }: PalaceEditorProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        formState: {errors, isValid},
    } = useForm<PalaceFormData>({
        resolver: zodResolver(palaceFormSchema),
        defaultValues: initial,
        mode: "onChange",
    });

    const name = watch("name");
    const category = watch("category");
    const icon = watch("icon");
    const color = watch("color");
    const image = watch("image");
    const keyboardInset = useKeyboardInset();
    const fileRef = useRef<HTMLInputElement>(null);

    const isCreate = mode === "create";
    const isCustomColor = !color?.startsWith("from-");

    const handlePickImage = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        try {
            const dataUrl = await fileToCoverDataUrl(file);
            setValue("image", dataUrl, {shouldDirty: true});
        } catch {
            toast.error("Couldn't use that image. Try another.");
        }
    };

    return (
        <div className="size-full flex flex-col relative bg-[#091A7A]">
            <DynamicBackground/>
            <AmbientParticles/>

            <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
                {/* Header + live preview */}
                <div className="relative flex-shrink-0 bg-gradient-to-b from-[#091A7A]/95 to-[#4F8EFF]/95 backdrop-blur-md pb-5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.12),transparent_55%)]"/>

                    <div className="relative z-10">
                        {safeTop && <div className="h-safe-top"/>}

                        <div className="px-6 flex items-center justify-between mt-3 mb-5">
                            <motion.button
                                type="button"
                                whileTap={{scale: 0.92}}
                                aria-label="Close"
                                onClick={onClose}
                                className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                            >
                                <ArrowLeft className="w-4 h-4 text-white"/>
                            </motion.button>
                            <h1 className="text-[16px] font-bold text-white">
                                {isCreate ? "Create palace" : "Edit palace"}
                            </h1>
                            <div className="w-11"/>
                        </div>

                        {/* Live preview */}
                        <div className="px-6 flex items-center gap-4">
                            <motion.div
                                key={`${icon}-${color}-${image ? "img" : "no"}`}
                                initial={{scale: 0.85, opacity: 0.5}}
                                animate={{scale: 1, opacity: 1}}
                                transition={{duration: 0.25, ease: [0.16, 1, 0.3, 1]}}
                                className="flex-shrink-0"
                            >
                                <PalaceCover
                                    icon={icon}
                                    color={color}
                                    image={image}
                                    className="w-20 h-20 rounded-3xl shadow-2xl"
                                    iconClassName="text-[44px]"
                                />
                            </motion.div>
                            <div className="min-w-0">
                                <p className="text-white/70 text-[11px] font-semibold uppercase tracking-[0.08em]">
                                    {isCreate ? "New palace" : "Now editing"}
                                </p>
                                <h2 className="text-white text-[20px] font-bold truncate">
                                    {name?.trim() || "Your palace"}
                                </h2>
                                {category ? (
                                    <span className="inline-flex mt-1 items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[12px] font-medium text-white">
                                        {category}
                                    </span>
                                ) : (
                                    <span className="text-white/60 text-[12px]">
                                        Pick a category below
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrolling form */}
                <div className="flex-1 overflow-y-auto scrollbar-hide bg-gradient-to-b from-[#4F8EFF]/95 to-[#ADC8FF]/95 px-6 py-6">
                    <form
                        id={FORM_ID}
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        {/* Details */}
                        <section className="space-y-5">
                            <SectionTitle index={1} title="Details"/>

                            <Field label="Name" htmlFor="palace-name" error={errors.name?.message}>
                                <Input
                                    id="palace-name"
                                    {...register("name")}
                                    placeholder="e.g., Ancient Rome"
                                    className="w-full px-5 py-4 h-auto bg-white/20 backdrop-blur-md rounded-2xl text-white placeholder:text-white/50 outline-none border-2 border-transparent focus:border-white/50 transition-all"
                                />
                            </Field>

                            <Field
                                label="Description (optional)"
                                htmlFor="palace-description"
                                error={errors.description?.message}
                            >
                                <Textarea
                                    id="palace-description"
                                    {...register("description")}
                                    placeholder="What will you memorise here?"
                                    rows={3}
                                    className="w-full px-5 py-4 bg-white/20 backdrop-blur-md rounded-2xl text-white placeholder:text-white/50 outline-none border-2 border-transparent focus:border-white/50 transition-all resize-none"
                                />
                            </Field>

                            <Field label="Category" error={errors.category?.message}>
                                <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Category">
                                    {categoryOptions.map((option) => (
                                        <motion.button
                                            key={option}
                                            type="button"
                                            role="radio"
                                            aria-checked={category === option}
                                            whileTap={{scale: 0.96}}
                                            onClick={() => {
                                                setValue("category", option);
                                                trigger("category");
                                            }}
                                            className={`px-4 py-3 rounded-2xl font-medium text-[14px] transition-all ${
                                                category === option
                                                    ? "bg-white text-[#091A7A] shadow-md"
                                                    : "bg-white/15 text-white active:bg-white/25"
                                            }`}
                                        >
                                            {option}
                                        </motion.button>
                                    ))}
                                </div>
                            </Field>
                        </section>

                        {/* Appearance */}
                        <section className="space-y-5">
                            <SectionTitle index={2} title="Appearance"/>

                            <Field label="Cover photo (optional)">
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePickImage}
                                />
                                {image ? (
                                    <div className="flex items-center gap-3">
                                        <PalaceCover
                                            icon={icon}
                                            color={color}
                                            image={image}
                                            hideIcon
                                            className="w-16 h-16 rounded-2xl flex-shrink-0 shadow-lg"
                                        />
                                        <div className="flex flex-1 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => fileRef.current?.click()}
                                                className="flex-1 py-3 rounded-2xl bg-white/20 text-white text-[14px] font-semibold active:bg-white/30 transition-colors"
                                            >
                                                Replace
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="Remove cover photo"
                                                onClick={() => setValue("image", undefined, {shouldDirty: true})}
                                                className="w-12 flex-shrink-0 rounded-2xl bg-white/15 text-white flex items-center justify-center active:bg-white/25 transition-colors"
                                            >
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileRef.current?.click()}
                                        className="w-full flex items-center justify-center gap-2 py-5 rounded-2xl border-2 border-dashed border-white/40 bg-white/10 text-white text-[14px] font-semibold active:bg-white/20 transition-colors"
                                    >
                                        <ImagePlus size={18}/>
                                        Upload a photo
                                    </button>
                                )}
                            </Field>

                            <Field label="Icon">
                                <div
                                    className="grid grid-cols-6 gap-2.5"
                                    role="radiogroup"
                                    aria-label="Palace icon"
                                >
                                    {iconOptions.map((option) => (
                                        <motion.button
                                            key={option}
                                            type="button"
                                            role="radio"
                                            aria-checked={icon === option}
                                            whileTap={{scale: 0.9}}
                                            onClick={() => setValue("icon", option)}
                                            className={`aspect-square rounded-xl flex items-center justify-center text-[24px] transition-all ${
                                                icon === option
                                                    ? "bg-white shadow-lg ring-2 ring-white"
                                                    : "bg-white/15 active:bg-white/25"
                                            }`}
                                        >
                                            {option}
                                        </motion.button>
                                    ))}
                                </div>
                            </Field>

                            <Field label="Color">
                                <div
                                    className="grid grid-cols-5 gap-3"
                                    role="radiogroup"
                                    aria-label="Color scheme"
                                >
                                    {colorOptions.map((option) => (
                                        <motion.button
                                            key={option.value}
                                            type="button"
                                            role="radio"
                                            aria-checked={color === option.value}
                                            aria-label={option.name}
                                            whileTap={{scale: 0.92}}
                                            onClick={() => setValue("color", option.value)}
                                            className={`relative aspect-square rounded-2xl bg-gradient-to-br ${option.value} shadow-md flex items-center justify-center transition-transform ${
                                                color === option.value
                                                    ? "ring-2 ring-white ring-offset-2 ring-offset-[#4F8EFF]"
                                                    : ""
                                            }`}
                                        >
                                            {color === option.value && (
                                                <Check className="w-5 h-5 text-white drop-shadow"/>
                                            )}
                                        </motion.button>
                                    ))}

                                    {/* Free custom color */}
                                    <label
                                        aria-label="Custom color"
                                        className={`relative aspect-square rounded-2xl shadow-md flex items-center justify-center cursor-pointer transition-transform ${
                                            isCustomColor
                                                ? "ring-2 ring-white ring-offset-2 ring-offset-[#4F8EFF]"
                                                : ""
                                        }`}
                                        style={
                                            isCustomColor
                                                ? {
                                                      backgroundImage: `linear-gradient(135deg, ${color}, color-mix(in oklab, ${color}, #000 22%))`,
                                                  }
                                                : {
                                                      backgroundImage:
                                                          "conic-gradient(from 180deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ef4444)",
                                                  }
                                        }
                                    >
                                        <input
                                            type="color"
                                            value={isCustomColor && color.startsWith("#") ? color : "#7C3AED"}
                                            onChange={(e) =>
                                                setValue("color", e.target.value, {shouldDirty: true})
                                            }
                                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                        />
                                        {isCustomColor ? (
                                            <Check className="w-5 h-5 text-white drop-shadow"/>
                                        ) : (
                                            <Plus className="w-5 h-5 text-white drop-shadow"/>
                                        )}
                                    </label>
                                </div>
                            </Field>
                        </section>
                    </form>
                </div>

                {/* Footer — lifts above the keyboard when a field is focused */}
                <div
                    className="px-6 pt-4 bg-white/95 backdrop-blur-xl shrink-0"
                    style={{paddingBottom: keyboardInset > 0 ? keyboardInset + 12 : 24}}
                >
                    {!isValid && (
                        <p className="text-center text-[12px] font-medium text-[#64748b] mb-2">
                            Add a name and pick a category to continue
                        </p>
                    )}
                    <motion.button
                        type="submit"
                        form={FORM_ID}
                        disabled={!isValid}
                        whileTap={{scale: isValid ? 0.98 : 1}}
                        className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                            isValid
                                ? "bg-[#091A7A] text-white shadow-interactive"
                                : "bg-[#E2E8F0] text-[#94a3b8] cursor-not-allowed"
                        }`}
                    >
                        {isCreate ? <Sparkles size={20}/> : <Save size={20}/>}
                        <span>{isCreate ? "Create palace" : "Save changes"}</span>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

function SectionTitle({index, title}: {index: number; title: string}) {
    return (
        <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-white/25 text-white text-[12px] font-bold flex items-center justify-center">
                {index}
            </span>
            <h3 className="text-white text-[16px] font-bold">{title}</h3>
        </div>
    );
}

function Field({
                   label,
                   htmlFor,
                   error,
                   children,
               }: {
    label: string;
    htmlFor?: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div>
            {htmlFor ? (
                <label
                    htmlFor={htmlFor}
                    className="text-white text-[14px] font-medium mb-2 block"
                >
                    {label}
                </label>
            ) : (
                <span className="text-white text-[14px] font-medium mb-2.5 block">
                    {label}
                </span>
            )}
            {children}
            {error && (
                <p
                    role="alert"
                    className="mt-2 inline-block rounded-lg bg-[#B91C1C]/90 px-2.5 py-1 text-[12px] font-medium text-white"
                >
                    {error}
                </p>
            )}
        </div>
    );
}
