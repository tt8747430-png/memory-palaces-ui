interface DividerProps {
  text?: string;
  className?: string;
}

export function Divider({
  text,
  className = "",
}: DividerProps) {
  if (text) {
    return (
      <div
        className={`flex items-center gap-[16px] ${className}`}
      >
        <div className="flex-1 h-[1px] bg-[#D1D1D6]" />
        <span
          className="text-[13px] text-[#86868B] uppercase font-medium"
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          {text}
        </span>
        <div className="flex-1 h-[1px] bg-[#D1D1D6]" />
      </div>
    );
  }

  return (
    <div className={`h-[1px] bg-[#D1D1D6] ${className}`} />
  );
}