import {motion} from "motion/react";

const ANIMATION_CONFIG = {
    overlay1: {
        duration: 8,
        keyframes: {
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
        },
    },
    overlay2: {
        duration: 12,
        delay: 2,
        keyframes: {
            opacity: [0.2, 0.5, 0.2],
            scale: [1.1, 1, 1.1],
        },
    },
    ambient: {
        duration: 15,
        keyframes: {
            x: ["-10%", "10%", "-10%"],
            y: ["-5%", "5%", "-5%"],
            opacity: [0.1, 0.3, 0.1],
        },
    },
};

export function DynamicBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Base gradient layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ADC8FF] via-[#E8F2FF] to-white"/>

            {/* Primary animated orb */}
            <motion.div
                animate={ANIMATION_CONFIG.overlay1.keyframes}
                transition={{
                    duration: ANIMATION_CONFIG.overlay1.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatType: "reverse",
                }}
                className="absolute inset-0 will-change-transform"
                style={{
                    background:
                        "radial-gradient(circle at 20% 30%, rgba(173, 200, 255, 0.2) 0%, transparent 50%)",
                    transform: "translate3d(0, 0, 0)",
                }}
            />

            {/* Secondary animated orb */}
            <motion.div
                animate={ANIMATION_CONFIG.overlay2.keyframes}
                transition={{
                    duration: ANIMATION_CONFIG.overlay2.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: ANIMATION_CONFIG.overlay2.delay,
                    repeatType: "reverse",
                }}
                className="absolute inset-0 will-change-transform"
                style={{
                    background:
                        "radial-gradient(circle at 80% 70%, rgba(173, 200, 255, 0.15) 0%, transparent 40%)",
                    transform: "translate3d(0, 0, 0)",
                }}
            />

            {/* Ambient floating gradient */}
            <motion.div
                animate={ANIMATION_CONFIG.ambient.keyframes}
                transition={{
                    duration: ANIMATION_CONFIG.ambient.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatType: "reverse",
                }}
                className="absolute inset-0 will-change-transform"
                style={{
                    background:
                        "radial-gradient(ellipse at center, rgba(173, 200, 255, 0.12) 0%, transparent 60%)",
                    transform: "translate3d(0, 0, 0)",
                }}
            />

            {/* Subtle noise texture overlay for depth */}
            <div
                className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "repeat",
                }}
            />
        </div>
    );
}