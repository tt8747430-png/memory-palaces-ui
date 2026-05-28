import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Sparkles,
  Lock,
  Unlock,
} from "lucide-react";
import { StatusBar } from "../StatusBar";
import { DynamicBackground } from "../DynamicBackground";
import { AmbientParticles } from "../AmbientParticles";
import { useProgressState } from "../../hooks/useProgressState";

interface CreateRoomScreenProps {
  palaceId: string;
  floorId: string;
  onBack: () => void;
  onSuccess: () => void;
}

export function CreateRoomScreen({
  palaceId,
  floorId,
  onBack,
  onSuccess,
}: CreateRoomScreenProps) {
  const { state, actions } = useProgressState();
  const palace = state.palaces.find((p) => p.id === palaceId);
  const floor = palace?.floors?.find((f) => f.id === floorId);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 10,
    content: "",
    isUnlocked: true,
    order: (floor?.rooms.length || 0) + 1,
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    content: "",
  });

  if (!palace || !floor) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-body text-[#6B7280]">Palace or Floor not found</p>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
      content: "",
    };

    if (!formData.title.trim()) {
      newErrors.title = "Room title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Room content is required";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    actions.createRoom(palaceId, floorId, {
      title: formData.title.trim(),
      description: formData.description.trim(),
      duration: formData.duration,
      content: formData.content.trim(),
      isUnlocked: formData.isUnlocked,
      isCompleted: false,
      progress: 0,
      order: formData.order,
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
            <div className="flex items-center justify-between mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </motion.button>

              <div className="flex-1 text-center">
                <h1 className="text-[18px] font-bold text-white">Create Room</h1>
                <p className="text-white/70 text-[13px] mt-1">{floor.title}</p>
              </div>

              <div className="w-12" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pt-6 pb-24">
          <div className="space-y-6">
            <div>
              <label className="text-[#000000] text-[14px] font-medium mb-2 block">
                Room Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Introduction to Planets"
                className="w-full px-5 py-4 bg-white rounded-2xl text-[#000000] placeholder:text-[#86868B] outline-none border-2 border-[#E5E5EA] focus:border-[#007AFF] transition-all"
              />
              {errors.title && (
                <p className="text-red-600 text-[13px] mt-2">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="text-[#000000] text-[14px] font-medium mb-2 block">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of what this room covers..."
                rows={3}
                className="w-full px-5 py-4 bg-white rounded-2xl text-[#000000] placeholder:text-[#86868B] outline-none border-2 border-[#E5E5EA] focus:border-[#007AFF] transition-all resize-none"
              />
              {errors.description && (
                <p className="text-red-600 text-[13px] mt-2">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="text-[#000000] text-[14px] font-medium mb-2 block">
                Duration (minutes)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: Number(e.target.value) })
                  }
                  className="flex-1"
                />
                <div className="px-4 py-3 bg-white rounded-xl border-2 border-[#E5E5EA] min-w-[80px] text-center">
                  <span className="text-[#000000] font-semibold text-[16px]">
                    {formData.duration}
                  </span>
                  <span className="text-[#86868B] text-[13px] ml-1">min</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[#000000] text-[14px] font-medium mb-2 block">
                Room Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter the content that users will learn in this room..."
                rows={8}
                className="w-full px-5 py-4 bg-white rounded-2xl text-[#000000] placeholder:text-[#86868B] outline-none border-2 border-[#E5E5EA] focus:border-[#007AFF] transition-all resize-none font-mono text-[14px]"
              />
              {errors.content && (
                <p className="text-red-600 text-[13px] mt-2">{errors.content}</p>
              )}
            </div>

            <div>
              <label className="text-[#000000] text-[14px] font-medium mb-3 block">
                Access Settings
              </label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setFormData({ ...formData, isUnlocked: true })}
                  className={`p-5 rounded-2xl transition-all ${
                    formData.isUnlocked
                      ? "bg-gradient-to-br from-[#10b981] to-[#059669] text-white shadow-lg"
                      : "bg-white text-[#000000] border-2 border-[#E5E5EA]"
                  }`}
                >
                  <Unlock
                    size={24}
                    className={`mx-auto mb-2 ${formData.isUnlocked ? "text-white" : "text-[#10b981]"}`}
                  />
                  <p className="text-[15px] font-semibold mb-1">Unlocked</p>
                  <p
                    className={`text-[12px] ${formData.isUnlocked ? "text-white/80" : "text-[#86868B]"}`}
                  >
                    Available immediately
                  </p>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setFormData({ ...formData, isUnlocked: false })}
                  className={`p-5 rounded-2xl transition-all ${
                    !formData.isUnlocked
                      ? "bg-gradient-to-br from-[#ef4444] to-[#dc2626] text-white shadow-lg"
                      : "bg-white text-[#000000] border-2 border-[#E5E5EA]"
                  }`}
                >
                  <Lock
                    size={24}
                    className={`mx-auto mb-2 ${!formData.isUnlocked ? "text-white" : "text-[#ef4444]"}`}
                  />
                  <p className="text-[15px] font-semibold mb-1">Locked</p>
                  <p
                    className={`text-[12px] ${!formData.isUnlocked ? "text-white/80" : "text-[#86868B]"}`}
                  >
                    Requires unlock
                  </p>
                </motion.button>
              </div>
            </div>

            <div>
              <label className="text-[#000000] text-[14px] font-medium mb-2 block">
                Room Order
              </label>
              <input
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: Number(e.target.value) })
                }
                className="w-full px-5 py-4 bg-white rounded-2xl text-[#000000] outline-none border-2 border-[#E5E5EA] focus:border-[#007AFF] transition-all"
              />
              <p className="text-[13px] text-[#86868B] mt-2">
                This determines the room's position in the floor
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/95 backdrop-blur-xl border-t border-[#E5E5EA]">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-[#10b981] to-[#059669] text-white rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles size={20} />
            <span>Create Room</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
