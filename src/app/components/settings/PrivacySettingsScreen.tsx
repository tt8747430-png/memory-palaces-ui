import {motion} from "motion/react";
import {ArrowLeft, Bell, Eye, Lock, MapPin, Shield, Users} from "lucide-react";
import {useState} from "react";
import {Switch} from "../ui/switch";

interface PrivacySettingsScreenProps {
    onBack: () => void;
}

interface PrivacySetting {
    id: string;
    label: string;
    description: string;
    icon: any;
    enabled: boolean;
}

export function PrivacySettingsScreen({onBack}: PrivacySettingsScreenProps) {
    const [settings, setSettings] = useState<PrivacySetting[]>([
        {
            id: "profile-visibility",
            label: "Profile Visibility",
            description: "Make your profile visible to other users",
            icon: Eye,
            enabled: true,
        },
        {
            id: "activity-sharing",
            label: "Activity Sharing",
            description: "Share your learning progress with friends",
            icon: Users,
            enabled: false,
        },
        {
            id: "location-access",
            label: "Location Access",
            description: "Allow location-based features",
            icon: MapPin,
            enabled: false,
        },
        {
            id: "notification-tracking",
            label: "Notification Tracking",
            description: "Track notification engagement for analytics",
            icon: Bell,
            enabled: true,
        },
        {
            id: "data-encryption",
            label: "Data Encryption",
            description: "Encrypt your personal data (recommended)",
            icon: Lock,
            enabled: true,
        },
    ]);

    const toggleSetting = (id: string) => {
        setSettings(prev =>
            prev.map(setting =>
                setting.id === id ? {...setting, enabled: !setting.enabled} : setting
            )
        );
    };

    return (
        <div className="size-full flex flex-col bg-gradient-to-b from-[#ADC8FF]/20 to-white">
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
                        <h1 className="text-2xl font-bold text-[#091A7A]">Privacy Settings</h1>
                    </div>
                    <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl p-4">
                        <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"/>
                        <div>
                            <p className="text-sm font-medium text-blue-900">Your Privacy Matters</p>
                            <p className="text-xs text-blue-700 mt-1">
                                Control how your data is used and shared. You can change these settings anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide pb-8">
                <div className="px-6 space-y-3">
                    {settings.map((setting, index) => (
                        <motion.div
                            key={setting.id}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: index * 0.05}}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card p-5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div
                                        className="w-11 h-11 bg-[#ADC8FF]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <setting.icon className="w-5 h-5 text-[#091A7A]"/>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-[#091A7A] mb-1">
                                            {setting.label}
                                        </h3>
                                        <p className="text-sm text-[#091A7A]/60 leading-relaxed">
                                            {setting.description}
                                        </p>
                                    </div>
                                </div>

                                <Switch
                                    checked={setting.enabled}
                                    onCheckedChange={() => toggleSetting(setting.id)}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
