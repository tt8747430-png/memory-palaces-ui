import { motion } from "motion/react";
import { ArrowLeft, Camera, Save } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface EditProfileScreenProps {
  onBack: () => void;
  onSave: (data: ProfileData) => void;
}

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  avatar: string;
}

export function EditProfileScreen({ onBack, onSave }: EditProfileScreenProps) {
  const [name, setName] = useState("Memory Master");
  const [email, setEmail] = useState("memory@master.com");
  const [bio, setBio] = useState("Learning enthusiast on a journey to master memory techniques");
  const [avatar] = useState("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    onSave({ name, email, bio, avatar });
    setIsSaving(false);
    onBack();
  };

  return (
    <div className="size-full flex flex-col bg-gradient-to-b from-[#ADC8FF]/20 to-white">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#091A7A]/10 via-[#ADC8FF]/20 to-transparent" />

        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="w-12 h-12 bg-card-glass backdrop-blur-lg rounded-full flex items-center justify-center shadow-card border border-white/20"
            >
              <ArrowLeft className="w-5 h-5 text-[#091A7A]" />
            </motion.button>
            <h1 className="text-2xl font-bold text-[#091A7A]">Edit Profile</h1>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={isSaving}
              className="w-12 h-12 bg-gradient-to-br from-[#091A7A] to-[#1a2b8a] backdrop-blur-lg rounded-full flex items-center justify-center shadow-card disabled:opacity-50"
            >
              <Save className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-8">
        <div className="px-6 space-y-6">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              <ImageWithFallback
                src={avatar}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-white shadow-xl object-cover"
                style={{ objectPosition: "center 20%" }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-br from-[#091A7A] to-[#1a2b8a] rounded-full flex items-center justify-center shadow-lg border-2 border-white"
              >
                <Camera className="w-5 h-5 text-white" />
              </motion.button>
            </div>
            <p className="text-sm text-[#091A7A]/60">Tap to change photo</p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#091A7A]/70 mb-2 px-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card text-[#091A7A] placeholder:text-[#091A7A]/40 focus:outline-none focus:ring-2 focus:ring-[#091A7A]/20 transition-all"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#091A7A]/70 mb-2 px-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card text-[#091A7A] placeholder:text-[#091A7A]/40 focus:outline-none focus:ring-2 focus:ring-[#091A7A]/20 transition-all"
                placeholder="Enter your email"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-[#091A7A]/70 mb-2 px-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card text-[#091A7A] placeholder:text-[#091A7A]/40 focus:outline-none focus:ring-2 focus:ring-[#091A7A]/20 transition-all resize-none"
                placeholder="Tell us about yourself"
              />
              <p className="text-xs text-[#091A7A]/50 mt-2 px-2">{bio.length}/200 characters</p>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-4 bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] text-white font-semibold rounded-2xl shadow-lg disabled:opacity-50 transition-all"
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
