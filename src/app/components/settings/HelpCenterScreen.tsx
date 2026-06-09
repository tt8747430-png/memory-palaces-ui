import {motion} from "motion/react";
import {ArrowLeft, BookOpen, ExternalLink, Mail, MessageCircle} from "lucide-react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "../ui/accordion";

interface HelpCenterScreenProps {
    onBack: () => void;
}

const helpCategories = [
    {
        title: "Getting Started",
        items: [
            {
                q: "How to create your first memory palace",
                a: "Navigate to the Home tab and click the '+' button in the top right corner. Follow the wizard to name your palace and choose an icon."
            },
            {
                q: "Understanding the memory technique",
                a: "The Memory Palace technique involves associating information you want to remember with specific locations in a familiar environment."
            },
            {
                q: "Navigating the app interface",
                a: "Use the bottom navigation bar to switch between the Home, Palaces, and Profile tabs."
            },
            {
                q: "Setting up your profile",
                a: "Go to the Profile tab and tap 'Edit Profile' to update your username, avatar, and personal preferences."
            },
        ],
    },
    {
        title: "Learning & Progress",
        items: [
            {
                q: "How XP and levels work",
                a: "You earn XP by completing training sessions and quizzes. Accumulate XP to level up and unlock new customization options."
            },
            {
                q: "Building training streaks",
                a: "Complete at least one training session per day to build your streak. Longer streaks earn you bonus XP multipliers."
            },
            {
                q: "Completing rooms and palaces",
                a: "A room is completed when you finish its associated quiz. Complete all rooms to master the palace."
            },
            {
                q: "Taking quizzes effectively",
                a: "Take quizzes regularly spaced out over time. Active recall is the most effective way to solidify your memory."
            },
        ],
    },
    {
        title: "Account & Settings",
        items: [
            {
                q: "Managing your account",
                a: "Access Account Settings from your Profile tab to manage personal details and linked accounts."
            },
            {
                q: "Privacy and data settings",
                a: "You can control what data is shared and manage your visibility from the Privacy Settings menu."
            },
            {
                q: "Notification preferences",
                a: "Customize push and email notifications in Settings > Notifications to stay updated on your training schedule."
            },
            {
                q: "Changing your password",
                a: "Navigate to Settings > Security > Change Password. You will need your current password to set a new one."
            },
        ],
    },
    {
        title: "Troubleshooting",
        items: [
            {
                q: "App not loading properly",
                a: "Try force closing the app and clearing your cache. If the issue persists, reinstall the application."
            },
            {
                q: "Progress not saving",
                a: "Ensure you have a stable internet connection. Progress is synced automatically when you are online."
            },
            {
                q: "Audio or video issues",
                a: "Check your device's volume and media settings. Make sure you haven't muted the app in your system settings."
            },
            {
                q: "Login problems",
                a: "If you forgot your password, use the 'Forgot Password' link on the login screen. For other issues, contact support."
            },
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
        description: "support@mindscape.app",
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

export function HelpCenterScreen({onBack}: HelpCenterScreenProps) {
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
                        <h1 className="text-2xl font-bold text-[#091A7A]">Help Center</h1>
                    </div>
                    <p className="text-sm text-[#091A7A]/70 px-2">
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
                            {contactOptions.map((option) => (
                                <motion.button
                                    key={option.label}
                                    whileTap={{scale: 0.98}}
                                    onClick={() => {
                                        if (option.label === "Email Support") window.location.href = "mailto:support@mindscape.app";
                                        else if (option.label === "Documentation") window.open("https://docs.mindscape.app", "_blank");
                                        else window.open("https://chat.mindscape.app", "_blank");
                                    }}
                                    className="w-full flex items-center justify-between p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card hover:bg-[#F5F5F7] transition-all text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-12 h-12 bg-gradient-to-br from-[#091A7A] to-[#4F8EFF] rounded-xl flex items-center justify-center">
                                            <option.icon className="w-6 h-6 text-white"/>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-[#091A7A] mb-0.5">
                                                {option.label}
                                            </p>
                                            <p className="text-sm text-[#091A7A]/70">
                                                {option.description}
                                            </p>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-[#091A7A]/40"/>
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
                            {helpCategories.map((category) => (
                                <div key={category.title}>
                                    <h4 className="font-semibold text-[#091A7A] mb-3 px-2">
                                        {category.title}
                                    </h4>
                                    <Accordion type="single" collapsible
                                               className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card px-5">
                                        {category.items.map((item, itemIndex) => (
                                            <AccordionItem key={itemIndex} value={`item-${itemIndex}`}
                                                           className="border-b border-[#E5E5EA] last:border-0">
                                                <AccordionTrigger
                                                    className="text-[15px] text-[#091A7A] hover:no-underline text-left py-4">
                                                    {item.q}
                                                </AccordionTrigger>
                                                <AccordionContent className="text-[14px] text-[#091A7A]/70 pb-4">
                                                    {item.a}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
