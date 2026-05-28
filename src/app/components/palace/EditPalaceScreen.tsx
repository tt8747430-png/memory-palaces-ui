import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Check,
  Save,
} from "lucide-react";
import { StatusBar } from "../ui/StatusBar";
import { DynamicBackground } from "../DynamicBackground";
import { AmbientParticles } from "../AmbientParticles";
import { useProgressState } from "../../hooks/useProgressState";

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
  { name: "Purple & Pink", value: "from-purple-500 to-pink-500" },
  { name: "Blue & Cyan", value: "from-blue-500 to-cyan-500" },
  { name: "Green & Emerald", value: "from-green-500 to-emerald-500" },
  { name: "Red & Orange", value: "from-red-500 to-orange-500" },
  { name: "Indigo & Purple", value: "from-indigo-500 to-purple-500" },
  { name: "Amber & Yellow", value: "from-amber-500 to-yellow-500" },
  { name: "Pink & Rose", value: "from-pink-500 to-rose-500" },
  { name: "Teal & Green", value: "from-teal-500 to-green-500" },
  { name: "Violet & Purple", value: "from-violet-500 to-purple-500" },
  { name: "Sky & Blue", value: "from-sky-500 to-blue-500" },
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

export function EditPalaceScreen({
  palaceId,
  onBack,
  onSuccess,
}: EditPalaceScreenProps) {
  const { state, actions } = useProgressState();
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
      <div className="h-full flex items-center justify-center">
        <p className="text-body text-[#6B7280]">Palace not found</p>
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
    <div className="size-full flex flex-col relative">
      <DynamicBackground />
      <AmbientParticles />

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="bg-gradient-to-b from-[#091A7A]/95 to-[#4F8EFF]/95 relative flex-shrink-0 backdrop-blur-md">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_50%)]" />

          <div className="relative z-10">
            <StatusBar textColor="white" />
          </div>

          <div className="px-6 pt-3 pb-6 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </motion.button>

              <h1 className="text-[18px] font-bold text-white">
                Edit Palace
              </h1>

              <div className="w-12" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pt-6 pb-24">
          <div className="space-y-6">
            <div>
              <label className="text-[#000000] text-[14px] font-medium mb-2 block">
                Palace Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Ancient Rome"
                className="w-full px-5 py-4 bg-white rounded-2xl text-[#000000] placeholder:text-[#86868B] outline-none border-2 border-[#E5E5EA] focus:border-[#007AFF] transition-all"
              />
              {errors.name && (
                <p className="text-red-600 text-[13px] mt-2">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="text-[#000000] text-[14px] font-medium mb-2 block">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what you'll learn in this memory palace..."
                rows={4}
                className="w-full px-5 py-4 bg-white rounded-2xl text-[#000000] placeholder:text-[#86868B] outline-none border-2 border-[#E5E5EA] focus:border-[#007AFF] transition-all resize-none"
              />
              {errors.description && (
                <p className="text-red-600 text-[13px] mt-2">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="text-[#000000] text-[14px] font-medium mb-3 block">
                Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                {categoryOptions.map((category) => (
                  <motion.button
                    key={category}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setFormData({ ...formData, category })}
                    className={`px-4 py-3 rounded-2xl font-medium text-[14px] transition-all ${
                      formData.category === category
                        ? "bg-[#007AFF] text-white"
                        : "bg-white text-[#000000] border-2 border-[#E5E5EA]"
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
              {errors.category && (
                <p className="text-red-600 text-[13px] mt-2">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="text-[#000000] text-[14px] font-medium mb-3 block">
                Icon
              </label>
              <div className="bg-white rounded-3xl p-6 border-2 border-[#E5E5EA]">
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
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`aspect-square rounded-2xl flex items-center justify-center text-[28px] transition-all ${
                        formData.icon === icon
                          ? "bg-[#007AFF]/10 ring-2 ring-[#007AFF]"
                          : "bg-[#F5F5F7] hover:bg-[#E5E5EA]"
                      }`}
                    >
                      {icon}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-[#000000] text-[14px] font-medium mb-3 block">
                Color Scheme
              </label>
              <div className="space-y-3">
                {colorOptions.map((color) => (
                  <motion.button
                    key={color.value}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                      formData.color === color.value
                        ? "bg-white ring-2 ring-[#007AFF]"
                        : "bg-white border-2 border-[#E5E5EA]"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.value} flex-shrink-0 shadow-md`}
                    />
                    <span
                      className={`font-medium text-[15px] ${
                        formData.color === color.value ? "text-[#007AFF]" : "text-[#000000]"
                      }`}
                    >
                      {color.name}
                    </span>
                    {formData.color === color.value && (
                      <Check size={20} className="text-[#007AFF] ml-auto" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/95 backdrop-blur-xl border-t border-[#E5E5EA]">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-[#007AFF] to-[#0051D5] text-white rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2"
          >
            <Save size={20} />
            <span>Save Changes</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
