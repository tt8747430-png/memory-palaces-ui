import {motion} from "motion/react";
import {ArrowLeft, Camera, Save} from "lucide-react";
import {type ChangeEvent, useRef, useState} from "react";
import {toast} from "sonner";
import {ImageWithFallback} from "../ui/ImageWithFallback";
import {useProfile} from "../../hooks/useProfile";

interface EditProfileScreenProps {
    onBack: () => void;
    onSave: () => void;
}

/**
 * Downscale a picked image to a small square data-URL so it fits comfortably in
 * localStorage (the only persistence the app has). Returns a JPEG ~256px wide.
 */
function fileToAvatar(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("read-failed"));
        reader.onload = () => {
            const img = new Image();
            img.onerror = () => reject(new Error("decode-failed"));
            img.onload = () => {
                const size = 256;
                const canvas = document.createElement("canvas");
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext("2d");
                if (!ctx) return reject(new Error("no-canvas"));
                // Cover-crop to a centered square.
                const scale = Math.max(size / img.width, size / img.height);
                const w = img.width * scale;
                const h = img.height * scale;
                ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
                resolve(canvas.toDataURL("image/jpeg", 0.82));
            };
            img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
    });
}

export function EditProfileScreen({onBack, onSave}: EditProfileScreenProps) {
    const {profile, updateProfile, initials} = useProfile();
    const [name, setName] = useState(profile.name);
    const [email, setEmail] = useState(profile.email);
    const [bio, setBio] = useState(profile.bio);
    const [avatar, setAvatar] = useState<string | null>(profile.avatar);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const canSave = name.trim().length > 0 && emailValid && !isSaving;

    const handlePickPhoto = () => fileInputRef.current?.click();

    const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (!file) return;
        try {
            setAvatar(await fileToAvatar(file));
        } catch {
            toast.error("Couldn't read that image. Try a different photo.");
        }
    };

    const handleSave = async () => {
        if (!canSave) return;
        setIsSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 600));
        updateProfile({name: name.trim(), email: email.trim(), bio: bio.trim(), avatar});
        setIsSaving(false);
        onSave();
        onBack();
    };

    return (
        <div className="size-full flex flex-col">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#091A7A]/10 via-[#ADC8FF]/20 to-transparent"/>

                <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                        <motion.button
                            whileTap={{scale: 0.95}}
                            onClick={onBack}
                            aria-label="Go back"
                            className="w-12 h-12 bg-card-glass backdrop-blur-lg rounded-full flex items-center justify-center shadow-card border border-white/20"
                        >
                            <ArrowLeft className="w-5 h-5 text-[#091A7A]"/>
                        </motion.button>
                        <h1 className="text-2xl font-bold text-[#091A7A]">Edit Profile</h1>
                        <motion.button
                            whileTap={{scale: 0.95}}
                            onClick={handleSave}
                            disabled={!canSave}
                            aria-label="Save changes"
                            className="w-12 h-12 bg-gradient-to-br from-[#091A7A] to-[#4F8EFF] backdrop-blur-lg rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(9,26,122,0.25)] disabled:opacity-50"
                        >
                            <Save className="w-5 h-5 text-white"/>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide pb-8">
                <div className="px-6 space-y-6">
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            {avatar ? (
                                <ImageWithFallback
                                    src={avatar}
                                    alt={name || "Profile"}
                                    className="w-28 h-28 rounded-full border-4 border-white shadow-[0_12px_32px_rgba(9,26,122,0.18)] object-cover"
                                />
                            ) : (
                                <div
                                    className="w-28 h-28 rounded-full border-4 border-white shadow-[0_12px_32px_rgba(9,26,122,0.18)] bg-gradient-to-br from-[#091A7A] to-[#4F8EFF] flex items-center justify-center text-white text-[36px] font-bold"
                                    aria-label={name}
                                >
                                    {initials}
                                </div>
                            )}
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                onClick={handlePickPhoto}
                                aria-label="Change photo"
                                className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-br from-[#091A7A] to-[#4F8EFF] rounded-full flex items-center justify-center shadow-[0_6px_16px_rgba(9,26,122,0.30)] border-2 border-white"
                            >
                                <Camera className="w-5 h-5 text-white"/>
                            </motion.button>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handlePickPhoto}
                                className="text-sm font-semibold text-[#091A7A] underline-offset-2 hover:underline"
                            >
                                {avatar ? "Change photo" : "Upload a photo"}
                            </button>
                            {avatar && (
                                <button
                                    onClick={() => setAvatar(null)}
                                    className="text-sm font-medium text-[#091A7A]/55 hover:text-[#091A7A]"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoChange}
                        />
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label htmlFor="profile-name" className="block text-sm font-medium text-[#091A7A]/70 mb-2 px-2">
                                Name
                            </label>
                            <input
                                id="profile-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card text-[#091A7A] placeholder:text-[#091A7A]/65 focus:outline-none focus:ring-2 focus:ring-[#091A7A]/20 transition-all"
                                placeholder="Enter your name"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="profile-email" className="block text-sm font-medium text-[#091A7A]/70 mb-2 px-2">
                                Email
                            </label>
                            <input
                                id="profile-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                aria-invalid={email.length > 0 && !emailValid}
                                className="w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card text-[#091A7A] placeholder:text-[#091A7A]/65 focus:outline-none focus:ring-2 focus:ring-[#091A7A]/20 transition-all aria-[invalid=true]:border-[#EF4444]/60 aria-[invalid=true]:ring-[#EF4444]/20"
                                placeholder="you@example.com"
                            />
                            {email.length > 0 && !emailValid && (
                                <p className="text-xs font-medium text-[#EF4444] mt-2 px-2">
                                    Enter a valid email address.
                                </p>
                            )}
                        </div>

                        {/* Bio */}
                        <div>
                            <label htmlFor="profile-bio" className="block text-sm font-medium text-[#091A7A]/70 mb-2 px-2">
                                Bio
                            </label>
                            <textarea
                                id="profile-bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value.slice(0, 200))}
                                rows={4}
                                maxLength={200}
                                className="w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card text-[#091A7A] placeholder:text-[#091A7A]/65 focus:outline-none focus:ring-2 focus:ring-[#091A7A]/20 transition-all resize-none"
                                placeholder="Tell us about yourself"
                            />
                            <p className="text-xs font-medium text-[#091A7A]/65 mt-2 px-2">{bio.length}/200 characters</p>
                        </div>
                    </div>

                    {/* Save Button */}
                    <motion.button
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                        onClick={handleSave}
                        disabled={!canSave}
                        className="w-full py-4 bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] text-white font-semibold rounded-2xl shadow-[0_10px_28px_rgba(9,26,122,0.25)] disabled:opacity-50 transition-all"
                    >
                        {isSaving ? (
                            <span className="flex items-center justify-center gap-2">
                                <motion.div
                                    animate={{rotate: 360}}
                                    transition={{duration: 1, repeat: Infinity, ease: "linear"}}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                />
                                Saving changes...
                            </span>
                        ) : (
                            "Save changes"
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
