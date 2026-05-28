import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { StatusBar } from "../ui/StatusBar";
import { DynamicBackground } from "../DynamicBackground";
import { AmbientParticles } from "../AmbientParticles";
import { useProgressState } from "../../hooks/useProgressState";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(1, "Description is required"),
  order: z.number().min(1),
});

type FormData = z.infer<typeof formSchema>;

interface CreateFloorScreenProps {
  palaceId: string;
  onBack: () => void;
  onSuccess: () => void;
}

export function CreateFloorScreen({
  palaceId,
  onBack,
  onSuccess,
}: CreateFloorScreenProps) {
  const { state, actions } = useProgressState();
  const palace = state.palaces.find((p) => p.id === palaceId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      order: (palace?.floors?.length || 0) + 1,
    },
    mode: "onChange",
  });

  if (!palace) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-body text-[#6B7280]">Palace not found</p>
      </div>
    );
  }

  const onSubmit = (data: FormData) => {
    actions.createFloor(palaceId, {
      title: data.title.trim(),
      description: data.description.trim(),
      order: data.order,
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
                <h1 className="text-[18px] font-bold text-white">Create Floor</h1>
                <p className="text-white/70 text-[13px] mt-1">{palace.name}</p>
              </div>

              <div className="w-12" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pt-6 pb-24">
          <form id="create-floor-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white/95 rounded-3xl p-6 border border-white/60">
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${palace.color} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-[32px]">{palace.icon}</span>
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-[#000000] mb-1">
                    {palace.name}
                  </h3>
                  <p className="text-[14px] text-[#86868B]">
                    {palace.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E5EA]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] text-[#86868B]">Current Floors</p>
                    <p className="text-[20px] font-bold text-[#000000]">
                      {palace.floors?.length || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#86868B]">Total Rooms</p>
                    <p className="text-[20px] font-bold text-[#000000]">
                      {palace.totalRooms}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[#000000] text-[14px] font-medium mb-2 block">
                Floor Title
              </label>
              <Input
                {...register("title")}
                placeholder="e.g., Introduction Level"
                className="w-full px-5 py-4 h-auto bg-white rounded-2xl text-[#000000] placeholder:text-[#86868B] outline-none border-2 border-[#E5E5EA] focus:border-[#007AFF] transition-all"
              />
              {errors.title && (
                <p className="text-red-600 text-[13px] mt-2">{errors.title.message}</p>
              )}
              <p className="text-[13px] text-[#86868B] mt-2">
                Give this floor a descriptive name
              </p>
            </div>

            <div>
              <label className="text-[#000000] text-[14px] font-medium mb-2 block">
                Description
              </label>
              <Textarea
                {...register("description")}
                placeholder="Describe what users will learn on this floor..."
                rows={4}
                className="w-full px-5 py-4 bg-white rounded-2xl text-[#000000] placeholder:text-[#86868B] outline-none border-2 border-[#E5E5EA] focus:border-[#007AFF] transition-all resize-none"
              />
              {errors.description && (
                <p className="text-red-600 text-[13px] mt-2">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="text-[#000000] text-[14px] font-medium mb-2 block">
                Floor Order
              </label>
              <Input
                type="number"
                min="1"
                {...register("order", { valueAsNumber: true })}
                className="w-full px-5 py-4 h-auto bg-white rounded-2xl text-[#000000] outline-none border-2 border-[#E5E5EA] focus:border-[#007AFF] transition-all"
              />
              {errors.order && (
                <p className="text-red-600 text-[13px] mt-2">{errors.order.message}</p>
              )}
              <p className="text-[13px] text-[#86868B] mt-2">
                This determines the floor's position in the palace
              </p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[18px]">💡</span>
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold text-[#000000] mb-1">
                    Tip: Organize Your Content
                  </h4>
                  <p className="text-[13px] text-[#86868B] leading-relaxed">
                    Floors help you organize rooms by topic or difficulty level. After
                    creating this floor, you can add rooms to it.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 bg-white/95 backdrop-blur-xl border-t border-[#E5E5EA]">
          <motion.button
            type="submit"
            form="create-floor-form"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-[#10b981] to-[#059669] text-white rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles size={20} />
            <span>Create Floor</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
