import { AppIcon } from "../components/ui/AppIcon";

interface LogoIconProps {
  className?: string;
  size?: number;
}

export function LogoIcon({ className, size }: LogoIconProps) {
  return <AppIcon size={size} className={className} />;
}