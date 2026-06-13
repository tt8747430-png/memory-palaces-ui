import * as z from "zod";

/**
 * Single source of truth for the palace create/edit forms: the zod schema and
 * the option lists the pickers render. Both `CreatePalaceScreen` and
 * `EditPalaceScreen` consume these so the two dialogs can never drift.
 */
export const palaceFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Give your palace a name"),
    // Optional: a palace only needs a name + category to exist.
    description: z.string().trim().max(280, "Keep the description under 280 characters"),
    category: z.string().min(1, "Pick a category"),
    icon: z.string(),
    // A preset Tailwind gradient (`from-… to-…`) or a custom hex (`#7C3AED`).
    color: z.string(),
    // Optional custom cover photo as a downscaled data URL.
    image: z.string().optional(),
    // Scripture palace: each locus is a verse and rooms unlock the verse-study
    // modes (Blur / Words / Initials / Type).
    bibleMode: z.boolean().optional(),
});

export type PalaceFormData = z.infer<typeof palaceFormSchema>;

export const iconOptions = [
    "🏛️", "🌌", "🌍", "🫀", "⚗️", "💻", "📚", "🎨", "🎭", "🎵",
    "⚽", "🏀", "🎯", "🎲", "🎪", "🎬", "📷", "🎤", "🎧", "🎸",
    "🌸", "🌺", "🌻", "🌹", "🌷", "🍎", "🍊", "🍋", "🍌", "🍇",
];

export const colorOptions = [
    {name: "Purple & Pink", value: "from-purple-500 to-pink-500"},
    {name: "Blue & Cyan", value: "from-blue-500 to-cyan-500"},
    {name: "Green & Emerald", value: "from-green-500 to-emerald-500"},
    {name: "Red & Orange", value: "from-red-500 to-orange-500"},
    {name: "Indigo & Purple", value: "from-indigo-500 to-purple-500"},
    {name: "Amber & Yellow", value: "from-amber-500 to-yellow-500"},
    {name: "Pink & Rose", value: "from-pink-500 to-rose-500"},
    {name: "Teal & Green", value: "from-teal-500 to-green-500"},
    {name: "Violet & Purple", value: "from-violet-500 to-purple-500"},
    {name: "Sky & Blue", value: "from-sky-500 to-blue-500"},
];

export const categoryOptions = [
    "Science",
    "History",
    "Geography",
    "Technology",
    "Arts",
    "Sports",
    "Music",
    "Literature",
    "Mathematics",
    "Languages",
    "Scripture",
];
