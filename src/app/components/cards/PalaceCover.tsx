import type {CSSProperties} from "react";

interface PalaceCoverProps {
    icon: string;
    /** A preset Tailwind gradient (`from-… to-…`) or a custom hex (`#7C3AED`). */
    color: string;
    /** When set, a downscaled photo data URL shown as the cover. */
    image?: string;
    /**
     * No-photo backdrop. `identity` paints the palace's own color (small
     * accent tiles); `brand` keeps the calm light-blue daylight gradient (large
     * card covers, per the Daylight Rule). A photo overrides both.
     */
    variant?: "identity" | "brand";
    /** Box geometry: size + radius (e.g. "w-11 h-11 rounded-full"). */
    className?: string;
    /** Emoji size class (e.g. "text-[24px]"). */
    iconClassName?: string;
    /** Hide the emoji entirely (tiny avatars where it would just be noise). */
    hideIcon?: boolean;
}

/**
 * The one place that knows how a palace cover renders, so custom photos and
 * free colors work everywhere a palace is shown. Three cases:
 * - `image` → the photo with a navy scrim so overlaid titles stay legible.
 * - preset `color` (`from-… to-…`) → a Tailwind gradient + emoji.
 * - custom `color` (hex) → an inline gradient derived from the hex + emoji.
 */
export function PalaceCover({
                                icon,
                                color,
                                image,
                                variant = "identity",
                                className = "",
                                iconClassName = "text-[24px]",
                                hideIcon = false,
                            }: PalaceCoverProps) {
    if (image) {
        return (
            <div className={`relative overflow-hidden bg-[#091A7A] ${className}`}>
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{backgroundImage: `url(${image})`}}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#091A7A]/45 via-transparent to-[#091A7A]/10"/>
                {!hideIcon && (
                    <span
                        className={`absolute bottom-1 right-1.5 drop-shadow ${iconClassName}`}
                        style={{fontSize: "0.7em"}}
                    >
                        {icon}
                    </span>
                )}
            </div>
        );
    }

    if (variant === "brand") {
        return (
            <div
                className={`flex items-center justify-center bg-gradient-to-br from-[#ADC8FF] to-[#E8F2FF] ${className}`}
            >
                {!hideIcon && <span className={iconClassName}>{icon}</span>}
            </div>
        );
    }

    const isPreset = color?.startsWith("from-");
    const style: CSSProperties | undefined = isPreset
        ? undefined
        : {
              backgroundImage: `linear-gradient(135deg, ${color}, color-mix(in oklab, ${color}, #000 22%))`,
          };

    return (
        <div
            className={`flex items-center justify-center ${isPreset ? `bg-gradient-to-br ${color}` : ""} ${className}`}
            style={style}
        >
            {!hideIcon && <span className={iconClassName}>{icon}</span>}
        </div>
    );
}
