import {AnimatePresence, motion, useScroll, useTransform} from "motion/react";
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  DownloadCloud,
  Globe,
  HelpCircle,
  Info,
  Lock,
  LogOut,
  Mail,
  Moon,
  RefreshCw,
  Shield,
  Smartphone,
  Trash2,
  UploadCloud,
  User,
} from "lucide-react";
import {type ChangeEvent, useEffect, useRef, useState} from "react";
import {Skeleton} from "./ui/Skeleton";
import {ProgressUtils} from "../utils/progressUtils";
import {EditProfileScreen} from "./settings/EditProfileScreen";
import {PrivacySettingsScreen} from "./settings/PrivacySettingsScreen";
import {ChangePasswordScreen} from "./settings/ChangePasswordScreen";
import {ClearDataScreen} from "./settings/ClearDataScreen";
import {HelpCenterScreen} from "./settings/HelpCenterScreen";
import {AboutScreen} from "./settings/AboutScreen";
import {PhoneConnectScreen} from "./settings/PhoneConnectScreen";
import {ImageWithFallback} from "./ui/ImageWithFallback";
import {Switch} from "./ui/switch";
import {toast} from "sonner";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,} from "./ui/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "./ui/select";
import {Tooltip, TooltipContent, TooltipTrigger} from "./ui/tooltip";

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

// Session-scoped so the first-open skeleton plays once, not on every reopen.
let settingsHydrated = false;

