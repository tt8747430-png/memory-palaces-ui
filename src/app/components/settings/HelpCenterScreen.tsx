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
                a: "You earn XP for studying flashcards, finishing quizzes, and clearing your Daily Review. XP adds up to raise your level, a simple measure of how much practice you've put in."
            },
            {
                q: "Building training streaks",
                a: "Train at least once a day to grow your streak. Miss a single day and a streak freeze (shown by the snowflake on your streak) is spent automatically to keep the chain alive. You earn another freeze at every 7-day milestone."
            },
            {
                q: "What is Daily Review?",
                a: "Daily Review gathers every card that's due across all your palaces into one session, scheduled by spaced repetition. It appears on Home whenever cards are due, the fastest way to keep memories fresh."
            },
            {
                q: "Map vs. List in a palace",
                a: "Inside a palace, switch the rooms between a journey Map (a walkable route that mirrors the method of loci) and a List (best for reordering and editing). Your choice is remembered."
            },
            {
                q: "Taking quizzes effectively",
                a: "Quiz yourself in short sessions spread over time. Active recall, not rereading, is what moves information into long-term memory."
            },
        ],
    },
    {
        title: "Account & Settings",
        items: [
            {
                q: "Sound, haptics, and reduced motion",
                a: "Settings > Preferences lets you turn answer/complete sounds and vibration on or off, and force reduced motion if animations are distracting. Each takes effect immediately."
            },
            {
                q: "Notification preferences",
                a: "Turn the in-app milestone toasts (level-ups, streaks, completions) on or off with the Notifications switch in Settings. The bell screen keeps a full history either way."
            },
            {
                q: "Managing your account",
                a: "Open Edit Profile from the top of Settings to update your name and avatar."
            },
            {
                q: "Privacy and data settings",
                a: "Mindscape runs entirely on your device. Use Privacy Settings to manage visibility options, and Data Management to export, import, or restore your progress."
            },
        ],
    },
    {
        title: "Troubleshooting",
        items: [
            {
                q: "Where is my data stored?",
                a: "Everything is saved locally on this device; there's no account server. Use Settings > Data Management > Export Progress regularly so you have a backup file."
            },
            {
                q: "Progress not saving",
                a: "Progress saves automatically after each session. If a write fails (private browsing or a full disk can block storage), free up space or leave private mode, then try again."
            },
            {
                q: "Moving to a new device",
                a: "Export your progress to a .json file on the old device, then use Import Progress on the new one to bring everything across."
            },
            {
                q: "Audio not playing",
                a: "Check Settings > Preferences > Sound effects is on, then your device's volume and mute switch. Sounds are intentionally short and quiet."
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
                                    <Accordion multiple={false}
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
