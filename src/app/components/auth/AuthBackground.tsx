import { motion } from "motion/react";

export function AuthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0, 1, 0],
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 300 - 150],
          }}
          transition={{
            duration: 4,
            delay: i * 0.5,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          className="absolute w-8 h-8 rounded-full bg-gradient-to-r from-[#ADC8FF] to-[#091A7A] opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: "blur(4px)",
          }}
        />
      ))}
    </div>
  );
}
