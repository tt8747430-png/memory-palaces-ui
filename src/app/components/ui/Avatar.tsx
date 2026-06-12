import {ImageWithFallback} from "./ImageWithFallback";
import {cn} from "./utils";

interface AvatarProps {
    /** Uploaded photo (data-URL or remote). When absent, initials are shown. */
    src?: string | null;
    /** Accessible name / alt text. */
    name?: string;
    /** Pre-computed initials for the fallback (see `useProfile`). */
    initials: string;
    /** Box sizing, shape, and border classes (e.g. `w-14 h-14 rounded-full`). */
    className?: string;
    /** Font sizing for the initials fallback; matches the box size. */
    initialsClassName?: string;
}

/**
 * One avatar with a graceful initials fallback, replacing the photo-or-initials
 * branch that was repeated in the home header, settings hero, edit-profile, and
 * profile screens. Pass shape/size via `className` so it fits each context.
 */
export function Avatar({src, name, initials, className, initialsClassName}: AvatarProps) {
    if (src) {
        return (
            <ImageWithFallback
                src={src}
                alt={name || "Profile"}
                className={cn("object-cover bg-white", className)}
            />
        );
    }
    return (
        <div
            role="img"
            aria-label={name || "Profile"}
            className={cn(
                "flex items-center justify-center bg-gradient-to-br from-[#091A7A] to-[#4F8EFF] font-bold text-white",
                initialsClassName,
                className,
            )}
        >
            {initials}
        </div>
    );
}
