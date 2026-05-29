import {motion} from "motion/react";
import {useState} from "react";
import {ArrowLeft, Eye, EyeOff, Lock, Mail, Sparkles, User,} from "lucide-react";
import {AppIcon, StatusBar} from "./ui";
import {AuthBackground, AuthInput, SocialLogin, ValidCheckmark} from "./auth";

export default function SignupScreen({
                                         onClose,
                                         onLogin,
                                         onSignUp,
                                     }: {
    onClose?: () => void;
    onLogin?: () => void;
    onSignUp?: () => void;
}) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [focusedField, setFocusedField] = useState<
        string | null
    >(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = () => {
        if (!fullName || !email || !password || !agreeToTerms) {
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onSignUp?.();
        }, 1500);
    };

    const isFormValid =
        fullName &&
        email &&
        email.includes("@") &&
        email.includes(".") &&
        password.length >= 6 &&
        agreeToTerms;

    return (
        <div className="flex-1 flex flex-col relative bg-white">
            {/* Floating Background Elements */}
            <AuthBackground/>

            {/* Status Bar */}
            <div className="pt-[21px]">
                <StatusBar theme="light"/>
            </div>

            {/* Header */}
            <motion.div
                initial={{y: -20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{duration: 0.6}}
                className="flex items-center justify-between p-6 pt-8 relative z-10"
            >
                <motion.button
                    whileTap={{scale: 0.95}}
                    onClick={onClose}
                    className="w-12 h-12 bg-card-glass border border-white/30 rounded-full flex items-center justify-center shadow-card animate-touch min-h-[44px] min-w-[44px] backdrop-blur-lg"
                >
                    <ArrowLeft size={20} color="#091A7A"/>
                </motion.button>

                <div className="flex-1 text-center">
                    <motion.h2
                        initial={{scale: 0.8, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        transition={{delay: 0.2, duration: 0.5}}
                        className="text-main-heading"
                        style={{
                            fontSize: "24px",
                            fontWeight: 700,
                            background:
                                "linear-gradient(135deg, #091A7A 0%, #ADC8FF 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontFamily: "Lexend, sans-serif",
                        }}
                    >
                        Create Account
                    </motion.h2>
                    <motion.p
                        initial={{y: 10, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        transition={{delay: 0.3, duration: 0.5}}
                        className="text-small opacity-70 mt-1"
                    >
                        Join the memory revolution
                    </motion.p>
                </div>

                <div className="w-12"/>
            </motion.div>

            {/* Animated Logo */}
            <div className="flex justify-center mb-8">
                <motion.div
                    initial={{scale: 0, rotateY: 180}}
                    animate={{scale: 1, rotateY: 0}}
                    transition={{
                        duration: 0.8,
                        delay: 0.4,
                        type: "spring",
                        bounce: 0.4,
                    }}
                    className="relative"
                >
                    {/* Glow Effect */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute inset-0 w-20 h-20 bg-[#ADC8FF]/30 rounded-[20px] blur-lg"
                    />

                    {/* Main Logo Container */}
                    <div
                        className="relative w-20 h-20 bg-card-glass border border-white/30 rounded-[20px] p-3 shadow-elevated backdrop-blur-lg">
                        <motion.div
                            animate={{rotate: [0, 5, -5, 0]}}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="w-full h-full text-[#091A7A]"
                        >
                            <AppIcon size={56}/>
                        </motion.div>
                    </div>

                    {/* Sparkle Effects */}
                    <Sparkles
                        size={16}
                        className="absolute -top-2 -right-2 text-[#ADC8FF] animate-pulse"
                    />
                </motion.div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-6">
                <motion.div
                    initial={{y: 30, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{duration: 0.8, delay: 0.6}}
                    className="space-y-5 pb-[40px]"
                >
                    {/* Full Name Input */}
                    <AuthInput
                        id="fullName"
                        label="Full Name"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={setFullName}
                        focusedField={focusedField}
                        setFocusedField={setFocusedField}
                        icon={<User size={20}/>}
                        rightElement={fullName ? <ValidCheckmark/> : undefined}
                    />

                    {/* Email Input */}
                    <AuthInput
                        id="email"
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={setEmail}
                        focusedField={focusedField}
                        setFocusedField={setFocusedField}
                        icon={<Mail size={20}/>}
                        rightElement={
                            email && email.includes("@") && email.includes(".") ? (
                                <ValidCheckmark/>
                            ) : undefined
                        }
                    />

                    {/* Password Input */}
                    <AuthInput
                        id="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={password}
                        onChange={setPassword}
                        focusedField={focusedField}
                        setFocusedField={setFocusedField}
                        icon={<Lock size={20}/>}
                        rightElement={
                            <motion.button
                                whileTap={{scale: 0.9}}
                                onClick={() => setShowPassword(!showPassword)}
                                type="button"
                                className="p-1 animate-touch min-h-[44px] min-w-[44px] flex items-center justify-center rounded-[12px] hover:bg-white/10 transition-colors duration-200"
                            >
                                <motion.div
                                    animate={{rotate: showPassword ? 180 : 0}}
                                    transition={{duration: 0.3}}
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} color="#6B7280"/>
                                    ) : (
                                        <Eye size={20} color="#6B7280"/>
                                    )}
                                </motion.div>
                            </motion.button>
                        }
                        bottomElement={
                            password ? (
                                <div className="flex space-x-1 mt-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                                                password.length >= i * 2
                                                    ? i <= 2
                                                        ? "bg-[#EF4444]"
                                                        : i <= 3
                                                            ? "bg-[#F59E0B]"
                                                            : "bg-[#10B981]"
                                                    : "bg-gray-200"
                                            }`}
                                        />
                                    ))}
                                </div>
                            ) : undefined
                        }
                    />

                    {/* Terms Checkbox */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.8, duration: 0.5}}
                        className="flex items-start space-x-3 mt-6 p-4 bg-gradient-to-r from-[#ADC8FF]/10 to-[#091A7A]/5 rounded-[16px] border border-white/20"
                    >
                        <motion.button
                            whileTap={{scale: 0.9}}
                            onClick={() => setAgreeToTerms(!agreeToTerms)}
                            type="button"
                            className="relative flex items-center justify-center p-3 animate-touch transition-all duration-200"
                            style={{minHeight: "44px", minWidth: "44px"}}
                        >
                            {/* Modern Animated Checkbox */}
                            <motion.div
                                animate={{
                                    borderColor: agreeToTerms
                                        ? "#091A7A"
                                        : "rgba(255, 255, 255, 0.3)",
                                    scale: agreeToTerms ? 1.05 : 1,
                                }}
                                transition={{
                                    duration: 0.4,
                                    ease: [0.23, 1, 0.32, 1],
                                }}
                                className={`w-4 h-4 border rounded-[6px] flex items-center justify-center shadow-card relative overflow-hidden transition-colors duration-400 ${
                                    agreeToTerms
                                        ? "bg-gradient-to-br from-[#091A7A] via-[#4A5FC4] to-[#091A7A]"
                                        : "bg-white/90"
                                }`}
                            >
                                {/* Animated Shine Effect */}
                                {agreeToTerms && (
                                    <motion.div
                                        initial={{x: "-120%", opacity: 0}}
                                        animate={{x: "120%", opacity: [0, 1, 0]}}
                                        transition={{
                                            duration: 0.6,
                                            delay: 0.1,
                                            ease: "easeOut",
                                        }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                                    />
                                )}

                                {/* Modern SVG Checkmark Animation */}
                                {agreeToTerms && (
                                    <motion.svg
                                        initial={{scale: 0, opacity: 0}}
                                        animate={{
                                            scale: 1,
                                            opacity: 1,
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.1,
                                            type: "spring",
                                            bounce: 0.6,
                                        }}
                                        width="10"
                                        height="8"
                                        viewBox="0 0 10 8"
                                        fill="none"
                                        className="relative z-10"
                                    >
                                        <motion.path
                                            initial={{pathLength: 0, opacity: 0}}
                                            animate={{pathLength: 1, opacity: 1}}
                                            transition={{
                                                pathLength: {
                                                    duration: 0.4,
                                                    delay: 0.2,
                                                    ease: "easeInOut",
                                                },
                                                opacity: {duration: 0.1, delay: 0.2},
                                            }}
                                            d="M1 4L3.5 6.5L9 1"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            fill="none"
                                        />
                                    </motion.svg>
                                )}

                                {/* Ripple Effect */}
                                {agreeToTerms && (
                                    <motion.div
                                        initial={{scale: 0, opacity: 0.6}}
                                        animate={{scale: 3, opacity: 0}}
                                        transition={{
                                            duration: 0.6,
                                            ease: "easeOut",
                                        }}
                                        className="absolute inset-0 bg-[#091A7A]/20 rounded-full"
                                    />
                                )}
                            </motion.div>
                        </motion.button>
                        <motion.button
                            whileTap={{scale: 0.98}}
                            onClick={() => setAgreeToTerms(!agreeToTerms)}
                            type="button"
                            className="flex-1 text-left animate-touch"
                        >
                            <p className="text-small text-[#6B7280] leading-relaxed">
                                I agree to the{" "}
                                <span className="text-[#091A7A] font-medium">
                  Terms of Service
                </span>{" "}
                                and{" "}
                                <span className="text-[#091A7A] font-medium">
                  Privacy Policy
                </span>
                            </p>
                        </motion.button>
                    </motion.div>

                    {/* Register Button */}
                    <motion.button
                        whileTap={{scale: 0.98}}
                        onClick={handleRegister}
                        disabled={!isFormValid || isLoading}
                        type="button"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 1, duration: 0.5}}
                        className={`w-full h-16 rounded-[24px] font-semibold shadow-elevated animate-touch min-h-[44px] mt-8 relative overflow-hidden transition-all duration-300 flex items-center justify-center ${
                            isFormValid && !isLoading
                                ? "bg-gradient-to-r from-[#091A7A] via-[#4A5FC4] to-[#091A7A] text-white hover:shadow-2xl"
                                : "bg-gradient-to-r from-gray-300 to-gray-200 text-gray-500"
                        }`}
                        style={{
                            fontSize: "18px",
                            fontWeight: 600,
                            fontFamily: "Lexend, sans-serif",
                        }}
                    >
                        {/* Animated Background Shine */}
                        {isFormValid && !isLoading && (
                            <>
                                <motion.div
                                    animate={{
                                        x: ["-120%", "120%"],
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        repeatDelay: 1,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                />

                                {/* Subtle Glow */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-[#ADC8FF]/20 via-transparent to-[#ADC8FF]/20 rounded-[24px]"/>
                            </>
                        )}

                        {/* Button Content */}
                        <div className="relative z-10 flex items-center justify-center">
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-3">
                                    <motion.div
                                        animate={{rotate: 360}}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                    <span>Creating Account...</span>
                                </div>
                            ) : (
                                <span>Create Account</span>
                            )}
                        </div>
                    </motion.button>

                    {/* Social Login */}
                    <SocialLogin/>

                    {/* Sign In Link */}
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 1.6, duration: 0.5}}
                        className="text-center mt-8 mb-8"
                    >
                        <motion.div
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-card-glass border border-white/20 rounded-[16px] backdrop-blur-lg shadow-card"
                            whileTap={{scale: 0.98}}
                        >
                            <p
                                className="text-small"
                                style={{
                                    fontSize: "14px",
                                    fontWeight: 400,
                                    color: "#091A7A",
                                    fontFamily: "Lexend, sans-serif",
                                }}
                            >
                                Already have an account?
                            </p>
                            <motion.button
                                whileTap={{scale: 0.95}}
                                type="button"
                                onClick={onLogin}
                                className="text-small font-medium animate-touch px-3 py-1 bg-gradient-to-r from-[#091A7A] to-[#ADC8FF] rounded-[12px] shadow-sm"
                                style={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#FFFFFF",
                                    fontFamily: "Lexend, sans-serif",
                                }}
                            >
                                Sign in
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Home Indicator */}
            <div className="flex justify-center pb-[8px]">
                <div className="h-[5px] w-[140px] bg-[#000000]/20 rounded-full"/>
            </div>
        </div>
    );
}