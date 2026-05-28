import { motion } from "motion/react";
import { ArrowLeft, Lock, Eye, EyeOff, Check, X } from "lucide-react";
import { useState } from "react";

interface ChangePasswordScreenProps {
  onBack: () => void;
  onPasswordChanged: () => void;
}

export function ChangePasswordScreen({ onBack, onPasswordChanged }: ChangePasswordScreenProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const passwordRequirements = [
    { label: "At least 8 characters", met: newPassword.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(newPassword) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(newPassword) },
    { label: "Contains number", met: /[0-9]/.test(newPassword) },
    { label: "Contains special character", met: /[!@#$%^&*]/.test(newPassword) },
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const canSubmit = currentPassword.length > 0 && allRequirementsMet && passwordsMatch;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    onPasswordChanged();
    onBack();
  };

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
            <h1 className="text-2xl font-bold text-[#091A7A]">Change Password</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-8">
        <div className="px-6 space-y-6">
          {/* Current Password */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <label className="block text-sm font-medium text-[#091A7A]/70 mb-2 px-2">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#091A7A]/40" />
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card text-[#091A7A] placeholder:text-[#091A7A]/40 focus:outline-none focus:ring-2 focus:ring-[#091A7A]/20 transition-all"
                placeholder="Enter current password"
              />
              <button
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showCurrent ? (
                  <EyeOff className="w-5 h-5 text-[#091A7A]/40" />
                ) : (
                  <Eye className="w-5 h-5 text-[#091A7A]/40" />
                )}
              </button>
            </div>
          </motion.div>

          {/* New Password */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-[#091A7A]/70 mb-2 px-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#091A7A]/40" />
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card text-[#091A7A] placeholder:text-[#091A7A]/40 focus:outline-none focus:ring-2 focus:ring-[#091A7A]/20 transition-all"
                placeholder="Enter new password"
              />
              <button
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showNew ? (
                  <EyeOff className="w-5 h-5 text-[#091A7A]/40" />
                ) : (
                  <Eye className="w-5 h-5 text-[#091A7A]/40" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Password Requirements */}
          {newPassword.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-card p-4 space-y-2"
            >
              <p className="text-sm font-medium text-[#091A7A]/70 mb-3">Password Requirements</p>
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    req.met ? "bg-green-500" : "bg-gray-300"
                  }`}>
                    {req.met ? (
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    ) : (
                      <X className="w-3 h-3 text-gray-500" strokeWidth={3} />
                    )}
                  </div>
                  <span className={`text-sm ${req.met ? "text-green-700" : "text-[#091A7A]/60"}`}>
                    {req.label}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Confirm Password */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-[#091A7A]/70 mb-2 px-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#091A7A]/40" />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-12 pr-12 py-3.5 bg-white/80 backdrop-blur-sm rounded-2xl border shadow-card text-[#091A7A] placeholder:text-[#091A7A]/40 focus:outline-none focus:ring-2 transition-all ${
                  confirmPassword.length > 0 && !passwordsMatch
                    ? "border-red-300 focus:ring-red-200"
                    : "border-white/60 focus:ring-[#091A7A]/20"
                }`}
                placeholder="Confirm new password"
              />
              <button
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showConfirm ? (
                  <EyeOff className="w-5 h-5 text-[#091A7A]/40" />
                ) : (
                  <Eye className="w-5 h-5 text-[#091A7A]/40" />
                )}
              </button>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-sm text-red-600 mt-2 px-2">Passwords do not match</p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: canSubmit ? 1.02 : 1 }}
            whileTap={{ scale: canSubmit ? 0.98 : 1 }}
            onClick={handleSubmit}
            disabled={!canSubmit || isSaving}
            className="w-full py-4 bg-gradient-to-r from-[#091A7A] to-[#4F8EFF] text-white font-semibold rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                Updating...
              </span>
            ) : (
              "Update Password"
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
