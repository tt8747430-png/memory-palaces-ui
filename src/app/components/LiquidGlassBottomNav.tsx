import {motion, useMotionValue, useSpring,} from "motion/react";
import {type ReactNode, useEffect, useRef} from "react";
import {HomeFilledIcon, HomeOutlineIcon, PalaceNavIcon, ProfileNavIcon,} from "../icons";

interface LiquidGlassBottomNavProps {
    activeTab: string;
    onTabChange: (tab: "home" | "palaces" | "profile") => void;
}

interface NavItem {
    icon: (active: boolean) => ReactNode;
    tab: "home" | "palaces" | "profile";
    label: string;
}

export function LiquidGlassBottomNav({
                                         activeTab,
                                         onTabChange,
                                     }: LiquidGlassBottomNavProps) {
    const navItems: NavItem[] = [
        {
            icon: (active) =>
                active ? (
                    <HomeFilledIcon className="w-6 h-6"/>
                ) : (
                    <HomeOutlineIcon className="w-6 h-6"/>
                ),
            tab: "home",
            label: "Home",
        },
        {
            icon: () => <PalaceNavIcon className="w-6 h-6"/>,
            tab: "palaces",
            label: "Palaces",
        },
        {
            icon: () => <ProfileNavIcon className="w-6 h-6"/>,
            tab: "profile",
            label: "Profile",
        },
    ];

    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const getActiveIndex = () => {
        switch (activeTab) {
            case "home":
                return 0;
            case "palaces":
                return 1;
            case "profile":
                return 2;
            default:
                return 0;
        }
    };

    const indicatorX = useMotionValue(0);
    const springConfig = {
        stiffness: 500,
        damping: 40,
        mass: 0.6,
    };
    const indicatorSpring = useSpring(indicatorX, springConfig);

    useEffect(() => {
        const activeIndex = getActiveIndex();
        const button = buttonRefs.current[activeIndex];
        const container = containerRef.current;

        if (button && container) {
            const buttonRect = button.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const containerPaddingLeft = 16;
            const relativeX =
                buttonRect.left -
                containerRect.left -
                containerPaddingLeft;
            const buttonCenter = relativeX + buttonRect.width / 2;
            const indicatorLeft = buttonCenter - 28;
            indicatorX.set(indicatorLeft);
        }
    }, [activeTab]);

    return (
        <div className="fixed bottom-[max(1.25rem,calc(env(safe-area-inset-bottom)+0.5rem))] left-1/2 -translate-x-1/2 z-50">
            <div
                className="absolute inset-0 bg-gradient-to-t from-[#091A7A]/20 via-[#4F8EFF]/10 to-transparent blur-2xl scale-110 opacity-60"/>

            <div className="relative w-[320px] h-20 rounded-[40px] overflow-hidden shadow-2xl">
                <div
                    className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/8 to-white/15 backdrop-blur-3xl"/>

                <div className="absolute inset-0 rounded-[40px] p-[1px]">
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-white/5 rounded-[40px]"/>
                    <div
                        className="absolute inset-[1px] bg-gradient-to-br from-[#091A7A]/60 via-[#1a2b8a]/50 to-[#091A7A]/60 rounded-[40px]"/>
                </div>

                <div
                    ref={containerRef}
                    className="relative h-full px-4 flex items-center justify-between"
                >
                    <motion.div
                        className="absolute h-14 w-14 rounded-[24px] overflow-hidden"
                        style={{x: indicatorSpring}}
                    >
                        <motion.div
                            className="absolute inset-0 rounded-[24px]"
                            animate={{
                                background: [
                                    "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 100%)",
                                    "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.92) 100%)",
                                    "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 100%)",
                                ],
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />

                        <motion.div
                            className="absolute inset-0 rounded-[24px]"
                            animate={{
                                background: [
                                    "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
                                    "linear-gradient(225deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
                                ],
                            }}
                            transition={{
                                duration: 3.5,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />

                        <div
                            className="absolute inset-0 rounded-[24px]"
                            style={{
                                boxShadow:
                                    "inset 0 2px 8px rgba(0,0,0,0.12), inset 0 -2px 6px rgba(255,255,255,0.25)",
                            }}
                        />
                    </motion.div>

                    {navItems.map((item, index) => {
                        const isActive = activeTab === item.tab;

                        return (
                            <motion.button
                                key={item.tab}
                                ref={(el) => {
                                    buttonRefs.current[index] = el;
                                }}
                                onClick={() => onTabChange(item.tab)}
                                className="relative flex flex-col items-center justify-center gap-1 z-10 min-w-[72px]"
                                whileTap={{scale: 0.92}}
                                animate={{
                                    scale: isActive ? 1.05 : 1,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                }}
                            >
                                <motion.div
                                    animate={{
                                        color: isActive ? "#091A7A" : "#ffffff",
                                        filter: isActive
                                            ? "drop-shadow(0 2px 4px rgba(9, 26, 122, 0.2))"
                                            : "drop-shadow(0 1px 2px rgba(255, 255, 255, 0.1))",
                                    }}
                                    transition={{
                                        duration: 0.25,
                                        ease: "easeOut",
                                    }}
                                >
                                    {item.icon(isActive)}
                                </motion.div>

                                <motion.span
                                    className="text-[10px] font-medium"
                                    animate={{
                                        color: isActive ? "#091A7A" : "#ffffff",
                                        opacity: isActive ? 1 : 0.7,
                                        fontWeight: isActive ? 600 : 500,
                                    }}
                                    transition={{
                                        duration: 0.25,
                                        ease: "easeOut",
                                    }}
                                >
                                    {item.label}
                                </motion.span>

                                {isActive && (
                                    <motion.div
                                        layoutId="activeDot"
                                        className="absolute -bottom-1 w-1 h-1 bg-[#091A7A] rounded-full"
                                        initial={false}
                                        transition={{
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 35,
                                        }}
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                <div
                    className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent rounded-[40px] pointer-events-none"/>

                <div
                    className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/5 via-transparent to-transparent rounded-b-[40px] pointer-events-none"/>
            </div>

            <div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[280px] h-8 bg-[#091A7A]/20 blur-xl rounded-full"/>
        </div>
    );
}