import { motion } from "motion/react";
import { ArrowLeft, Heart, Users, Award, ExternalLink } from "lucide-react";

interface AboutScreenProps {
  onBack: () => void;
}

export function AboutScreen({ onBack }: AboutScreenProps) {
  const appInfo = [
    { label: "Version", value: "1.0.0" },
    { label: "Build", value: "2024.01.15" },
    { label: "License", value: "MIT" },
  ];

  const links = [
    { label: "Terms of Service", url: "https://memorypalace.app/terms" },
    { label: "Privacy Policy", url: "https://memorypalace.app/privacy" },
    { label: "Open Source Licenses", url: "https://memorypalace.app/licenses" },
  ];

  const stats = [
    { icon: Users, label: "Active Users", value: "50K+" },
    { icon: Award, label: "Palaces Created", value: "100K+" },
    { icon: Heart, label: "User Rating", value: "4.9" },
  ];

  return (
    <div className="size-full flex flex-col bg-gradient-to-b from-[#ADC8FF]/20 to-white">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#091A7A]/10 via-[#ADC8FF]/20 to-transparent" />

        <div className="relative p-6">
          <div className="flex items-center gap-4 mb-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="w-12 h-12 bg-card-glass backdrop-blur-lg rounded-full flex items-center justify-center shadow-card border border-white/20"
            >
              <ArrowLeft className="w-5 h-5 text-[#091A7A]" />
            </motion.button>
            <h1 className="text-2xl font-bold text-[#091A7A]">About</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-8">
        <div className="px-6 space-y-8">
          {/* App Logo & Name */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-[#091A7A] to-[#4F8EFF] rounded-3xl flex items-center justify-center shadow-2xl mb-4">
              <span className="text-5xl">🏛️</span>
            </div>
            <h2 className="text-2xl font-bold text-[#091A7A] mb-2">
              Memory Palace
            </h2>
            <p className="text-sm text-[#091A7A]/60 max-w-xs">
              Master the art of memory through interactive learning experiences
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card p-4 text-center"
              >
                <div className="w-10 h-10 bg-[#ADC8FF]/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <stat.icon className="w-5 h-5 text-[#091A7A]" />
                </div>
                <p className="text-lg font-bold text-[#091A7A] mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-[#091A7A]/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* App Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-[#091A7A]/70 mb-3 px-2">
              App Information
            </h3>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card overflow-hidden">
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
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm font-semibold text-[#091A7A]/70 mb-3 px-2">
              Legal
            </h3>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card overflow-hidden">
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
                  <ExternalLink className="w-4 h-4 text-[#091A7A]/40" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Credits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="text-sm text-[#091A7A]/60 mb-2">
              Made with <Heart className="w-4 h-4 inline text-red-500 fill-current" /> by the Memory Palace Team
            </p>
            <p className="text-xs text-[#091A7A]/40">
              © 2024 Memory Palace. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
