import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {motion} from "motion/react";
import {ArrowLeft, Save} from "lucide-react";
import {StatusBar} from "../ui/StatusBar";
import {DynamicBackground} from "../DynamicBackground";
import {AmbientParticles} from "../AmbientParticles";
import {useProgressState} from "../../hooks/useProgressState";
import {Input} from "../ui/input";
import {Textarea} from "../ui/textarea";
import {PalaceFormData, palaceFormSchema} from "./palaceForm";
import {CategoryGrid, ColorList, FieldError, IconGrid, PalacePreview,} from "./PalaceFormFields";

interface EditPalaceScreenProps {
    palaceId: string;
    onBack: () => void;
    onSuccess: () => void;
}

export function EditPalaceScreen({palaceId, onBack, onSuccess}: EditPalaceScreenProps) {
    const {state, actions} = useProgressState();
    const palace = state.palaces.find((p) => p.id === palaceId);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        formState: {errors},
    } = useForm<PalaceFormData>({
        resolver: zodResolver(palaceFormSchema),
        defaultValues: {
            name: palace?.name ?? "",
            description: palace?.description ?? "",
            category: palace?.category ?? "",
            icon: palace?.icon ?? "🏛️",
            color: palace?.color ?? "from-purple-500 to-pink-500",
        },
        mode: "onChange",
    });

    const watchIcon = watch("icon");
    const watchColor = watch("color");
    const watchCategory = watch("category");

    if (!palace) {
        return (
            <div className="h-full flex items-center justify-center bg-[#091A7A]">
                <p className="text-white text-[15px]">Palace not found</p>
            </div>
        );
    }

    const onSubmit = (data: PalaceFormData) => {
        actions.updatePalace(palaceId, {
            name: data.name.trim(),
            description: data.description.trim(),
            category: data.category,
            icon: data.icon,
            color: data.color,
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
                    <form
                        id="edit-palace-form"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div>
                            <label htmlFor="edit-palace-name" className="text-white text-[14px] font-medium mb-2 block">
                                Palace Name
                            </label>
                            <Input
                                id="edit-palace-name"
                                {...register("name")}
                                placeholder="e.g., Ancient Rome"
                                className="w-full px-5 py-4 h-auto bg-white/20 backdrop-blur-md rounded-2xl text-white placeholder:text-white/50 outline-none border-2 border-transparent focus:border-white/50 transition-all"
                            />
                            <FieldError message={errors.name?.message}/>
                        </div>

                        <div>
                            <label htmlFor="edit-palace-description"
                                   className="text-white text-[14px] font-medium mb-2 block">
                                Description
                            </label>
                            <Textarea
                                id="edit-palace-description"
                                {...register("description")}
                                placeholder="Describe what you'll learn in this memory palace..."
                                rows={4}
                                className="w-full px-5 py-4 bg-white/20 backdrop-blur-md rounded-2xl text-white placeholder:text-white/50 outline-none border-2 border-transparent focus:border-white/50 transition-all resize-none"
                            />
                            <FieldError message={errors.description?.message}/>
                        </div>

                        <div>
                            <span className="text-white text-[14px] font-medium mb-3 block">
                                Category
                            </span>
                            <CategoryGrid
                                value={watchCategory}
                                onChange={(category) => {
                                    setValue("category", category);
                                    trigger("category");
                                }}
                            />
                            <FieldError message={errors.category?.message}/>
                        </div>

                        <div>
                            <span className="text-white text-[14px] font-medium mb-3 block">
                                Icon
                            </span>
                            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-6 space-y-6">
                                <PalacePreview icon={watchIcon} color={watchColor}/>
                                <IconGrid
                                    value={watchIcon}
                                    onChange={(icon) => setValue("icon", icon)}
                                />
                            </div>
                        </div>

                        <div>
                            <span className="text-white text-[14px] font-medium mb-3 block">
                                Color Scheme
                            </span>
                            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-6">
                                <ColorList
                                    value={watchColor}
                                    onChange={(color) => setValue("color", color)}
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-6 bg-white/95 backdrop-blur-xl shrink-0 border-t border-white/20">
                    <motion.button
                        type="submit"
                        form="edit-palace-form"
                        whileTap={{scale: 0.98}}
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
