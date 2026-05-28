import { StatusBarIPhone } from "../../imports";

interface StatusBarProps {
  theme?: "light" | "dark";
  textColor?: "black" | "white";
}

export function StatusBar({
  theme = "light",
  textColor,
}: StatusBarProps) {
  const color = textColor ?? (theme === "dark" ? "white" : "black");

  return (
    <div className="w-full h-[44px]">
      <StatusBarIPhone textColor={color} />
    </div>
  );
}