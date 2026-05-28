import { type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Home icon (filled variant) — used in bottom nav active state */
export function HomeFilledIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 11.9896V14.5C3 17.7998 3 19.4497 4.02513 20.4749C5.05025 21.5 6.70017 21.5 10 21.5H14C17.2998 21.5 18.9497 21.5 19.9749 20.4749C21 19.4497 21 17.7998 21 14.5V11.9896C21 10.3083 21 9.46773 20.6441 8.74005C20.2882 8.01237 19.6247 7.49628 18.2976 6.46411L16.2976 4.90855C14.2331 3.30285 13.2009 2.5 12 2.5C10.7991 2.5 9.76689 3.30285 7.70242 4.90855L5.70241 6.46411C4.37533 7.49628 3.71179 8.01237 3.3559 8.74005C3 9.46773 3 10.3083 3 11.9896Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.00018 17C9.79968 17.6224 10.85 18 12.0002 18C13.1505 18 14.2007 17.6224 15.0002 17"
        fill="currentColor"
      />
      <path
        d="M9.00018 17C9.79968 17.6224 10.85 18 12.0002 18C13.1505 18 14.2007 17.6224 15.0002 17"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Home icon (outline variant) — used in bottom nav inactive state */
export function HomeOutlineIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 11.9896V14.5C3 17.7998 3 19.4497 4.02513 20.4749C5.05025 21.5 6.70017 21.5 10 21.5H14C17.2998 21.5 18.9497 21.5 19.9749 20.4749C21 19.4497 21 17.7998 21 14.5V11.9896C21 10.3083 21 9.46773 20.6441 8.74005C20.2882 8.01237 19.6247 7.49628 18.2976 6.46411L16.2976 4.90855C14.2331 3.30285 13.2009 2.5 12 2.5C10.7991 2.5 9.76689 3.30285 7.70242 4.90855L5.70241 6.46411C4.37533 7.49628 3.71179 8.01237 3.3559 8.74005C3 9.46773 3 10.3083 3 11.9896Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.0002 17C14.2007 17.6224 13.1504 18 12.0002 18C10.8499 18 9.79971 17.6224 9.00018 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


/** AI/microphone with sparkles icon */
export function AiNavIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M17 11C17 13.7614 14.7614 16 12 16C9.23858 16 7 13.7614 7 11V7C7 4.23858 9.23858 2 12 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 11C20 15.4183 16.4183 19 12 19M12 19C7.58172 19 4 15.4183 4 11M12 19V22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.3327 4.64612C15.5394 4.49594 16.4959 3.53944 16.6461 2.33267C16.6689 2.14999 16.8159 2 17 2C17.1841 2 17.3311 2.14999 17.3539 2.33267C17.5041 3.53944 18.4606 4.49594 19.6673 4.64612C19.85 4.66885 20 4.81591 20 5C20 5.1841 19.85 5.33115 19.6673 5.35388C18.4606 5.50406 17.5041 6.46056 17.3539 7.66733C17.3311 7.85001 17.1841 8 17 8C16.8159 8 16.6689 7.85001 16.6461 7.66733C16.4959 6.46056 15.5394 5.50406 14.3327 5.35388C14.15 5.33115 14 5.1841 14 5C14 4.81591 14.15 4.66885 14.3327 4.64612Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Profile/user circle icon */
export function ProfileNavIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12C13.6569 12 15 10.6569 15 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 17C17 14.2386 14.7614 12 12 12C9.23858 12 7 14.2386 7 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Palace/brain icon for palaces navigation */
export function PalaceNavIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 13C3 11.1144 3 10.1716 3.58579 9.58579C4.17157 9 5.11438 9 7 9H17C18.8856 9 19.8284 9 20.4142 9.58579C21 10.1716 21 11.1144 21 13V14C21 16.8284 21 18.2426 20.1213 19.1213C19.2426 20 17.8284 20 15 20H9C6.17157 20 4.75736 20 3.87868 19.1213C3 18.2426 3 16.8284 3 14V13Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 9V6.5M12 6.5C12 5.67157 11.3284 5 10.5 5C9.67157 5 9 5.67157 9 6.5V7M12 6.5C12 5.67157 12.6716 5 13.5 5C14.3284 5 15 5.67157 15 6.5V7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 12H17M7 15H17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}