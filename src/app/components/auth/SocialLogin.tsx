import {motion} from "motion/react";

export function SocialLogin() {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 1.2, duration: 0.5}}
            className="text-center mt-8"
        >
            {/* Divider */}
            <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#ADC8FF]/50 to-transparent"/>
                <motion.p
                    animate={{opacity: [0.7, 1, 0.7]}}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="text-small px-4 py-2 bg-card-glass border border-white/20 rounded-[12px] backdrop-blur-lg"
                    style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#091A7A",
                        fontFamily: "Lexend, sans-serif",
                    }}
                >
                    Or continue with
                </motion.p>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#ADC8FF]/50 to-transparent"/>
            </div>

            {/* Social Buttons - Google and Apple */}
            <div className="flex justify-center space-x-8">
                {[
                    {
                        icon: (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                        ),
                        bg: "bg-white border-gray-200/50",
                        shadow: "shadow-lg",
                    },
                    {
                        icon: (
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="text-white"
                            >
                                <path
                                    d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                        ),
                        bg: "bg-black border-gray-800/50",
                        shadow: "shadow-lg",
                    },
                ].map((social, index) => (
                    <motion.button
                        key={index}
                        whileTap={{scale: 0.92}}
                        type="button"
                        initial={{opacity: 0, scale: 0.8}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{
                            delay: 1.4 + index * 0.1,
                            duration: 0.5,
                            type: "spring",
                            bounce: 0.4,
                        }}
                        className={`relative group w-14 h-14 ${social.bg} border rounded-full flex items-center justify-center ${social.shadow} animate-touch min-h-[44px] min-w-[44px] backdrop-blur-lg transition-all duration-300`}
                    >
                        <motion.div
                            whileTap={{scale: 0.9}}
                            className="flex items-center justify-center"
                        >
                            {social.icon}
                        </motion.div>
                        <motion.div
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ADC8FF]/10 to-[#091A7A]/10 opacity-0 group-active:opacity-100 transition-opacity duration-200"/>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}
