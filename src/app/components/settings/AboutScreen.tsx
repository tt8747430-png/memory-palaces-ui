import {motion} from "motion/react";
import {ArrowLeft, Brain, ExternalLink, Heart} from "lucide-react";

interface AboutScreenProps {
    onBack: () => void;
}

export function AboutScreen({onBack}: AboutScreenProps) {
    const appInfo = [
        {label: "Version", value: "1.0.0"},
        {label: "Build", value: "2026.06.12"},
        {label: "License", value: "MIT"},
    ];

    const links = [
        {label: "Terms of Service", url: "https://mindscape.app/terms"},
        {label: "Privacy Policy", url: "https://mindscape.app/privacy"},
        {label: "Open Source Licenses", url: "https://mindscape.app/licenses"},
    ];

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
                        <h1 className="text-2xl font-bold text-[#091A7A]">About</h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide pb-8">
                <div className="px-6 space-y-8">
                    {/* App Logo & Name */}
                    <div className="flex flex-col items-center text-center">
                        <div
                            className="w-24 h-24 bg-gradient-to-br from-[#091A7A] to-[#4F8EFF] rounded-3xl flex items-center justify-center shadow-[0_16px_40px_rgba(9,26,122,0.25)] mb-4">
                            <Brain className="w-12 h-12 text-white" strokeWidth={1.75}/>
                        </div>
                        <h2 className="text-2xl font-bold text-[#091A7A] mb-2">
                            Mindscape
                        </h2>
                        <p className="text-sm text-[#091A7A]/70 max-w-xs">
                            Build memory palaces, train recall, and watch your memory measurably improve.
                        </p>
                    </div>

                    {/* App Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-[#091A7A]/70 mb-3 px-2">
                            App Information
                        </h3>
                        <div
                            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card overflow-hidden">
                            {appInfo.map((info, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between px-5 py-4 ${
                                        index !== appInfo.length - 1 ? "border-b border-[#E5E5EA]" : ""
                                    }`}
                                >
                  <span className="text-[15px] text-[#091A7A]/70">
                    {info.label}
                  </span>
                                    <span className="text-[15px] font-medium text-[#091A7A]">
                    {info.value}
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-[#091A7A]/70 mb-3 px-2">
                            Legal
                        </h3>
                        <div
                            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card overflow-hidden">
                            {links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => window.open(link.url, "_blank")}
                                    className={`w-full flex items-center justify-between px-5 py-4 hover:bg-[#F5F5F7] transition-colors ${
                                        index !== links.length - 1 ? "border-b border-[#E5E5EA]" : ""
                                    }`}
                                >
                  <span className="text-[15px] text-[#091A7A]">
                    {link.label}
                  </span>
                                    <ExternalLink className="w-4 h-4 text-[#091A7A]/40"/>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Credits */}
                    <div className="text-center">
                        <p className="text-sm text-[#091A7A]/70 mb-2">
                            Made with <Heart className="w-4 h-4 inline text-red-500 fill-current"/> by the Mindscape team
                        </p>
                        <p className="text-xs text-[#091A7A]/60">
                            © 2026 Mindscape. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
