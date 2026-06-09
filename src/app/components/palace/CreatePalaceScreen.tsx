import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {AnimatePresence, motion} from "motion/react";
import {ArrowLeft, ChevronRight, Sparkles} from "lucide-react";
import {DynamicBackground} from "../DynamicBackground";
import {AmbientParticles} from "../AmbientParticles";
import {useProgressState} from "../../hooks/useProgressState";
import {Input} from "../ui/input";
import {Textarea} from "../ui/textarea";
import {Drawer} from "vaul";
import {PalaceFormData, palaceFormSchema} from "./palaceForm";
import {CategoryGrid, ColorList, FieldError, IconGrid, PalacePreview,} from "./PalaceFormFields";

interface CreatePalaceScreenProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onBack?: () => void;
    /** Called with the new palace's id so the caller can navigate into it. */
    onSuccess: (palaceId: string) => void;
}

export function CreatePalaceScreen({
                                       open = true,
                                       onOpenChange,
                                       onBack,
                                       onSuccess,
                                   }: CreatePalaceScreenProps) {
    const {actions} = useProgressState();
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;

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
            name: "",
            description: "",
            category: "",
            icon: "🏛️",
            color: "from-purple-500 to-pink-500",
        },
        mode: "onChange",
    });

    const watchIcon = watch("icon");
    const watchColor = watch("color");
    const watchCategory = watch("category");

    const close = () => {
        onOpenChange?.(false);
        onBack?.();
    };

    const handleNext = async () => {
        if (currentStep === 1) {
            const isValid = await trigger(["name", "description", "category"]);
            if (!isValid) return;
        }
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            close();
        }
    };

    const onSubmit = (data: PalaceFormData) => {
        const palaceId = actions.createPalace({
            name: data.name.trim(),
            description: data.description.trim(),
            category: data.category,
            icon: data.icon,
            color: data.color,
            totalRooms: 0,
        });
        onSuccess(palaceId);
    };

    const renderProgressBar = () => (
        <div className="flex items-center gap-2 mb-8">
            {Array.from({length: totalSteps}).map((_, index) => (
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
            initial={{opacity: 0, x: 20}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: -20}}
            className="space-y-6"
        >
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Basic Information</h2>
                <p className="text-white/80 text-[15px]">
                    Name your palace and pick what it covers
                </p>
            </div>

            <div>
                <label htmlFor="palace-name" className="text-white text-[14px] font-medium mb-2 block">
                    Palace Name
                </label>
                <Input
                    id="palace-name"
                    {...register("name")}
                    placeholder="e.g., Ancient Rome"
                    className="w-full px-5 py-4 h-auto bg-white/20 backdrop-blur-md rounded-2xl text-white placeholder:text-white/50 outline-none border-2 border-transparent focus:border-white/50 transition-all"
                />
                <FieldError message={errors.name?.message}/>
            </div>

            <div>
                <label htmlFor="palace-description" className="text-white text-[14px] font-medium mb-2 block">
                    Description
                </label>
                <Textarea
                    id="palace-description"
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
        </motion.div>
    );

    const renderStep2 = () => (
        <motion.div
            key="step2"
            initial={{opacity: 0, x: 20}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: -20}}
            className="space-y-6"
        >
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Choose an Icon</h2>
                <p className="text-white/80 text-[15px]">
                    It marks this palace everywhere in the app
                </p>
            </div>

            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-6 space-y-6">
                <PalacePreview icon={watchIcon} color={watchColor}/>
                <IconGrid
                    value={watchIcon}
                    onChange={(icon) => setValue("icon", icon)}
                />
            </div>
        </motion.div>
    );

    const renderStep3 = () => (
        <motion.div
            key="step3"
            initial={{opacity: 0, x: 20}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: -20}}
            className="space-y-6"
        >
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Choose a Color</h2>
                <p className="text-white/80 text-[15px]">
                    It colors this palace's card and icon backdrop
                </p>
            </div>

            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-6 space-y-6">
                <PalacePreview icon={watchIcon} color={watchColor} size="lg"/>
                <ColorList
                    value={watchColor}
                    onChange={(color) => setValue("color", color)}
                />
            </div>
        </motion.div>
    );

    const content = (
        <div className="size-full flex flex-col relative h-full">
            <DynamicBackground/>
            <AmbientParticles/>

            <div className="relative z-10 flex-1 flex flex-col h-full overflow-hidden">
                <div
                    className="bg-gradient-to-b from-[#091A7A]/95 to-[#4F8EFF]/95 relative flex-shrink-0 backdrop-blur-md pb-4 pt-2">
                    <div
                        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_50%)]"/>

                    <div className="px-6 relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <motion.button
                                type="button"
                                whileTap={{scale: 0.92}}
                                aria-label={currentStep > 1 ? "Previous step" : "Close"}
                                onClick={handleBack}
                                className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                            >
                                <ArrowLeft className="w-4 h-4 text-white"/>
                            </motion.button>

                            <h1 className="text-[16px] font-bold text-white">
                                Create Palace
                            </h1>

                            <span className="w-11 text-right text-[13px] font-medium text-white/80">
                                {currentStep}/{totalSteps}
                            </span>
                        </div>

                        {renderProgressBar()}
                    </div>
                </div>

                <div
                    className="flex-1 overflow-y-auto scrollbar-hide px-6 py-4 bg-gradient-to-b from-[#4F8EFF]/95 to-[#ADC8FF]/95 relative">
                    <form id="create-palace-form" onSubmit={handleSubmit(onSubmit)}>
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && renderStep1()}
                            {currentStep === 2 && renderStep2()}
                            {currentStep === 3 && renderStep3()}
                        </AnimatePresence>
                    </form>
                </div>

                <div className="p-6 bg-white/95 backdrop-blur-xl shrink-0">
                    <div className="flex gap-3">
                        {currentStep < totalSteps ? (
                            <motion.button
                                type="button"
                                whileTap={{scale: 0.98}}
                                onClick={handleNext}
                                className="flex-1 py-4 bg-[#091A7A] text-white rounded-2xl font-semibold shadow-interactive flex items-center justify-center gap-2"
                            >
                                <span>Continue</span>
                                <ChevronRight size={20}/>
                            </motion.button>
                        ) : (
                            <motion.button
                                type="submit"
                                form="create-palace-form"
                                whileTap={{scale: 0.98}}
                                className="flex-1 py-4 bg-[#091A7A] text-white rounded-2xl font-semibold shadow-interactive flex items-center justify-center gap-2"
                            >
                                <Sparkles size={20}/>
                                <span>Create palace</span>
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Drawer.Root
            open={open}
            onOpenChange={(isOpen) => {
                onOpenChange?.(isOpen);
                if (!isOpen) onBack?.();
            }}
        >
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-[#091A7A]/40 z-[100]"/>
                <Drawer.Content
                    aria-describedby={undefined}
                    className="bg-white flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0 z-[101] outline-none overflow-hidden">
                    <Drawer.Title className="sr-only">Create Palace</Drawer.Title>
                    <div className="pt-4 bg-[#091A7A] rounded-t-[10px] flex-1 flex flex-col overflow-hidden">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-white/50 mb-2"/>
                        <div className="flex-1 overflow-hidden">
                            {content}
                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
