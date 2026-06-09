import {motion} from "motion/react";
import {AlertCircle, ArrowLeft, Check, Smartphone} from "lucide-react";
import {useState} from "react";

interface PhoneConnectScreenProps {
    onBack: () => void;
    onPhoneConnected: (phone: string) => void;
}

export function PhoneConnectScreen({onBack, onPhoneConnected}: PhoneConnectScreenProps) {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [step, setStep] = useState<"phone" | "verify">("phone");
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState("");

    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, "");
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
            return [match[1], match[2], match[3]].filter(Boolean).join("-");
        }
        return value;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhoneNumber(formatted);
        setError("");
    };

    const handleSendCode = async () => {
        if (phoneNumber.replace(/-/g, "").length !== 10) {
            setError("Please enter a valid 10-digit phone number");
            return;
        }

        setIsSending(true);
        setError("");
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSending(false);
        setStep("verify");
    };

    const handleVerify = async () => {
        if (verificationCode.length !== 6) {
            setError("Please enter the 6-digit code");
            return;
        }

        setIsVerifying(true);
        setError("");
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsVerifying(false);

        if (verificationCode === "123456") {
            onPhoneConnected(phoneNumber);
            onBack();
        } else {
            setError("Invalid verification code. Try 123456 for demo.");
        }
    };

    const handleResendCode = async () => {
        setIsSending(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSending(false);
    };

    return (
        <div className="size-full flex flex-col">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#091A7A]/10 via-[#ADC8FF]/20 to-transparent"/>

                <div className="relative p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <motion.button
                            whileTap={{scale: 0.95}}
                            onClick={onBack}
                            className="w-12 h-12 bg-card-glass backdrop-blur-lg rounded-full flex items-center justify-center shadow-card border border-white/20"
                        >
                            <ArrowLeft className="w-5 h-5 text-[#091A7A]"/>
                        </motion.button>
                        <h1 className="text-2xl font-bold text-[#091A7A]">
                            {step === "phone" ? "Connect Phone" : "Verify Phone"}
                        </h1>
                    </div>
                    <p className="text-sm text-[#091A7A]/70 px-2">
                        {step === "phone"
                            ? "Add your phone number for account recovery"
                            : "Enter the code we sent to your phone"}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide pb-8">
                <div className="px-6 space-y-6">
                    {step === "phone" ? (
                        <>
                            {/* Phone Icon */}
                            <motion.div
                                initial={{scale: 0.8, opacity: 0}}
                                animate={{scale: 1, opacity: 1}}
                                className="flex justify-center pt-8"
                            >
                                <div
                                    className="w-20 h-20 bg-gradient-to-br from-[#091A7A] to-[#4F8EFF] rounded-full flex items-center justify-center shadow-xl">
                                    <Smartphone className="w-10 h-10 text-white"/>
                                </div>
                            </motion.div>

                            {/* Phone Input */}
                            <div>
                                <label className="block text-sm font-medium text-[#091A7A]/70 mb-2 px-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Smartphone
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#091A7A]/40"/>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={handlePhoneChange}
                                        maxLength={12}
                                        className={`w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm rounded-2xl border shadow-card text-[#091A7A] text-lg placeholder:text-[#091A7A]/65 focus:outline-none focus:ring-2 transition-all ${
                                            error
                                                ? "border-red-300 focus:ring-red-200"
                                                : "border-white/60 focus:ring-[#091A7A]/20"
                                        }`}
                                        placeholder="555-123-4567"
                                    />
                                </div>
                                {error && (
                                    <div className="flex items-center gap-2 mt-2 px-2">
                                        <AlertCircle className="w-4 h-4 text-red-600"/>
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                                <p className="text-sm text-blue-900">
                                    We'll send you a verification code to confirm your number. Standard messaging rates
                                    may apply.
                                </p>
                            </div>

                            {/* Send Code Button */}
                            <motion.button
                                whileHover={{scale: 1.02}}
                                whileTap={{scale: 0.98}}
                                onClick={handleSendCode}
                                disabled={isSending || phoneNumber.replace(/-/g, "").length !== 10}
                                className="w-full py-4 bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] text-white font-semibold rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isSending ? (
                                    <span className="flex items-center justify-center gap-2">
                    <motion.div
                        animate={{rotate: 360}}
                        transition={{duration: 1, repeat: Infinity, ease: "linear"}}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Sending...
                  </span>
                                ) : (
                                    "Send Verification Code"
                                )}
                            </motion.button>
                        </>
                    ) : (
                        <>
                            {/* Success Icon */}
                            <motion.div
                                initial={{scale: 0.8, opacity: 0}}
                                animate={{scale: 1, opacity: 1}}
                                className="flex justify-center pt-8"
                            >
                                <div
                                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-xl">
                                    <Check className="w-10 h-10 text-green-600" strokeWidth={3}/>
                                </div>
                            </motion.div>

                            {/* Code sent message */}
                            <div className="text-center">
                                <p className="text-sm text-[#091A7A]/70">
                                    We sent a 6-digit code to
                                </p>
                                <p className="text-lg font-semibold text-[#091A7A] mt-1">
                                    {phoneNumber}
                                </p>
                            </div>

                            {/* Verification Code Input */}
                            <div>
                                <label className="block text-sm font-medium text-[#091A7A]/70 mb-2 px-2">
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "");
                                        setVerificationCode(value.slice(0, 6));
                                        setError("");
                                    }}
                                    maxLength={6}
                                    className={`w-full px-4 py-4 bg-white/80 backdrop-blur-sm rounded-2xl border shadow-card text-[#091A7A] text-2xl text-center tracking-widest placeholder:text-[#091A7A]/65 focus:outline-none focus:ring-2 transition-all ${
                                        error
                                            ? "border-red-300 focus:ring-red-200"
                                            : "border-white/60 focus:ring-[#091A7A]/20"
                                    }`}
                                    placeholder="000000"
                                />
                                {error && (
                                    <div className="flex items-center gap-2 mt-2 px-2 justify-center">
                                        <AlertCircle className="w-4 h-4 text-red-600"/>
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                )}
                            </div>

                            {/* Resend Code */}
                            <div className="text-center">
                                <p className="text-sm text-[#091A7A]/70 mb-2">
                                    Didn't receive a code?
                                </p>
                                <button
                                    onClick={handleResendCode}
                                    disabled={isSending}
                                    className="text-sm font-semibold text-[#091A7A] hover:underline disabled:opacity-50"
                                >
                                    {isSending ? "Sending..." : "Resend Code"}
                                </button>
                            </div>

                            {/* Verify Button */}
                            <motion.button
                                whileHover={{scale: 1.02}}
                                whileTap={{scale: 0.98}}
                                onClick={handleVerify}
                                disabled={isVerifying || verificationCode.length !== 6}
                                className="w-full py-4 bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] text-white font-semibold rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isVerifying ? (
                                    <span className="flex items-center justify-center gap-2">
                    <motion.div
                        animate={{rotate: 360}}
                        transition={{duration: 1, repeat: Infinity, ease: "linear"}}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Verifying...
                  </span>
                                ) : (
                                    "Verify Phone Number"
                                )}
                            </motion.button>

                            {/* Change Number */}
                            <button
                                onClick={() => {
                                    setStep("phone");
                                    setVerificationCode("");
                                    setError("");
                                }}
                                className="w-full py-3 text-[#091A7A]/70 font-medium hover:text-[#091A7A] transition-colors"
                            >
                                Change Phone Number
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
