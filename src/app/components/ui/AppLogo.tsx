import { motion } from "motion/react";
import { AppIcon } from "./AppIcon";

interface AppLogoProps {
  size?: "small" | "medium" | "large";
  showIcon?: boolean;
  showTagline?: boolean;
  animated?: boolean;
  theme?: "light" | "dark";
}

const sizes = {
  small: {
    icon: 40,
    title: "text-[24px]",
    tagline: "text-[13px]",
  },
  medium: {
    icon: 60,
    title: "text-[32px]",
    tagline: "text-[15px]",
  },
  large: {
    icon: 80,
    title: "text-[40px]",
    tagline: "text-[17px]",
  },
};

export function AppLogo({
  size = "medium",
  showIcon = true,
  showTagline = false,
  animated = true,
  theme = "dark",
}: AppLogoProps) {
  const sizeConfig = sizes[size];
  const textColor =
    theme === "dark" ? "text-white" : "text-[#1D1D1F]";
  const taglineColor =
    theme === "dark" ? "text-white/70" : "text-[#86868B]";

  const Container = animated ? motion.div : "div";
  const containerProps = animated
    ? {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: {
          duration: 0.6,
          ease: [0.34, 1.56, 0.64, 1],
        },
      }
    : {};

  return (
    <Container
      className="flex items-center gap-[16px]"
      {...containerProps}
    >
      {showIcon && <AppIcon size={sizeConfig.icon} />}

      <div className="flex flex-col">
        <h1
          className={`font-bold ${sizeConfig.title} ${textColor} tracking-tight leading-none`}
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            fontWeight: 700,
          }}
        >
          Memory Palaces
        </h1>
        {showTagline && (
          <p
            className={`${sizeConfig.tagline} ${taglineColor} mt-[4px] font-medium`}
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            }}
          >
            Master Your Memory
          </p>
        )}
      </div>
    </Container>
  );
}