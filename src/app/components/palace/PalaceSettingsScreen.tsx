import {type ReactNode, useEffect, useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {
    ArrowLeft,
    ArrowLeftRight,
    BookOpen,
    Copy,
    DownloadCloud,
    Layers,
    RotateCcw,
    Shuffle,
    Timer,
    Trash2,
} from "lucide-react";
import {toast} from "sonner";
import {
    type CardOrder,
    type Palace,
    type PalaceSettings,
    palaceSettings,
    type StudyDirection,
    useProgressState,
} from "../../hooks/useProgressState";
import {Switch} from "../ui/switch";
import {Input} from "../ui/input";
import {Textarea} from "../ui/textarea";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import {categoryOptions} from "./palaceForm";
import {ColorPicker, CoverField, IconPicker} from "./palaceFields";
import {exportPalaceAnki, exportPalaceJSON} from "../../utils/palaceTransfer";

interface PalaceSettingsScreenProps {
    palaceId: string;
    open: boolean;
    onClose: () => void;
    /** Leave the palace entirely (after archive or delete). */
    onExit: () => void;
}

const inputCls =
    "w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card text-[#091A7A] placeholder:text-[#091A7A]/55 focus:outline-none focus:ring-2 focus:ring-[#091A7A]/20 transition-all";

/**
 * One surface for everything about a palace: its identity (name, description,
 * icon, color, cover, type) and its behavior (study, manage, delete). Replaces
 * the old split between the settings sheet and a separate "edit palace" screen.
 * Edits apply instantly, matching the rest of the app's settings model.
 */
export function PalaceSettingsScreen({
                                         palaceId,
                                         open,
                                         onClose,
                                         onExit,
                                     }: PalaceSettingsScreenProps) {
    const {state, actions} = useProgressState();
    const palace = state.palaces.find((p) => p.id === palaceId);
    const settings = palaceSettings(palace);

    const [name, setName] = useState(palace?.name ?? "");
    const [description, setDescription] = useState(palace?.description ?? "");
    const [confirm, setConfirm] = useState<"reset" | "delete" | null>(null);

    // Re-seed the editable text fields whenever the sheet opens for a palace.
    useEffect(() => {
        if (open && palace) {
            setName(palace.name);
            setDescription(palace.description);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, palaceId]);

    if (!palace) return null;

    const update = (patch: Partial<Omit<Palace, "id" | "createdAt">>) =>
        actions.updatePalace(palaceId, patch);
    const updateSettings = (patch: Partial<PalaceSettings>) =>
        actions.updatePalaceSettings(palaceId, patch);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{x: "100%"}}
                    animate={{x: 0}}
                    exit={{x: "100%"}}
                    transition={{ease: [0.22, 1, 0.36, 1], duration: 0.35}}
                    className="fixed inset-0 z-[100] bg-gradient-to-b from-[#ADC8FF] via-[#E8F2FF] to-white flex flex-col shadow-[-20px_0_40px_rgba(9,26,122,0.10)]"
                >
                    {/* Header */}
                    <div className="flex-shrink-0">
                        <div className="h-safe-top"/>
                        <div className="flex items-center gap-2 px-3 py-2.5">
                            <motion.button
                                whileTap={{scale: 0.92}}
                                onClick={onClose}
                                aria-label="Go back"
                                className="w-11 h-11 flex-shrink-0 rounded-full bg-white/70 backdrop-blur-lg flex items-center justify-center text-[#091A7A] shadow-card border border-white/40"
                            >
                                <ArrowLeft className="w-5 h-5"/>
                            </motion.button>
                            <h1 className="text-[18px] font-bold text-[#091A7A]">Palace settings</h1>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-2 pb-[max(env(safe-area-inset-bottom),2rem)] space-y-7">
                        {/* Identity */}
                        <section className="space-y-4">
                            <CoverField
                                icon={palace.icon}
                                color={palace.color}
                                image={palace.image}
                                onPick={(image) => update({image})}
                                onRemove={() => update({image: undefined})}
                            />
                            <div>
                                <FieldLabel htmlFor="palace-name">Name</FieldLabel>
                                <Input
                                    id="palace-name"
                                    value={name}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setName(v);
                                        // Don't persist an empty name; keep the last good one
                                        // until they type a new one (the field still shows blank).
                                        if (v.trim()) update({name: v});
                                    }}
                                    placeholder="Palace name"
                                    className={inputCls}
                                />
                            </div>
                            <div>
                                <FieldLabel htmlFor="palace-description">Description</FieldLabel>
                                <Textarea
                                    id="palace-description"
                                    value={description}
                                    onChange={(e) => {
                                        const v = e.target.value.slice(0, 280);
                                        setDescription(v);
                                        update({description: v});
                                    }}
                                    rows={3}
                                    placeholder="What will you memorize here?"
                                    className={`${inputCls} resize-none`}
                                />
                                <p className="mt-2 px-2 text-[12px] font-medium text-[#091A7A]/55">
                                    {description.length}/280
                                </p>
                            </div>
                        </section>

                        {/* Appearance */}
                        <Section title="Appearance">
                            <div className="bg-white rounded-[20px] p-4 shadow-card border border-[#091A7A]/[0.05] space-y-4">
                                <div>
                                    <FieldLabel>Icon</FieldLabel>
                                    <IconPicker value={palace.icon} onChange={(icon) => update({icon})}/>
                                </div>
                                <div>
                                    <FieldLabel>Color</FieldLabel>
                                    <ColorPicker value={palace.color} onChange={(color) => update({color})}/>
                                </div>
                            </div>
                        </Section>

                        {/* Type */}
                        <Section title="Type">
                            <div className="bg-white rounded-[20px] p-4 shadow-card border border-[#091A7A]/[0.05] space-y-4">
                                <ToggleRow
                                    icon={<BookOpen size={18}/>}
                                    label="Bible mode"
                                    sublabel="Memorize verses with Blur, Words, Initials & Type"
                                    checked={!!palace.bibleMode}
                                    onChange={(v) => update({bibleMode: v})}
                                />
                                <div>
                                    <FieldLabel>Category</FieldLabel>
                                    <div className="flex flex-wrap gap-2">
                                        {categoryOptions.map((option) => {
                                            const active = palace.category === option;
                                            return (
                                                <motion.button
                                                    key={option}
                                                    whileTap={{scale: 0.95}}
                                                    onClick={() => update({category: option})}
                                                    aria-pressed={active}
                                                    className={`rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                                                        active
                                                            ? "bg-[#091A7A] text-white"
                                                            : "bg-[#F1F5F9] text-[#475569] hover:bg-[#EAF4FF]"
                                                    }`}
                                                >
                                                    {option}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* Study */}
                        <Section title="Study">
                            <SettingsGroup>
                                <SettingRow
                                    icon={<ArrowLeftRight size={18} className="text-[#091A7A]"/>}
                                    label="Study direction"
                                    sublabel="Which face leads in training"
                                    right={
                                        <Segmented
                                            value={settings.studyDirection}
                                            options={[
                                                {value: "front", label: "Front"},
                                                {value: "back", label: "Back"},
                                            ]}
                                            onChange={(v) =>
                                                updateSettings({studyDirection: v as StudyDirection})
                                            }
                                        />
                                    }
                                />
                                <SettingRow
                                    icon={<Shuffle size={18} className="text-[#091A7A]"/>}
                                    label="Card order"
                                    sublabel="Default order when browsing"
                                    right={
                                        <Segmented
                                            value={settings.cardOrder}
                                            options={[
                                                {value: "inOrder", label: "List"},
                                                {value: "shuffle", label: "Shuffle"},
                                                {value: "reverse", label: "Reverse"},
                                            ]}
                                            onChange={(v) =>
                                                updateSettings({cardOrder: v as CardOrder})
                                            }
                                        />
                                    }
                                />
                                <SettingRow
                                    icon={<Timer size={18} className="text-[#091A7A]"/>}
                                    label="Quiz timer"
                                    sublabel="Count down each quiz question"
                                    right={
                                        <Switch
                                            checked={settings.quizTimer}
                                            onCheckedChange={(v) => updateSettings({quizTimer: v})}
                                        />
                                    }
                                />
                                <SettingRow
                                    icon={<Shuffle size={18} className="text-[#091A7A]"/>}
                                    label="Shuffle questions"
                                    sublabel="Randomize quiz question order"
                                    right={
                                        <Switch
                                            checked={settings.shuffleQuestions}
                                            onCheckedChange={(v) =>
                                                updateSettings({shuffleQuestions: v})
                                            }
                                        />
                                    }
                                />
                            </SettingsGroup>
                        </Section>

                        {/* Manage */}
                        <Section title="Manage">
                            <SettingsGroup>
                                <SettingRow
                                    icon={<Copy size={18} className="text-[#091A7A]"/>}
                                    label="Duplicate palace"
                                    sublabel="Copy its rooms, loci, and questions"
                                    onClick={() => {
                                        actions.duplicatePalace(palaceId);
                                        toast.success("Palace duplicated");
                                    }}
                                />
                                <SettingRow
                                    icon={<DownloadCloud size={18} className="text-[#091A7A]"/>}
                                    label="Export palace"
                                    sublabel="Mindscape file — re-imports with everything intact"
                                    onClick={() => {
                                        exportPalaceJSON(palace);
                                        toast.success("Palace exported");
                                    }}
                                />
                                <SettingRow
                                    icon={<Layers size={18} className="text-[#091A7A]"/>}
                                    label="Export for Anki"
                                    sublabel="Notes in Plain Text (.txt) for Anki & others"
                                    onClick={() => {
                                        exportPalaceAnki(palace);
                                        toast.success("Exported for Anki");
                                    }}
                                />
                                <SettingRow
                                    icon={<RotateCcw size={18} className="text-[#091A7A]"/>}
                                    label="Reset progress"
                                    sublabel="Keep content, clear completion"
                                    onClick={() => setConfirm("reset")}
                                />
                                <SettingRow
                                    icon={<Trash2 size={18} className="text-[#091A7A]"/>}
                                    label={palace.archived ? "Unarchive palace" : "Archive palace"}
                                    sublabel="Hide it from the main list"
                                    onClick={() => {
                                        actions.togglePalaceArchived(palaceId);
                                        toast.success(palace.archived ? "Palace restored" : "Palace archived");
                                        onExit();
                                    }}
                                />
                            </SettingsGroup>
                        </Section>

                        <SettingsGroup>
                            <SettingRow
                                icon={<Trash2 size={18} className="text-red-500"/>}
                                label="Delete palace"
                                sublabel="Remove it and all its content"
                                danger
                                onClick={() => setConfirm("delete")}
                            />
                        </SettingsGroup>
                    </div>

                    {/* Reset confirm */}
                    <AlertDialog open={confirm === "reset"} onOpenChange={(o) => !o && setConfirm(null)}>
                        <AlertDialogContent className="sm:max-w-[380px] rounded-3xl!">
                            <AlertDialogHeader>
                                <div className="w-14 h-14 bg-[#EAF4FF] rounded-full flex items-center justify-center mx-auto mb-3">
                                    <RotateCcw size={26} className="text-[#091A7A]"/>
                                </div>
                                <AlertDialogTitle className="text-center text-[#091A7A] text-lg">
                                    Reset this palace's progress?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-center text-[#475569]">
                                    Every room goes back to not started. Your loci and questions are kept.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex gap-3 sm:justify-center mt-2">
                                <AlertDialogCancel className="flex-1 py-3.5 h-auto border-none bg-[#EAF4FF] hover:bg-[#dcebff] text-[#091A7A] font-semibold rounded-2xl">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={(e) => {
                                        e.preventDefault();
                                        actions.resetPalaceProgress(palaceId);
                                        setConfirm(null);
                                        toast.success("Progress reset");
                                    }}
                                    className="flex-1 py-3.5 h-auto bg-[#091A7A] hover:bg-[#0a2090] text-white font-semibold rounded-2xl"
                                >
                                    Reset
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Delete confirm */}
                    <AlertDialog open={confirm === "delete"} onOpenChange={(o) => !o && setConfirm(null)}>
                        <AlertDialogContent className="sm:max-w-[380px] rounded-3xl!">
                            <AlertDialogHeader>
                                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Trash2 size={26} className="text-red-600"/>
                                </div>
                                <AlertDialogTitle className="text-center text-[#091A7A] text-lg">
                                    Delete “{palace.name}”?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-center text-[#475569]">
                                    This can't be undone. Every room, locus, question, and your progress here are
                                    deleted for good.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex gap-3 sm:justify-center mt-2">
                                <AlertDialogCancel className="flex-1 py-3.5 h-auto border-none bg-[#EAF4FF] hover:bg-[#dcebff] text-[#091A7A] font-semibold rounded-2xl">
                                    Keep palace
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={(e) => {
                                        e.preventDefault();
                                        actions.deletePalace(palaceId);
                                        setConfirm(null);
                                        onExit();
                                    }}
                                    className="flex-1 py-3.5 h-auto bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl"
                                >
                                    Delete palace
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// --- Building blocks --------------------------------------------------------

function FieldLabel({htmlFor, children}: {htmlFor?: string; children: ReactNode}) {
    return (
        <label
            htmlFor={htmlFor}
            className="block text-[13px] font-semibold text-[#091A7A] mb-2 px-0.5"
        >
            {children}
        </label>
    );
}

function Section({title, children}: {title: string; children: ReactNode}) {
    return (
        <div>
            <h3 className="text-[12px] font-semibold text-[#091A7A]/70 mb-2 px-1 uppercase tracking-wider">
                {title}
            </h3>
            {children}
        </div>
    );
}

function SettingsGroup({children}: {children: ReactNode}) {
    return (
        <div className="bg-white rounded-[20px] shadow-card border border-[#091A7A]/[0.05] overflow-hidden divide-y divide-[#091A7A]/[0.06]">
            {children}
        </div>
    );
}

function SettingRow({
                        icon,
                        label,
                        sublabel,
                        onClick,
                        right,
                        danger,
                    }: {
    icon: ReactNode;
    label: string;
    sublabel?: string;
    onClick?: () => void;
    right?: ReactNode;
    danger?: boolean;
}) {
    const Comp = onClick ? motion.button : "div";
    return (
        <Comp
            {...(onClick ? {whileTap: {scale: 0.99}, onClick} : {})}
            className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-left ${
                onClick ? "transition-colors hover:bg-[#091A7A]/[0.03]" : ""
            }`}
        >
            <div
                className={`w-9 h-9 rounded-[12px] flex items-center justify-center flex-shrink-0 ${
                    danger ? "bg-red-50" : "bg-[#EAF4FF]"
                }`}
            >
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-[15px] font-semibold ${danger ? "text-red-500" : "text-[#091A7A]"}`}>
                    {label}
                </p>
                {sublabel && (
                    <p className="text-[12px] text-[#64748b] mt-0.5 leading-snug">{sublabel}</p>
                )}
            </div>
            {right}
        </Comp>
    );
}

function ToggleRow({
                       icon,
                       label,
                       sublabel,
                       checked,
                       onChange,
                   }: {
    icon: ReactNode;
    label: string;
    sublabel: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-[12px] bg-[#EAF4FF] flex items-center justify-center flex-shrink-0 text-[#091A7A]">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#091A7A]">{label}</p>
                <p className="text-[12px] text-[#64748b] mt-0.5 leading-snug">{sublabel}</p>
            </div>
            <Switch checked={checked} onCheckedChange={onChange}/>
        </div>
    );
}

function Segmented({
                       value,
                       options,
                       onChange,
                   }: {
    value: string;
    options: {value: string; label: string}[];
    onChange: (value: string) => void;
}) {
    return (
        <div className="flex items-center gap-0.5 rounded-full bg-[#F1F5F9] p-0.5">
            {options.map((o) => {
                const active = o.value === value;
                return (
                    <button
                        key={o.value}
                        onClick={() => onChange(o.value)}
                        className={`rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors ${
                            active
                                ? "bg-[#091A7A] text-white shadow-sm"
                                : "text-[#475569] hover:text-[#091A7A]"
                        }`}
                    >
                        {o.label}
                    </button>
                );
            })}
        </div>
    );
}
