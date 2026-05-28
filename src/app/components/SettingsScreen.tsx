import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Globe,
  Lock,
  Trash2,
  Info,
  Mail,
  Smartphone,
} from "lucide-react";
import { useState, useRef } from "react";
import { EditProfileScreen } from "./settings/EditProfileScreen";
import { LanguageScreen } from "./settings/LanguageScreen";
import { PrivacySettingsScreen } from "./settings/PrivacySettingsScreen";
import { ChangePasswordScreen } from "./settings/ChangePasswordScreen";
import { ClearDataScreen } from "./settings/ClearDataScreen";
import { HelpCenterScreen } from "./settings/HelpCenterScreen";
import { AboutScreen } from "./settings/AboutScreen";
import { PhoneConnectScreen } from "./settings/PhoneConnectScreen";
import { SettingsToast } from "./settings/SettingsToast";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { Toggle } from "./ui/Toggle";

interface SettingsScreenProps {
  onBack: () => void;
}

interface Toast {
  show: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

interface SettingsItem {
  icon: any;
  label: string;
  value?: string;
  action?: "navigate" | "toggle" | "danger";
  color?: string;
  enabled?: boolean;
  navigationTarget?: string;
}

type NavigationScreen =
  | "main"
  | "edit-profile"
  | "phone"
  | "language"
  | "privacy"
  | "change-password"
  | "clear-data"
  | "help"
  | "about";

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [currentScreen, setCurrentScreen] = useState<NavigationScreen>("main");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("en");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [toast, setToast] = useState<Toast>({
    show: false,
    message: "",
    type: "success",
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });

  // Scroll-based transformations for adaptive header
  const headerOpacity = useTransform(scrollY, [0, 120], [1, 0]);
  const headerScale = useTransform(scrollY, [0, 120], [1, 0.9]);
  const headerY = useTransform(scrollY, [0, 120], [0, -40]);
  const headerMaxHeight = useTransform(scrollY, [0, 120], [500, 0]);
  const profileScale = useTransform(scrollY, [0, 120], [1, 0.7]);
  const compactHeaderOpacity = useTransform(scrollY, [80, 120], [0, 1]);
  const gradientOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const headerPointerEvents = useTransform(headerOpacity, (value) =>
    value > 0.5 ? "auto" : "none"
  );

