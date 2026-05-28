import StatusBarIPhone from "../../imports/StatusBarIPhone";

export function StatusBar({
  theme = "light",
}: {
  theme?: "light" | "dark";
}) {
  const textColor = theme === "dark" ? "white" : "black";

  return (
    <div className="w-full h-[44px]">
      <StatusBarIPhone textColor={textColor} />
    </div>
  );
}