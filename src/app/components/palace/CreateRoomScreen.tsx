import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {motion} from "motion/react";
import {ArrowLeft, Lock, Sparkles, Unlock,} from "lucide-react";
import {StatusBar} from "../ui/StatusBar";
import {DynamicBackground} from "../DynamicBackground";
import {AmbientParticles} from "../AmbientParticles";
import {useProgressState} from "../../hooks/useProgressState";
import {Input} from "../ui/input";
import {Textarea} from "../ui/textarea";

const formSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(1, "Description is required"),
    duration: z.number().min(5).max(60),
    content: z.string().min(1, "Room content is required"),
    isUnlocked: z.boolean(),
    order: z.number().min(1),
});

type FormData = z.infer<typeof formSchema>;

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
    const {state, actions} = useProgressState();
    const palace = state.palaces.find((p) => p.id === palaceId);
    const floor = palace?.floors?.find((f) => f.id === floorId);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {errors},
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            duration: 10,
            content: "",
            isUnlocked: true,
            order: (floor?.rooms.length || 0) + 1,
        },
        mode: "onChange",
    });

    const watchDuration = watch("duration");
    const watchIsUnlocked = watch("isUnlocked");

    if (!palace || !floor) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-body text-[#6B7280]">Palace or Floor not found</p>
            </div>
        );
    }

    const onSubmit = (data: FormData) => {
        actions.createRoom(palaceId, floorId, {
            title: data.title.trim(),
            description: data.description.trim(),
            duration: data.duration,
            content: data.content.trim(),
            isUnlocked: data.isUnlocked,
            isCompleted: false,
            progress: 0,
            order: data.order,
        });
        onSuccess();
    };

    return (
        <div className="size-full flex flex-col relative">
            <DynamicBackground/>
            <AmbientParticles/>

            <div className="relative z-10 flex-1 flex flex-col">
                <div
                    className="bg-gradient-to-b from-[#091A7A]/95 to-[#4F8EFF]/95 relative flex-shrink-0 backdrop-blur-md">
                    <div
                        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_50%)]"/>

                    <div className="relative z-10">
                        <StatusBar textColor="white"/>
                    </div>

                    <div className="px-6 pt-3 pb-6 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                onClick={onBack}
                                className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
                            >
                                <ArrowLeft className="w-5 h-5 text-white"/>
                            </motion.button>

                            <div className="flex-1 text-center">
                                <h1 className="text-[18px] font-bold text-white">Create Room</h1>
                                <p className="text-white/70 text-[13px] mt-1">{floor.title}</p>
                            </div>

                            <div className="w-12"/>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pt-6 pb-24">
                    <form id="create-room-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="text-[#000000] text-[14px] font-medium mb-2 block">
                                Room Title
                            </label>
                            <Input
                                {...register("title")}
                                placeholder="e.g., Introduction to Planets"
                                className="w-full px-5 py-4 h-auto bg-white rounded-2xl text-[#000000] placeholder:text-[#86868B] outline-none border-2 border-[#E5E5EA] focus:border-[#007AFF] transition-all"
                            />
                            {errors.title && (
                                <p className="text-red-600 text-[13px] mt-2">{errors.title.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-[#000000] text-[14px] font-medium mb-2 block">
                                Description
                            </label>
                            <Textarea
                                {...register("description")}
                                placeholder="Brief description of what this room covers..."
                                rows={3}
                                className="w-full px-5 py-4 bg-white rounded-2xl text-[#000000] placeholder:text-[#86868B] outline-none border-2 border-[#E5E5EA] focus:border-[#007AFF] transition-all resize-none"
                            />
                            {errors.description && (
                                <p className="text-red-600 text-[13px] mt-2">{errors.description.message}</p>
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
                                    {...register("duration", {valueAsNumber: true})}
                                    className="flex-1"
                                />
                                <div
                                    className="px-4 py-3 bg-white rounded-xl border-2 border-[#E5E5EA] min-w-[80px] text-center">
                  <span className="text-[#000000] font-semibold text-[16px]">
                    {watchDuration}
                  </span>
                                    <span className="text-[#86868B] text-[13px] ml-1">min</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-[#000000] text-[14px] font-medium mb-2 block">
                                Room Content
                            </label>
                            <Textarea
                                {...register("content")}
                                placeholder="Enter the content that users will learn in this room..."
                                rows={8}
                                className="w-full px-5 py-4 bg-white rounded-2xl text-[#000000] placeholder:text-[#86868B] outline-none border-2 border-[#E5E5EA] focus:border-[#007AFF] transition-all resize-none font-mono text-[14px]"
                            />
                            {errors.content && (
                                <p className="text-red-600 text-[13px] mt-2">{errors.content.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-[#000000] text-[14px] font-medium mb-3 block">
                                Access Settings
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <motion.button
                                    type="button"
                                    whileTap={{scale: 0.96}}
                                    onClick={() => setValue("isUnlocked", true)}
                                    className={`p-5 rounded-2xl transition-all ${
                                        watchIsUnlocked
                                            ? "bg-gradient-to-br from-[#10b981] to-[#059669] text-white shadow-lg"
                                            : "bg-white text-[#000000] border-2 border-[#E5E5EA]"
                                    }`}
                                >
                                    <Unlock
                                        size={24}
                                        className={`mx-auto mb-2 ${watchIsUnlocked ? "text-white" : "text-[#10b981]"}`}
                                    />
                                    <p className="text-[15px] font-semibold mb-1">Unlocked</p>
                                    <p
                                        className={`text-[12px] ${watchIsUnlocked ? "text-white/80" : "text-[#86868B]"}`}
                                    >
                                        Available immediately
                                    </p>
                                </motion.button>

                                <motion.button
                                    type="button"
                                    whileTap={{scale: 0.96}}
                                    onClick={() => setValue("isUnlocked", false)}
                                    className={`p-5 rounded-2xl transition-all ${
                                        !watchIsUnlocked
                                            ? "bg-gradient-to-br from-[#ef4444] to-[#dc2626] text-white shadow-lg"
                                            : "bg-white text-[#000000] border-2 border-[#E5E5EA]"
                                    }`}
                                >
                                    <Lock
                                        size={24}
                                        className={`mx-auto mb-2 ${!watchIsUnlocked ? "text-white" : "text-[#ef4444]"}`}
                                    />
                                    <p className="text-[15px] font-semibold mb-1">Locked</p>
                                    <p
                                        className={`text-[12px] ${!watchIsUnlocked ? "text-white/80" : "text-[#86868B]"}`}
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
                            <Input
                                type="number"
                                min="1"
                                {...register("order", {valueAsNumber: true})}
                                className="w-full px-5 py-4 h-auto bg-white rounded-2xl text-[#000000] outline-none border-2 border-[#E5E5EA] focus:border-[#007AFF] transition-all"
                            />
                            {errors.order && (
                                <p className="text-red-600 text-[13px] mt-2">{errors.order.message}</p>
                            )}
                            <p className="text-[13px] text-[#86868B] mt-2">
                                This determines the room's position in the floor
                            </p>
                        </div>
                    </form>
                </div>

                <div className="p-6 bg-white/95 backdrop-blur-xl border-t border-[#E5E5EA]">
                    <motion.button
                        type="submit"
                        form="create-room-form"
                        className="w-full py-4 bg-gradient-to-r from-[#10b981] to-[#059669] text-white rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2"
                    >
                        <Sparkles size={20}/>
                        <span>Create Room</span>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
