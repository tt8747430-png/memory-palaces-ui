import {useLocalStorage} from "./useLocalStorage";

/**
 * The learner's identity. Kept separate from {@link usePreferences} (which is
 * about behavior) and from `useProgressState` (which is about training data).
 * Before this hook, the name, email, and avatar were hard-coded in several
 * screens and Edit Profile saved to nowhere; now one persisted record is the
 * single source of truth for the greeting, Settings, About, and Profile.
 */
export interface Profile {
    name: string;
    email: string;
    bio: string;
    /** Data-URL of an uploaded avatar, or null to use the initials fallback. */
    avatar: string | null;
}

// Empty by default — identity is real data the user provides (captured at
// signup, editable in Settings), never a fabricated placeholder name.
export const DEFAULT_PROFILE: Profile = {
    name: "",
    email: "",
    bio: "",
    avatar: null,
};

const PROFILE_KEY = "mindscape:profile";

export function useProfile() {
    const [raw, setRaw] = useLocalStorage<Partial<Profile>>(PROFILE_KEY, {});
    const profile: Profile = {...DEFAULT_PROFILE, ...raw};

    const updateProfile = (patch: Partial<Profile>) => {
        setRaw((prev) => ({...prev, ...patch}));
    };

    /** Whether the user has set a name yet (drives placeholders vs real value). */
    const hasName = profile.name.trim().length > 0;

    /** First name for compact greetings; falls back to a warm generic. */
    const firstName = hasName ? profile.name.trim().split(/\s+/)[0] : "there";

    /** Up-to-two-letter initials for the avatar fallback ("M" before a name). */
    const initials = hasName
        ? profile.name
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase() ?? "")
              .join("")
        : "M";

    return {profile, updateProfile, firstName, initials, hasName};
}
