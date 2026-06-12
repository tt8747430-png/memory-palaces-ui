import {motion} from "motion/react";
import {ArrowLeft, Bell, Eye, Lock, MapPin, Shield, Users} from "lucide-react";
import {type ComponentType} from "react";
import {Switch} from "../ui/switch";
import {type PrivacySettings, usePreferences} from "../../hooks/usePreferences";

interface PrivacySettingsScreenProps {
    onBack: () => void;
}

interface PrivacyRow {
    key: keyof PrivacySettings;
    label: string;
    description: string;
    icon: ComponentType<{className?: string}>;
}

const PRIVACY_ROWS: PrivacyRow[] = [
    {
        key: "profileVisibility",
        label: "Profile Visibility",
        description: "Make your profile visible to other users",
        icon: Eye,
    },
    {
        key: "activitySharing",
        label: "Activity Sharing",
        description: "Share your learning progress with friends",
        icon: Users,
    },
    {
        key: "locationAccess",
        label: "Location Access",
        description: "Allow location-based features",
        icon: MapPin,
    },
    {
        key: "notificationTracking",
        label: "Notification Tracking",
        description: "Track notification engagement for analytics",
        icon: Bell,
    },
    {
        key: "dataEncryption",
        label: "Data Encryption",
        description: "Encrypt your personal data (recommended)",
        icon: Lock,
    },
];

export function PrivacySettingsScreen({onBack}: PrivacySettingsScreenProps) {
    const {preferences, setPreference} = usePreferences();
    const privacy = preferences.privacy;

    const toggleSetting = (key: keyof PrivacySettings) => {
        setPreference("privacy", {...privacy, [key]: !privacy[key]});
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
                    {PRIVACY_ROWS.map((row) => (
                        <div
                            key={row.key}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card p-5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div
                                        className="w-11 h-11 bg-[#ADC8FF]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <row.icon className="w-5 h-5 text-[#091A7A]"/>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-[#091A7A] mb-1">
                                            {row.label}
                                        </h3>
                                        <p className="text-sm text-[#091A7A]/70 leading-relaxed">
                                            {row.description}
                                        </p>
                                    </div>
                                </div>

                                <Switch
                                    checked={privacy[row.key]}
                                    onCheckedChange={() => toggleSetting(row.key)}
                                    aria-label={row.label}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
