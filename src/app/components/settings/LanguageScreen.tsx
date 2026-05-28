import { motion } from "motion/react";
import { ArrowLeft, Check, Globe } from "lucide-react";
import { useState } from "react";

interface LanguageScreenProps {
  onBack: () => void;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
];

export function LanguageScreen({ onBack, currentLanguage, onLanguageChange }: LanguageScreenProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
    onLanguageChange(code);
    setTimeout(onBack, 300);
  };

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
            <h1 className="text-2xl font-bold text-[#091A7A]">Language</h1>
          </div>
          <p className="text-sm text-[#091A7A]/60 px-2">
            Choose your preferred language
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-8">
        <div className="px-6 space-y-3">
          {languages.map((language, index) => {
            const isSelected = selectedLanguage === language.code;

            return (
              <motion.button
                key={language.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleLanguageSelect(language.code)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-[#091A7A]/10 to-[#4F8EFF]/10 border-[#091A7A]/30 shadow-lg"
                    : "bg-white/80 border-white/60 shadow-card hover:bg-[#F5F5F7]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isSelected ? "bg-[#091A7A]" : "bg-[#ADC8FF]/20"
                  }`}>
                    <Globe className={`w-5 h-5 ${isSelected ? "text-white" : "text-[#091A7A]"}`} />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${isSelected ? "text-[#091A7A]" : "text-[#091A7A]/80"}`}>
                      {language.name}
                    </p>
                    <p className="text-sm text-[#091A7A]/60">
                      {language.nativeName}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-[#091A7A] rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