  const sections: SettingsSection[] = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Edit Profile",
          action: "navigate",
          navigationTarget: "edit-profile",
        },
        {
          icon: Mail,
          label: "Email",
          value: "memory@master.com",
        },
        {
          icon: Smartphone,
          label: "Phone",
          value: phoneNumber || "Not connected",
          action: "navigate",
          navigationTarget: "phone",
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          enabled: notifications,
          action: "toggle",
        },
        {
          icon: Moon,
          label: "Dark Mode",
          enabled: darkMode,
          action: "toggle",
        },
        {
          icon: Globe,
          label: "Language",
          value: getLanguageName(language),
          action: "navigate",
          navigationTarget: "language",
        },
      ],
    },
    {
      title: "Privacy & Security",
      items: [
        {
          icon: Shield,
          label: "Privacy Settings",
          action: "navigate",
          navigationTarget: "privacy",
        },
        {
          icon: Lock,
          label: "Change Password",
          action: "navigate",
          navigationTarget: "change-password",
        },
        {
          icon: Trash2,
          label: "Clear Data",
          action: "navigate",
          navigationTarget: "clear-data",
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help Center",
          action: "navigate",
          navigationTarget: "help",
        },
        {
          icon: Info,
          label: "About",
          value: "v1.0.0",
          action: "navigate",
          navigationTarget: "about",
        },
      ],
    },
    {
      title: "",
      items: [
        {
          icon: LogOut,
          label: "Log Out",
          action: "danger",
          color: "#EF4444",
        },
      ],
    },
  ];

  function getLanguageName(code: string): string {
    const languages: Record<string, string> = {
      en: "English",
      es: "Español",
      fr: "Français",
      de: "Deutsch",
      it: "Italiano",
      pt: "Português",
      ru: "Русский",
      ja: "日本語",
      ko: "한국어",
      zh: "中文",
      ar: "العربية",
      hi: "हिन्दी",
    };
    return languages[code] || "English";
  }

  const handleToggle = (label: string) => {
    if (label === "Dark Mode") {
      setDarkMode(!darkMode);
    } else if (label === "Notifications") {
      setNotifications(!notifications);
    }
  };

  const handleItemClick = (item: SettingsItem) => {
    if (item.action === "toggle") {
      handleToggle(item.label);
    } else if (item.action === "navigate" && item.navigationTarget) {
      setCurrentScreen(item.navigationTarget as NavigationScreen);
    } else if (item.action === "danger") {
      setShowLogoutDialog(true);
    }
  };

  const handleLogout = () => {
    setShowLogoutDialog(false);
    setTimeout(() => {
      onBack();
    }, 300);
  };

  const showToast = (message: string, type: Toast["type"] = "success") => {
    setToast({ show: true, message, type });
  };

  const handleProfileSave = (data: any) => {
    console.log("Profile saved:", data);
    showToast("Profile updated successfully");
  };

  const handlePasswordChanged = () => {
    console.log("Password changed successfully");
    showToast("Password changed successfully");
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    console.log("Language changed to:", newLanguage);
    showToast("Language updated");
  };

  const handlePhoneConnected = (phone: string) => {
    setPhoneNumber(phone);
    console.log("Phone connected:", phone);
    showToast("Phone number connected");
  };

  if (currentScreen !== "main") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="size-full"
        >
          {currentScreen === "edit-profile" && (
            <EditProfileScreen
              onBack={() => setCurrentScreen("main")}
              onSave={handleProfileSave}
            />
          )}
          {currentScreen === "phone" && (
            <PhoneConnectScreen
              onBack={() => setCurrentScreen("main")}
              onPhoneConnected={handlePhoneConnected}
            />
          )}
          {currentScreen === "language" && (
            <LanguageScreen
              onBack={() => setCurrentScreen("main")}
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          )}
          {currentScreen === "privacy" && (
            <PrivacySettingsScreen onBack={() => setCurrentScreen("main")} />
          )}
          {currentScreen === "change-password" && (
            <ChangePasswordScreen
              onBack={() => setCurrentScreen("main")}
              onPasswordChanged={handlePasswordChanged}
            />
          )}
          {currentScreen === "clear-data" && (
            <ClearDataScreen onBack={() => setCurrentScreen("main")} />
          )}
          {currentScreen === "help" && (
            <HelpCenterScreen onBack={() => setCurrentScreen("main")} />
          )}
          {currentScreen === "about" && (
            <AboutScreen onBack={() => setCurrentScreen("main")} />
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="size-full flex flex-col bg-gradient-to-b from-[#ADC8FF]/20 to-white">
      {/* Compact Header (visible on scroll) */}
      <motion.div
        style={{ opacity: compactHeaderOpacity }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-xl border-b border-[#E5E5EA] shadow-sm"
      >
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="w-10 h-10 bg-[#F5F5F7] rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 text-[#091A7A]" />
            </motion.button>
            <h2 className="text-base font-bold text-[#091A7A]">Settings</h2>
          </div>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        style={{ maxHeight: headerMaxHeight }}
        className="relative overflow-hidden flex-shrink-0 transition-all"
      >
        <motion.div
          style={{ opacity: gradientOpacity }}
          className="absolute inset-0 bg-gradient-to-br from-[#091A7A]/10 via-[#ADC8FF]/20 to-transparent pointer-events-none"
        />

        <motion.div
          style={{
            opacity: headerOpacity,
            scale: headerScale,
            y: headerY,
            pointerEvents: headerPointerEvents
          }}
          className="relative p-6 pb-0 will-change-transform"
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="w-12 h-12 bg-card-glass backdrop-blur-lg rounded-full flex items-center justify-center shadow-card border border-white/20"
            >
              <ArrowLeft className="w-5 h-5 text-[#091A7A]" />
            </motion.button>
            <h1 className="text-2xl font-bold text-[#091A7A]">
              Settings
            </h1>
          </div>

          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ scale: profileScale }}
            className="flex flex-col items-center gap-4 py-6"
          >
            {/* Avatar with Edit Button */}
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-white shadow-xl object-cover"
                style={{ objectPosition: "center 20%" }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentScreen("edit-profile")}
                className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-br from-[#091A7A] to-[#4F8EFF] rounded-full flex items-center justify-center shadow-lg border-2 border-white"
              >
                <User className="w-3 h-3 text-white" />
              </motion.button>
            </div>

            {/* Name and Username */}
            <div className="flex flex-col items-center gap-1">
              <h2 className="text-lg font-bold text-[#091A7A]">Memory Master</h2>
              <p className="text-sm text-[#091A7A]/60">@memorymaster</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide pb-8">
        <div className="px-6 space-y-2">
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: sectionIndex * 0.05,
                duration: 0.3,
              }}
            >
              {section.title && (
                <h3 className="text-xs font-semibold text-[#091A7A]/50 mb-2 px-4 pt-4 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm overflow-hidden">
                {section.items.map((item, itemIndex) => (
                  <motion.button
                    key={item.label}
                    onClick={() => handleItemClick(item)}
                    whileHover={{ backgroundColor: "rgba(173, 200, 255, 0.05)" }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 transition-colors ${
                      itemIndex !== section.items.length - 1
                        ? "border-b border-[#E5E5EA]/50"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          item.color
                            ? "bg-red-50"
                            : "bg-[#ADC8FF]/15"
                        }`}
                      >
                        <item.icon
                          size={16}
                          className={
                            item.color
                              ? "text-red-500"
                              : "text-[#091A7A]"
                          }
                          strokeWidth={2.5}
                        />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p
                          className={`text-[15px] font-medium truncate ${
                            item.color
                              ? "text-red-500"
                              : "text-[#091A7A]"
                          }`}
                        >
                          {item.label}
                        </p>
                        {item.value && (
                          <p className="text-[13px] text-[#091A7A]/50 truncate">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {item.action === "toggle" && (
                        <Toggle
                          checked={item.enabled || false}
                          onChange={() => handleToggle(item.label)}
                          size="sm"
                        />
                      )}
                      {item.action === "navigate" && (
                        <ChevronRight
                          size={18}
                          className="text-[#C7C7CC]"
                        />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}

          {/* App Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center pt-8 pb-2"
          >
            <p className="text-xs text-[#091A7A]/40">
              Memory Palace App
            </p>
            <p className="text-xs text-[#091A7A]/40 mt-1">
              Version 1.0.0
            </p>
          </motion.div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AnimatePresence>
        {showLogoutDialog && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1f2024]/85 z-50"
              onClick={() => setShowLogoutDialog(false)}
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-4 w-[300px] shadow-2xl pointer-events-auto"
              >
                {/* Content */}
                <div className="flex flex-col gap-2 items-center text-center p-2 mb-5">
                  <h2 className="font-extrabold text-[16px] text-[#1f2024] tracking-[0.08px]">
                    Log out
                  </h2>
                  <p className="font-normal text-[12px] text-[#71727a] leading-[16px] tracking-[0.12px]">
                    Are you sure you want to log out? You'll need to login again to use the app.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLogoutDialog(false)}
                    className="flex-1 h-[40px] rounded-xl border-[1.5px] border-[#091A7A] flex items-center justify-center"
                  >
                    <span className="font-semibold text-[12px] text-[#091A7A]">
                      Cancel
                    </span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex-1 h-[40px] rounded-xl bg-[#091A7A] flex items-center justify-center"
                  >
                    <span className="font-semibold text-[12px] text-white">
                      Log out
                    </span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <SettingsToast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}