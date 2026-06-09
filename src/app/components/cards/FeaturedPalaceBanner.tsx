import {motion} from "motion/react";
import {ArrowRight} from "lucide-react";

interface FeaturedPalaceBannerProps {
    title: string;
    subtitle: string;
    count: string;
    backgroundImage?: string;
    icon?: string;
    onExplore: () => void;
}

export function FeaturedPalaceBanner({
                                         title,
                                         subtitle,
                                         count,
                                         backgroundImage,
                                         icon = "🏛️",
                                         onExplore,
                                     }: FeaturedPalaceBannerProps) {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            className="relative bg-gradient-to-br from-[#ADC8FF] to-[#E8F2FF] rounded-2xl shadow-[0px_6px_16px_0px_rgba(19,44,74,0.05)] overflow-hidden h-[156px]"
        >
            <div className="relative z-10 p-5">
                <p className="text-sm font-medium text-[#33417A] mb-1">
                    {subtitle}
                </p>
                <p className="mb-4">
                    <span className="text-3xl font-black text-[#091A7A]">{count} </span>
                    <span className="text-sm font-medium text-[#33417A]">{title}</span>
                </p>

                <motion.button
                    whileTap={{scale: 0.95}}
                    onClick={onExplore}
                    className="bg-[#091A7A] text-white px-6 py-2.5 rounded-2xl font-semibold text-sm inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                >
                    Explore more
                    <ArrowRight className="w-4 h-4"/>
                </motion.button>
            </div>

            {/* Decorative Icon */}
            <div className="absolute right-4 top-3 text-8xl opacity-30 pointer-events-none">
                {icon}
            </div>

            {/* Optional Background Image */}
            {backgroundImage && (
                <div className="absolute right-0 top-0 h-full w-1/2 opacity-20">
                    <img
                        src={backgroundImage}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                </div>
            )}
        </motion.div>
    );
}
