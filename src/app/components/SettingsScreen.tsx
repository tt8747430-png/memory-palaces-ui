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
  DownloadCloud,
  UploadCloud,
  RefreshCw,
} from "lucide-react";
import { useState, useRef, type ChangeEvent } from "react";
import { ProgressUtils } from "../utils/progressUtils";
import { EditProfileScreen } from "./settings/EditProfileScreen";
import { PrivacySettingsScreen } from "./settings/PrivacySettingsScreen";
import { ChangePasswordScreen } from "./settings/ChangePasswordScreen";
import { ClearDataScreen } from "./settings/ClearDataScreen";
import { HelpCenterScreen } from "./settings/HelpCenterScreen";
import { AboutScreen } from "./settings/AboutScreen";
import { PhoneConnectScreen } from "./settings/PhoneConnectScreen";
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { Switch } from "./ui/switch";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Drawer } from "vaul";

interface SettingsScreenProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onBack?: () => void;
}



interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

interface SettingsItem {
  icon: any;
  label: string;
  value?: string;
  action?: "navigate" | "toggle" | "danger" | "function" | "select";
  color?: string;
  enabled?: boolean;
  navigationTarget?: string;
  options?: { value: string; label: string }[];
  selectedValue?: string;
  onSelect?: (val: string | null) => void;
  onClick?: () => void;
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

export function SettingsScreen({ open = true, onOpenChange, onBack }: SettingsScreenProps) {
  const [currentScreen, setCurrentScreen] = useState<NavigationScreen>("main");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("en");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await ProgressUtils.importProgress(file);
        toast.success("Progress imported successfully");
      } catch (error) {
        toast.error("Failed to import progress");
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRestoreBackup = () => {
    if (ProgressUtils.restoreFromBackup()) {
      toast.success("Progress restored from backup");
    } else {
      toast.warning("No backup found");
    }
  };

  // Scroll-based transformations for adaptive header
  const scrollRange = [0, 120];
  const headerOpacity = useTransform(scrollY, scrollRange, [1, 0]);
  const headerScale = useTransform(scrollY, scrollRange, [1, 0.9]);
  const headerY = useTransform(scrollY, scrollRange, [0, -40]);
  const headerMaxHeight = useTransform(scrollY, scrollRange, [500, 0]);
  const profileScale = useTransform(scrollY, scrollRange, [1, 0.7]);
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
          action: "select",
          selectedValue: language,
          onSelect: (val) => handleLanguageChange(val || "en"),
          options: [
            { value: "en", label: "English" },
            { value: "es", label: "Spanish" },
            { value: "fr", label: "French" },
            { value: "de", label: "German" },
            { value: "it", label: "Italian" },
            { value: "pt", label: "Portuguese" },
            { value: "ru", label: "Russian" },
            { value: "ja", label: "Japanese" },
            { value: "ko", label: "Korean" },
            { value: "zh", label: "Chinese" },
          ]
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
      title: "Data Management",
      items: [
        {
          icon: DownloadCloud,
          label: "Export Progress",
          action: "function",
          onClick: () => {
            ProgressUtils.exportProgress();
            toast.success("Progress exported successfully");
          },
        },
        {
          icon: UploadCloud,
          label: "Import Progress",
          action: "function",
          onClick: handleImportClick,
        },
        {
          icon: RefreshCw,
          label: "Restore Backup",
          action: "function",
          onClick: handleRestoreBackup,
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
    } else if (item.action === "function" && item.onClick) {
      item.onClick();
    }
  };

  const handleLogout = () => {
    setShowLogoutDialog(false);
    setTimeout(() => {
      if (onOpenChange) onOpenChange(false);
      if (onBack) onBack();
    }, 300);
  };

  const handleProfileSave = () => {
    toast.success("Profile updated successfully");
  };

  const handlePasswordChanged = () => {
    toast.success("Password changed successfully");
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    toast.success("Language updated");
  };

  const handlePhoneConnected = (phone: string) => {
    setPhoneNumber(phone);
    toast.success("Phone number connected");
  };

  const mainContent = (
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
              onClick={() => {
                if (onOpenChange) onOpenChange(false);
                if (onBack) onBack();
              }}
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
              onClick={() => {
                if (onOpenChange) onOpenChange(false);
                if (onBack) onBack();
              }}
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
              <Tooltip>
                <TooltipTrigger
                  render={
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentScreen("edit-profile")}
                      className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-br from-[#091A7A] to-[#4F8EFF] rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                    >
                      <User className="w-3 h-3 text-white" />
                    </motion.button>
                  }
                />
                <TooltipContent side="right">
                  <p>Edit Profile</p>
                </TooltipContent>
              </Tooltip>
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
                        <Switch
                          checked={item.enabled || false}
                          onCheckedChange={() => handleToggle(item.label)}
                        />
                      )}
                      {item.action === "select" && item.options && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <Select value={item.selectedValue} onValueChange={(val) => item.onSelect?.(val)}>
                            <SelectTrigger className="w-[120px] h-8 bg-transparent border-none shadow-none text-right focus:ring-0 text-[#091A7A]/70 text-[15px] font-medium p-0 pr-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent align="end">
                              {item.options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
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

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Log out</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to log out? You'll need to login again to use the app.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLogoutDialog(false)}
              className="flex-1 h-[40px] rounded-xl border-[1.5px] border-[#091A7A] flex items-center justify-center font-semibold text-[12px] text-[#091A7A]"
            >
              Cancel
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex-1 h-[40px] rounded-xl bg-[#091A7A] flex items-center justify-center font-semibold text-[12px] text-white"
            >
              Log out
            </motion.button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden File Input for Import */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".json"
        onChange={handleFileChange}
      />
    </div>
  );

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[100]" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0 z-[101] outline-none">
          <div className="p-4 bg-white rounded-t-[10px] flex-1 overflow-hidden">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-4" />
            <div className="h-full overflow-hidden rounded-xl relative">
              <AnimatePresence mode="wait">
                {currentScreen === "main" ? (
                  <motion.div
                    key="main"
                    initial={{ x: "-100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "-100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="size-full"
                  >
                    {mainContent}
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentScreen}
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="size-full absolute inset-0 z-50 bg-white"
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
                )}
              </AnimatePresence>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}