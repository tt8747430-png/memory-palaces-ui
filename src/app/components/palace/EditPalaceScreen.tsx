import {useEffect, useState} from "react";
import {motion} from "motion/react";
import {ArrowLeft, Check, Save} from "lucide-react";
import {StatusBar} from "../ui/StatusBar";
import {DynamicBackground} from "../DynamicBackground";
import {AmbientParticles} from "../AmbientParticles";
import {useProgressState} from "../../hooks/useProgressState";
import {Input} from "../ui/input";
import {Textarea} from "../ui/textarea";

interface EditPalaceScreenProps {
    palaceId: string;
    onBack: () => void;
    onSuccess: () => void;
}

const iconOptions = [
    "🏛️", "🌌", "🌍", "🫀", "⚗️", "💻", "📚", "🎨", "🎭", "🎵",
    "⚽", "🏀", "🎯", "🎲", "🎪", "🎬", "📷", "🎤", "🎧", "🎸",
    "🌸", "🌺", "🌻", "🌹", "🌷", "🍎", "🍊", "🍋", "🍌", "🍇"
];

const colorOptions = [
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

const categoryOptions = [
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
];

export function EditPalaceScreen({palaceId, onBack, onSuccess}: EditPalaceScreenProps) {
    const {state, actions} = useProgressState();
    const palace = state.palaces.find((p) => p.id === palaceId);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        icon: "🏛️",
        color: "from-purple-500 to-pink-500",
    });

    const [errors, setErrors] = useState({
        name: "",
        description: "",
        category: "",
    });

    useEffect(() => {
        if (palace) {
            setFormData({
                name: palace.name,
                description: palace.description,
                category: palace.category,
                icon: palace.icon,
                color: palace.color,
            });
        }
    }, [palace]);

    if (!palace) {
        return (
            <div className="h-full flex items-center justify-center bg-[#091A7A]">
                <p className="text-white text-[15px]">Palace not found</p>
            </div>
        );
    }

    const validateForm = () => {
        const newErrors = {
            name: "",
            description: "",
            category: "",
        };

        if (!formData.name.trim()) {
            newErrors.name = "Palace name is required";
        } else if (formData.name.trim().length < 3) {
            newErrors.name = "Name must be at least 3 characters";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        } else if (formData.description.trim().length < 10) {
            newErrors.description = "Description must be at least 10 characters";
        }

        if (!formData.category) {
            newErrors.category = "Please select a category";
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        actions.updatePalace(palaceId, {
            name: formData.name.trim(),
            description: formData.description.trim(),
            category: formData.category,
            icon: formData.icon,
            color: formData.color,
        });

        onSuccess();
    };

    return (
        <div className="size-full flex flex-col relative bg-[#091A7A]">
            <DynamicBackground/>
            <AmbientParticles/>

            <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
                <div
                    className="bg-gradient-to-b from-[#091A7A]/95 to-[#4F8EFF]/95 relative flex-shrink-0 backdrop-blur-md pb-4 pt-2">
                    <div
                        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_50%)]"/>

                    <div className="relative z-10">
                        <StatusBar textColor="white"/>
                    </div>

                    <div className="px-6 relative z-10">
                        <div className="flex items-center justify-between mb-2 mt-4">
                            <motion.button
                                type="button"
                                whileTap={{scale: 0.92}}
                                aria-label="Go back"
                                onClick={onBack}
                                className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                            >
                                <ArrowLeft className="w-4 h-4 text-white"/>
                            </motion.button>

                            <h1 className="text-[16px] font-bold text-white">
                                Edit Palace
                            </h1>

                            <div className="w-11"/>
                        </div>
                    </div>
                </div>

                <div
                    className="flex-1 overflow-y-auto scrollbar-hide px-6 py-6 bg-gradient-to-b from-[#4F8EFF]/95 to-[#ADC8FF]/95 relative">
                    <div className="space-y-6">

                        {/* Form Fields */}
                        <div>
                            <label className="text-white text-[14px] font-medium mb-2 block">
                                Palace Name
                            </label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g., Ancient Rome"
                                className="w-full px-5 py-4 h-auto bg-white/20 backdrop-blur-md rounded-2xl text-white placeholder:text-white/50 outline-none border-2 border-transparent focus:border-white/50 transition-all"
                            />
                            {errors.name && (
                                <p className="mt-2 inline-block rounded-lg bg-[#B91C1C]/90 px-2.5 py-1 text-[12px] font-medium text-white">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-white text-[14px] font-medium mb-2 block">
                                Description
                            </label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Describe what you'll learn in this memory palace..."
                                rows={4}
                                className="w-full px-5 py-4 bg-white/20 backdrop-blur-md rounded-2xl text-white placeholder:text-white/50 outline-none border-2 border-transparent focus:border-white/50 transition-all resize-none"
                            />
                            {errors.description && (
                                <p className="mt-2 inline-block rounded-lg bg-[#B91C1C]/90 px-2.5 py-1 text-[12px] font-medium text-white">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-white text-[14px] font-medium mb-3 block">
                                Category
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {categoryOptions.map((category) => (
                                    <motion.button
                                        key={category}
                                        type="button"
                                        whileTap={{scale: 0.96}}
                                        onClick={() => setFormData({...formData, category})}
                                        className={`px-4 py-3 rounded-2xl font-medium text-[14px] transition-all ${
                                            formData.category === category
                                                ? "bg-white text-[#091A7A] shadow-md"
                                                : "bg-white/20 text-white"
                                        }`}
                                    >
                                        {category}
                                    </motion.button>
                                ))}
                            </div>
                            {errors.category && (
                                <p className="mt-2 inline-block rounded-lg bg-[#B91C1C]/90 px-2.5 py-1 text-[12px] font-medium text-white">
                                    {errors.category}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-white text-[14px] font-medium mb-3 block">
                                Icon
                            </label>
                            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-6">
                                <div className="flex items-center justify-center mb-6">
                                    <div
                                        className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${formData.color} flex items-center justify-center shadow-2xl`}
                                    >
                                        <span className="text-[56px]">{formData.icon}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-5 gap-3">
                                    {iconOptions.map((icon) => (
                                        <motion.button
                                            key={icon}
                                            type="button"
                                            whileHover={{scale: 1.1}}
                                            whileTap={{scale: 0.9}}
                                            onClick={() => setFormData({...formData, icon})}
                                            className={`aspect-square rounded-2xl flex items-center justify-center text-[28px] transition-all ${
                                                formData.icon === icon
                                                    ? "bg-white shadow-lg"
                                                    : "bg-white/20 hover:bg-white/30"
                                            }`}
                                        >
                                            {icon}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-white text-[14px] font-medium mb-3 block">
                                Color Scheme
                            </label>
                            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-6">
                                <div className="space-y-3">
                                    {colorOptions.map((color) => (
                                        <motion.button
                                            key={color.value}
                                            type="button"
                                            whileTap={{scale: 0.98}}
                                            onClick={() => setFormData({...formData, color: color.value})}
                                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                                                formData.color === color.value
                                                    ? "bg-white shadow-lg"
                                                    : "bg-white/20 hover:bg-white/30"
                                            }`}
                                        >
                                            <div
                                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.value} flex-shrink-0 shadow-md`}
                                            />
                                            <span
                                                className={`font-medium text-[15px] ${
                                                    formData.color === color.value ? "text-[#091A7A]" : "text-white"
                                                }`}
                                            >
                        {color.name}
                      </span>
                                            {formData.color === color.value && (
                                                <Check size={20} className="text-[#091A7A] ml-auto"/>
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="p-6 bg-white/95 backdrop-blur-xl shrink-0 border-t border-white/20">
                    <motion.button
                        whileTap={{scale: 0.98}}
                        onClick={handleSubmit}
                        className="w-full py-4 bg-[#091A7A] text-white rounded-2xl font-semibold shadow-interactive flex items-center justify-center gap-2"
                    >
                        <Save size={20}/>
                        <span>Save changes</span>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
