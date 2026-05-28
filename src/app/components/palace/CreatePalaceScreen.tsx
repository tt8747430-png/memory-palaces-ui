import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ChevronRight,
  Check,
  Sparkles,
} from "lucide-react";
import { StatusBar } from "../StatusBar";
import { DynamicBackground } from "../DynamicBackground";
import { AmbientParticles } from "../AmbientParticles";
import { useProgressState } from "../../hooks/useProgressState";

interface CreatePalaceScreenProps {
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

export function CreatePalaceScreen({
  onBack,
  onSuccess,
}: CreatePalaceScreenProps) {
  const { actions } = useProgressState();
  const [currentStep, setCurrentStep] = useState(1);
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

  const totalSteps = 3;

  const validateStep1 = () => {
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

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleSubmit = () => {
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    actions.createPalace({
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      icon: formData.icon,
      color: formData.color,
      totalRooms: 0,
    });

    onSuccess();
  };

  const renderProgressBar = () => (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
            index < currentStep
              ? "bg-white"
              : "bg-white/30"
          }`}
        />
      ))}
    </div>
  );

  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Basic Information</h2>
        <p className="text-white/70 text-[15px]">
          Let's start with the essentials
        </p>
      </div>

      <div>
        <label className="text-white text-[14px] font-medium mb-2 block">
          Palace Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Ancient Rome"
          className="w-full px-5 py-4 bg-white/20 backdrop-blur-md rounded-2xl text-white placeholder:text-white/50 outline-none border-2 border-transparent focus:border-white/50 transition-all"
        />
        {errors.name && (
          <p className="text-red-300 text-[13px] mt-2">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="text-white text-[14px] font-medium mb-2 block">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what you'll learn in this memory palace..."
          rows={4}
          className="w-full px-5 py-4 bg-white/20 backdrop-blur-md rounded-2xl text-white placeholder:text-white/50 outline-none border-2 border-transparent focus:border-white/50 transition-all resize-none"
        />
        {errors.description && (
          <p className="text-red-300 text-[13px] mt-2">{errors.description}</p>
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
              whileTap={{ scale: 0.96 }}
              onClick={() => setFormData({ ...formData, category })}
              className={`px-4 py-3 rounded-2xl font-medium text-[14px] transition-all ${
                formData.category === category
                  ? "bg-white text-[#007AFF]"
                  : "bg-white/20 text-white"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
        {errors.category && (
          <p className="text-red-300 text-[13px] mt-2">{errors.category}</p>
        )}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Choose an Icon</h2>
        <p className="text-white/70 text-[15px]">
          Select an icon that represents your palace
        </p>
      </div>

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
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setFormData({ ...formData, icon })}
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
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Choose a Color</h2>
        <p className="text-white/70 text-[15px]">
          Pick a color scheme for your palace card
        </p>
      </div>

      <div className="bg-white/15 backdrop-blur-md rounded-3xl p-6">
        <div className="flex items-center justify-center mb-6">
          <div
            className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${formData.color} flex items-center justify-center shadow-2xl`}
          >
            <span className="text-[64px]">{formData.icon}</span>
          </div>
        </div>

        <div className="space-y-3">
          {colorOptions.map((color) => (
            <motion.button
              key={color.value}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFormData({ ...formData, color: color.value })}
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
                  formData.color === color.value ? "text-[#007AFF]" : "text-white"
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
    </motion.div>
  );

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
                onClick={handleBack}
                className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </motion.button>

              <h1 className="text-[18px] font-bold text-white">
                Create Palace
              </h1>

              <div className="w-12" />
            </div>

            {renderProgressBar()}

            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <AnimatePresence mode="wait">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/95 backdrop-blur-xl">
          <div className="flex gap-3">
            {currentStep < totalSteps ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="flex-1 py-4 bg-gradient-to-r from-[#007AFF] to-[#0051D5] text-white rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ChevronRight size={20} />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="flex-1 py-4 bg-gradient-to-r from-[#10b981] to-[#059669] text-white rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles size={20} />
                <span>Create Palace</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
