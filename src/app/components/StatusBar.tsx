import StatusBarIPhone from "../imports/StatusBarIPhone";

interface StatusBarProps {
  textColor?: "black" | "white";
}

export function StatusBar({
  textColor = "black",
}: StatusBarProps) {
  return (
    <div className="h-[44px] w-full">
      <StatusBarIPhone textColor={textColor} />
    </div>
  );
}