export function SettingsScreen({
                                   open = true,
                                   onOpenChange,
                                   onBack,
                               }: SettingsScreenProps) {
    const [currentScreen, setCurrentScreen] = useState<NavigationScreen>("main");
    const [loading, setLoading] = useState(!settingsHydrated);

    useEffect(() => {
        if (settingsHydrated) return;
        const timer = setTimeout(() => {
            settingsHydrated = true;
            setLoading(false);
        }, 550);
        return () => clearTimeout(timer);
    }, []);
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [language, setLanguage] = useState("en");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {scrollY} = useScroll({container: scrollRef});

    // Modern Parallax & Overscroll (Pull-to-refresh style)
    const headerOpacity = useTransform(scrollY, [0, 80], [1, 0]);
    const headerScale = useTransform(scrollY, [0, 80], [1, 0.95]);
    const headerY = useTransform(scrollY, [0, 80], [0, 20]);

    // Magic: Negative scrollY (overscroll on iOS/Mac) scales up the profile image
    const profileScale = useTransform(scrollY, [-150, 0, 80], [1.2, 1, 0.9]);
    const profileY = useTransform(scrollY, [-150, 0], [20, 0]);

    const compactHeaderOpacity = useTransform(scrollY, [40, 80], [0, 1]);
    const gradientOpacity = useTransform(scrollY, [0, 100], [1, 0]);
    const headerPointerEvents = useTransform(headerOpacity, (v) =>
        v > 0.5 ? "auto" : "none"
    );

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
                        {value: "en", label: "English"},
                        {value: "es", label: "Spanish"},
                        {value: "fr", label: "French"},
                        {value: "de", label: "German"},
                        {value: "it", label: "Italian"},
                        {value: "pt", label: "Portuguese"},
                        {value: "ru", label: "Russian"},
                        {value: "ja", label: "Japanese"},
                        {value: "ko", label: "Korean"},
                        {value: "zh", label: "Chinese"},
                    ],
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
        localStorage.removeItem("isAuthenticated");
        setTimeout(() => {
            if (onOpenChange) onOpenChange(false);
            if (onBack) onBack();
            window.location.reload();
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
        <div
            ref={scrollRef}
            className="size-full overflow-y-auto scrollbar-hide relative bg-[#FAFAFC] pb-[100px]"
        >
            {/* Sticky Compact Header */}
            <motion.div
                style={{opacity: compactHeaderOpacity}}
                className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-black/[0.05] shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
            >
                <div className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileTap={{scale: 0.9}}
                            onClick={() => {
                                if (onOpenChange) onOpenChange(false);
                                if (onBack) onBack();
                            }}
                            className="w-9 h-9 bg-gray-100/80 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4"/>
                        </motion.button>
                        <h2 className="text-[15px] font-semibold text-gray-900 leading-tight">
                            Settings
                        </h2>
                    </div>
                </div>
            </motion.div>

            {/* Decorative Background Mesh/Gradient */}
            <motion.div
                style={{opacity: gradientOpacity}}
                className="absolute inset-x-0 top-0 h-[300px] bg-gradient-to-b from-[#ADC8FF]/30 via-[#E2EBFF]/10 to-transparent pointer-events-none"
            />

            {/* Large Header */}
            <motion.div
                style={{
                    opacity: headerOpacity,
                    scale: headerScale,
                    y: headerY,
                    pointerEvents: headerPointerEvents,
                }}
                className="relative px-6 pt-12 pb-6 will-change-transform flex flex-col items-center"
            >
                <div className="w-full flex items-center justify-start mb-6">
                    <motion.button
                        whileTap={{scale: 0.9}}
                        onClick={() => {
                            if (onOpenChange) onOpenChange(false);
                            if (onBack) onBack();
                        }}
                        className="w-11 h-11 bg-white/60 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-sm border border-white/80 text-gray-700 hover:bg-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5"/>
                    </motion.button>
                </div>

                {/* Profile Section */}
                <motion.div
                    style={{scale: profileScale, y: profileY}}
                    className="flex flex-col items-center gap-3 relative origin-bottom"
                >
                    {/* Avatar with Edit Button */}
                    <div className="relative">
                        <div
                            className="absolute inset-0 bg-gradient-to-tr from-[#091A7A] to-[#4F8EFF] rounded-[2rem] blur-xl opacity-20 transform scale-90 translate-y-2"/>
                        <ImageWithFallback
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
                            alt="Profile"
                            className="relative w-[88px] h-[88px] rounded-[2rem] border-[3px] border-white shadow-xl object-cover bg-white"
                            style={{objectPosition: "center 20%"}}
                        />
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <motion.button
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                        onClick={() => setCurrentScreen("edit-profile")}
                                        className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center shadow-lg border-2 border-white"
                                    >
                                        <User className="w-4 h-4 text-white"/>
                                    </motion.button>
                                }
                            />
                            <TooltipContent side="right">
                                <p>Edit Profile</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="flex flex-col items-center gap-0.5 mt-2">
                        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">
                            Memory Master
                        </h1>
                        <p className="text-[14px] text-gray-500 font-medium">
                            @memorymaster
                        </p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Content Area */}
            <div className="px-6 relative z-10 space-y-6">
                {loading &&
                    Array.from({length: 4}).map((_, s) => (
                        <div key={`settings-skeleton-${s}`}>
                            <Skeleton className="mb-2 ml-1 h-3 w-24 bg-black/5"/>
                            <div
                                className="rounded-[24px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                                {Array.from({length: 3}).map((_, r) => (
                                    <div
                                        key={r}
                                        className="flex items-center gap-3.5 px-4 py-3.5"
                                    >
                                        <Skeleton className="h-9 w-9 rounded-[12px] bg-black/5"/>
                                        <Skeleton className="h-4 w-40 max-w-[60%] bg-black/5"/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                {!loading && sections.map((section, sectionIndex) => (
                    <motion.div
                        key={sectionIndex}
                        initial={{opacity: 0, y: 15}}
                        animate={{opacity: 1, y: 0}}
                        transition={{
                            delay: sectionIndex * 0.05,
                            type: "spring",
                            bounce: 0,
                        }}
                    >
                        {section.title && (
                            <h3 className="text-[13px] font-bold text-gray-400 mb-2 px-1 uppercase tracking-wider">
                                {section.title}
                            </h3>
                        )}

                        <div
                            className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
                            {section.items.map((item, itemIndex) => (
                                <motion.button
                                    key={item.label}
                                    onClick={() => handleItemClick(item)}
                                    whileHover={{backgroundColor: "rgba(0, 0, 0, 0.02)"}}
                                    whileTap={{scale: 0.98}}
                                    className={`w-full flex items-center justify-between px-4 py-3.5 transition-colors relative ${
                                        itemIndex !== section.items.length - 1
                                            ? "after:content-[''] after:absolute after:bottom-0 after:left-14 after:right-0 after:h-[1px] after:bg-gray-100"
                                            : ""
                                    }`}
                                >
                                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                                        <div
                                            className={`w-9 h-9 rounded-[12px] flex items-center justify-center flex-shrink-0 ${
                                                item.color ? "bg-red-50" : "bg-gray-50"
                                            }`}
                                        >
                                            <item.icon
                                                className={`w-5 h-5 ${
                                                    item.color ? "text-red-500" : "text-gray-700"
                                                }`}
                                                strokeWidth={2.2}
                                            />
                                        </div>
                                        <div className="text-left flex-1 min-w-0">
                                            <p
                                                className={`text-[15px] font-semibold truncate ${
                                                    item.color ? "text-red-500" : "text-gray-900"
                                                }`}
                                            >
                                                {item.label}
                                            </p>
                                            {item.value && (
                                                <p className="text-[13px] font-medium text-gray-500 truncate leading-tight mt-0.5">
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
                                                <Select
                                                    value={item.selectedValue}
                                                    onValueChange={(val) => item.onSelect?.(val)}
                                                >
                                                    <SelectTrigger
                                                        className="w-auto min-w-[100px] h-8 bg-transparent border-none shadow-none text-right focus:ring-0 text-gray-500 hover:text-gray-900 text-[15px] font-medium p-0 pr-1 transition-colors">
                                                        <SelectValue/>
                                                    </SelectTrigger>
                                                    <SelectContent
                                                        align="end"
                                                        className="rounded-xl border border-gray-100 shadow-xl"
                                                    >
                                                        {item.options.map((opt) => (
                                                            <SelectItem
                                                                key={opt.value}
                                                                value={opt.value}
                                                                className="font-medium rounded-lg text-[14px]"
                                                            >
                                                                {opt.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                        {item.action === "navigate" && (
                                            <ChevronRight className="w-5 h-5 text-gray-300"/>
                                        )}
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                ))}

                {/* App Info */}
                {!loading && (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.5}}
                    className="text-center pt-6 pb-4"
                >
                    <div
                        className="w-12 h-12 mx-auto bg-gradient-to-br from-[#091A7A] to-[#4F8EFF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#091A7A]/20 mb-3">
                        <Shield className="w-6 h-6 text-white"/>
                    </div>
                    <p className="text-[13px] font-bold text-gray-400">
                        Memory Palace App
                    </p>
                    <p className="text-[11px] font-medium text-gray-400 mt-1">
                        Version 1.0.0
                    </p>
                </motion.div>
                )}
            </div>

            <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-center">Log out</DialogTitle>
                        <DialogDescription className="text-center">
                            Are you sure you want to log out? You'll need to login again to
                            use the app.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:justify-center">
                        <motion.button
                            whileTap={{scale: 0.95}}
                            onClick={() => setShowLogoutDialog(false)}
                            className="flex-1 h-[40px] rounded-xl border-[1.5px] border-[#091A7A] flex items-center justify-center font-semibold text-[12px] text-[#091A7A]"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileTap={{scale: 0.95}}
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
                style={{display: "none"}}
                accept=".json"
                onChange={handleFileChange}
            />
        </div>
    );

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{x: "100%"}}
                    animate={{x: 0}}
                    exit={{x: "100%"}}
                    transition={{type: "spring", bounce: 0, duration: 0.4}}
                    className="fixed inset-0 z-[100] bg-white flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.08)]"
                >
                    <div className="h-full overflow-hidden relative">
                        <AnimatePresence initial={false} mode="wait">
                            {currentScreen === "main" ? (
                                <motion.div
                                    key="main"
                                    initial={{x: "-10%", opacity: 0}}
                                    animate={{x: 0, opacity: 1}}
                                    exit={{x: "-10%", opacity: 0}}
                                    transition={{type: "spring", bounce: 0, duration: 0.3}}
                                    className="size-full absolute inset-0"
                                >
                                    {mainContent}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={currentScreen}
                                    initial={{x: "100%", opacity: 1}}
                                    animate={{x: 0, opacity: 1}}
                                    exit={{x: "100%", opacity: 1}}
                                    transition={{type: "spring", bounce: 0, duration: 0.4}}
                                    className="size-full absolute inset-0 z-50 bg-white shadow-[-20px_0_40px_rgba(0,0,0,0.08)]"
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
                                        <PrivacySettingsScreen
                                            onBack={() => setCurrentScreen("main")}
                                        />
                                    )}
                                    {currentScreen === "change-password" && (
                                        <ChangePasswordScreen
                                            onBack={() => setCurrentScreen("main")}
                                            onPasswordChanged={handlePasswordChanged}
                                        />
                                    )}
                                    {currentScreen === "clear-data" && (
                                        <ClearDataScreen onBack={() => setCurrentScreen("main")}/>
                                    )}
                                    {currentScreen === "help" && (
                                        <HelpCenterScreen onBack={() => setCurrentScreen("main")}/>
                                    )}
                                    {currentScreen === "about" && (
                                        <AboutScreen onBack={() => setCurrentScreen("main")}/>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}