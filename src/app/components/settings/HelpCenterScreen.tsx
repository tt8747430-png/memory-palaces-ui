import { motion } from "motion/react";
import { ArrowLeft, MessageCircle, Mail, BookOpen, ChevronRight, ExternalLink } from "lucide-react";

interface HelpCenterScreenProps {
  onBack: () => void;
}

const helpCategories = [
  {
    title: "Getting Started",
    items: [
      "How to create your first memory palace",
      "Understanding the memory technique",
      "Navigating the app interface",
      "Setting up your profile",
    ],
  },
  {
    title: "Learning & Progress",
    items: [
      "How XP and levels work",
      "Building training streaks",
      "Completing rooms and palaces",
      "Taking quizzes effectively",
    ],
  },
  {
    title: "Account & Settings",
    items: [
      "Managing your account",
      "Privacy and data settings",
      "Notification preferences",
      "Changing your password",
    ],
  },
  {
    title: "Troubleshooting",
    items: [
      "App not loading properly",
      "Progress not saving",
      "Audio or video issues",
      "Login problems",
    ],
  },
];

const contactOptions = [
  {
    icon: MessageCircle,
    label: "Live Chat",
    description: "Chat with our support team",
    action: "Start Chat",
    available: true,
  },
  {
    icon: Mail,
    label: "Email Support",
    description: "support@memorypalace.app",
    action: "Send Email",
    available: true,
  },
  {
    icon: BookOpen,
    label: "Documentation",
    description: "Browse our knowledge base",
    action: "View Docs",
    available: true,
  },
];

export function HelpCenterScreen({ onBack }: HelpCenterScreenProps) {
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
            <h1 className="text-2xl font-bold text-[#091A7A]">Help Center</h1>
          </div>
          <p className="text-sm text-[#091A7A]/60 px-2">
            Find answers and get support
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-8">
        <div className="px-6 space-y-8">
          {/* Contact Options */}
          <div>
            <h3 className="text-sm font-semibold text-[#091A7A]/70 mb-3 px-2">
              Contact Support
            </h3>
            <div className="space-y-3">
              {contactOptions.map((option, index) => (
                <motion.button
                  key={option.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-full flex items-center justify-between p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card hover:bg-[#F5F5F7] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#091A7A] to-[#4F8EFF] rounded-xl flex items-center justify-center">
                      <option.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-[#091A7A] mb-0.5">
                        {option.label}
                      </p>
                      <p className="text-sm text-[#091A7A]/60">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-[#091A7A]/40" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* FAQ Categories */}
          <div>
            <h3 className="text-sm font-semibold text-[#091A7A]/70 mb-3 px-2">
              Frequently Asked Questions
            </h3>
            <div className="space-y-6">
              {helpCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + categoryIndex * 0.1 }}
                >
                  <h4 className="font-semibold text-[#091A7A] mb-3 px-2">
                    {category.title}
                  </h4>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card overflow-hidden">
                    {category.items.map((item, itemIndex) => (
                      <button
                        key={itemIndex}
                        className={`w-full flex items-center justify-between px-5 py-4 hover:bg-[#F5F5F7] transition-colors ${
                          itemIndex !== category.items.length - 1
                            ? "border-b border-[#E5E5EA]"
                            : ""
                        }`}
                      >
                        <span className="text-[15px] text-[#091A7A] text-left">
                          {item}
                        </span>
                        <ChevronRight className="w-5 h-5 text-[#C7C7CC] flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
