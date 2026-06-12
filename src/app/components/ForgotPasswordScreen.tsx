import {motion, AnimatePresence} from "motion/react";
import {useEffect, useState} from "react";
import {ArrowLeft, Mail, MailCheck, Sparkles} from "lucide-react";
import {toast} from "sonner";
import {AppIcon} from "./ui";
import {AuthBackground, AuthInput, ValidCheckmark} from "./auth";

interface ForgotPasswordScreenProps {
    onBack: () => void;
}

type Step = "email" | "sent";

const RESEND_SECONDS = 30;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Keep the first couple of characters, mask the rest of the local part. */
function maskEmail(email: string): string {
    const [local, domain] = email.split("@");
    if (!domain) return email;
    const head = local.slice(0, Math.min(2, local.length));
    return `${head}${"•".repeat(Math.max(3, local.length - head.length))}@${domain}`;
}

/**
 * Password-recovery flow reached from the login screen. There is no backend, so
 * sending is simulated: enter an email, then land on a "check your inbox"
 * confirmation with a rate-limited resend. Mirrors the login/signup visual
 * language (AuthBackground, AuthInput, staggered motion).
 */
export function ForgotPasswordScreen({onBack}: ForgotPasswordScreenProps) {
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const isValid = EMAIL_RE.test(email.trim());

    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    const sendReset = () => {
        setIsLoading(true);
        // Simulated request — always succeeds for any valid-looking address.
        setTimeout(() => {
            setIsLoading(false);
            setStep("sent");
            setCooldown(RESEND_SECONDS);
        }, 1400);
    };

    const handleSubmit = () => {
        if (!isValid || isLoading) return;
        sendReset();
    };

    const handleResend = () => {
        if (cooldown > 0) return;
        setCooldown(RESEND_SECONDS);
        toast.success("Reset link sent again", {
            description: `Check ${maskEmail(email.trim())}.`,
        });
    };

    return (
        <div className="flex-1 flex flex-col relative">
            <AuthBackground/>

            <div className="h-safe-top"/>

            {/* Header */}
            <motion.div
                initial={{y: -20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{duration: 0.6}}
                className="flex items-center justify-between p-6 pt-8 relative z-10"
            >
                <motion.button
                    whileTap={{scale: 0.95}}
                    onClick={onBack}
                    aria-label="Back to sign in"
                    className="w-12 h-12 bg-card-glass border border-white/30 rounded-full flex items-center justify-center shadow-card animate-touch min-h-[44px] min-w-[44px] backdrop-blur-lg"
                >
                    <ArrowLeft size={20} color="#091A7A"/>
                </motion.button>
                <div className="w-12"/>
            </motion.div>

            {/* Logo */}
            <motion.div
                initial={{scale: 0.8, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                transition={{delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1]}}
                className="flex flex-col items-center gap-4 px-6 relative z-10"
            >
                <div className="relative">
                    <motion.div
                        animate={{rotate: [0, 8, -8, 0]}}
                        transition={{duration: 6, repeat: Infinity, ease: "easeInOut"}}
                        className="absolute -top-2 -right-2 text-[#FFC71E]"
                    >
                        <Sparkles size={18} fill="currentColor"/>
                    </motion.div>
                    <AppIcon className="w-16 h-16"/>
                </div>
            </motion.div>

            {/* Body */}
            <div className="flex-1 flex flex-col px-6 pt-8 relative z-10">
                <AnimatePresence mode="wait" initial={false}>
                    {step === "email" ? (
                        <motion.div
                            key="email"
                            initial={{opacity: 0, y: 16}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -16}}
                            transition={{duration: 0.3, ease: [0.22, 1, 0.36, 1]}}
                            className="space-y-6"
                        >
                            <div className="space-y-2 text-center">
                                <h1 className="text-main-heading text-[#091A7A]">Forgot password?</h1>
                                <p className="text-body text-[#33417A] max-w-[34ch] mx-auto">
                                    Enter the email tied to your account and we'll send a link to reset
                                    your password.
                                </p>
                            </div>

                            <AuthInput
                                id="email"
                                label="Email address"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={setEmail}
                                focusedField={focusedField}
                                setFocusedField={setFocusedField}
                                icon={<Mail size={20}/>}
                                rightElement={isValid ? <ValidCheckmark/> : undefined}
                            />

                            <motion.button
                                whileTap={{scale: 0.98}}
                                onClick={handleSubmit}
                                disabled={!isValid || isLoading}
                                type="button"
                                className={`w-full h-16 rounded-[24px] font-semibold shadow-elevated animate-touch min-h-[44px] relative overflow-hidden transition-all duration-300 flex items-center justify-center ${
                                    isValid && !isLoading
                                        ? "bg-gradient-to-r from-[#091A7A] via-[#4A5FC4] to-[#091A7A] text-white"
                                        : "bg-gradient-to-r from-gray-300 to-gray-200 text-gray-500"
                                }`}
                                style={{fontSize: "17px", fontFamily: "Lexend, sans-serif"}}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <motion.div
                                            animate={{rotate: 360}}
                                            transition={{duration: 1, repeat: Infinity, ease: "linear"}}
                                            className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                        Sending link...
                                    </span>
                                ) : (
                                    "Send reset link"
                                )}
                            </motion.button>

                            <button
                                onClick={onBack}
                                className="w-full text-small font-medium text-[#091A7A]/70 hover:text-[#091A7A] transition-colors py-2"
                            >
                                Back to sign in
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sent"
                            initial={{opacity: 0, y: 16}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -16}}
                            transition={{duration: 0.3, ease: [0.22, 1, 0.36, 1]}}
                            className="space-y-6 text-center"
                        >
                            <motion.div
                                initial={{scale: 0, rotate: -10}}
                                animate={{scale: 1, rotate: 0}}
                                transition={{type: "spring", stiffness: 300, damping: 20}}
                                className="w-20 h-20 mx-auto rounded-[28px] bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] flex items-center justify-center shadow-[0_12px_32px_rgba(16,185,129,0.35)]"
                            >
                                <MailCheck className="w-10 h-10 text-white"/>
                            </motion.div>

                            <div className="space-y-2">
                                <h1 className="text-main-heading text-[#091A7A]">Check your inbox</h1>
                                <p className="text-body text-[#33417A] max-w-[36ch] mx-auto">
                                    If an account exists for{" "}
                                    <span className="font-semibold text-[#091A7A]">
                                        {maskEmail(email.trim())}
                                    </span>
                                    , a reset link is on its way. It can take a minute to arrive.
                                </p>
                            </div>

                            <div className="rounded-[20px] bg-card-glass border border-white/30 backdrop-blur-lg shadow-card p-4 text-left">
                                <p className="text-small text-[#33417A]">
                                    Didn't get it? Check your spam folder, or resend below.
                                </p>
                            </div>

                            <motion.button
                                whileTap={{scale: cooldown > 0 ? 1 : 0.98}}
                                onClick={handleResend}
                                disabled={cooldown > 0}
                                type="button"
                                className={`w-full h-14 rounded-[20px] font-semibold animate-touch min-h-[44px] transition-all duration-200 ${
                                    cooldown > 0
                                        ? "bg-white/40 text-[#091A7A]/40"
                                        : "bg-[#EAF4FF] text-[#091A7A]"
                                }`}
                                style={{fontFamily: "Lexend, sans-serif"}}
                            >
                                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend email"}
                            </motion.button>

                            <button
                                onClick={onBack}
                                className="w-full h-16 rounded-[24px] font-semibold bg-gradient-to-r from-[#091A7A] via-[#4A5FC4] to-[#091A7A] text-white shadow-elevated animate-touch"
                                style={{fontSize: "17px", fontFamily: "Lexend, sans-serif"}}
                            >
                                Back to sign in
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="h-[max(env(safe-area-inset-bottom),1.5rem)]"/>
        </div>
    );
}
