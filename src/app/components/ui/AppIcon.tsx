interface AppIconProps {
  size?: number;
  className?: string;
}

export function AppIcon({
  size = 60,
  className = "",
}: AppIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <radialGradient
          id="bg"
          cx="42%"
          cy="38%"
          r="70%"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0%" stopColor="#0051D5" />
          <stop offset="52%" stopColor="#007AFF" />
          <stop offset="100%" stopColor="#1f74ec" />
        </radialGradient>
      </defs>

      <rect width="24" height="24" rx="5.4" fill="url(#bg)" />

      {/* Side column lines */}
      <line
        x1="4"
        y1="5"
        x2="4.5"
        y2="19"
        stroke="#5AC8FA"
        strokeWidth="0.6"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="5"
        x2="19.5"
        y2="19"
        stroke="#5AC8FA"
        strokeWidth="0.6"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />

      {/* Top-arch edge lines */}
      <line
        x1="4"
        y1="5"
        x2="8.5"
        y2="2.5"
        stroke="#64D2FF"
        strokeWidth="0.75"
        strokeOpacity="0.7"
        strokeLinecap="round"
      />
      <line
        x1="8.5"
        y1="2.5"
        x2="12"
        y2="1.8"
        stroke="#64D2FF"
        strokeWidth="0.75"
        strokeOpacity="0.7"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="1.8"
        x2="15.5"
        y2="2.5"
        stroke="#64D2FF"
        strokeWidth="0.75"
        strokeOpacity="0.7"
        strokeLinecap="round"
      />
      <line
        x1="15.5"
        y1="2.5"
        x2="20"
        y2="5"
        stroke="#64D2FF"
        strokeWidth="0.75"
        strokeOpacity="0.7"
        strokeLinecap="round"
      />

      {/* Spoke lines */}
      <line
        x1="4"
        y1="5"
        x2="12"
        y2="12"
        stroke="#5AC8FA"
        strokeWidth="0.65"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
      <line
        x1="8.5"
        y1="2.5"
        x2="12"
        y2="12"
        stroke="#5AC8FA"
        strokeWidth="0.65"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="1.8"
        x2="12"
        y2="12"
        stroke="#5AC8FA"
        strokeWidth="0.65"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
      <line
        x1="15.5"
        y1="2.5"
        x2="12"
        y2="12"
        stroke="#5AC8FA"
        strokeWidth="0.65"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="5"
        x2="12"
        y2="12"
        stroke="#5AC8FA"
        strokeWidth="0.65"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
      <line
        x1="4.5"
        y1="19"
        x2="12"
        y2="12"
        stroke="#5AC8FA"
        strokeWidth="0.65"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
      <line
        x1="19.5"
        y1="19"
        x2="12"
        y2="12"
        stroke="#5AC8FA"
        strokeWidth="0.65"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />

      {/* Arch nodes */}
      <circle cx="4" cy="5" r="1.45" fill="#0A84FF" />
      <circle cx="8.5" cy="2.5" r="1.15" fill="#64D2FF" />
      <circle cx="12" cy="1.8" r="1.55" fill="#32ADE6" />
      <circle cx="15.5" cy="2.5" r="1.15" fill="#64D2FF" />
      <circle cx="20" cy="5" r="1.45" fill="#0A84FF" />

      {/* Base anchor nodes */}
      <circle cx="4.5" cy="19" r="1.55" fill="#007AFF" />
      <circle cx="19.5" cy="19" r="1.55" fill="#007AFF" />

      {/* Central hub: 4-ring glow */}
      <circle
        cx="12"
        cy="12"
        r="4.4"
        fill="#004999"
        fillOpacity="0.5"
      />
      <circle cx="12" cy="12" r="3.1" fill="#0051D5" />
      <circle cx="12" cy="12" r="2.1" fill="#007AFF" />
      <circle cx="12" cy="12" r="1.2" fill="#5AC8FA" />
      <circle cx="12" cy="12" r="0.55" fill="#FFFFFF" />
    </svg>
  );
}