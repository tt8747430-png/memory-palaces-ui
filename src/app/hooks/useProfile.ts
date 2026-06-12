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

export const DEFAULT_PROFILE: Profile = {
    name: "Braila",
    email: "memory@master.com",
    bio: "On a mission to remember everything that matters.",
    avatar: null,
};

const PROFILE_KEY = "mindscape:profile";

export function useProfile() {
    const [raw, setRaw] = useLocalStorage<Partial<Profile>>(PROFILE_KEY, {});
    const profile: Profile = {...DEFAULT_PROFILE, ...raw};

    const updateProfile = (patch: Partial<Profile>) => {
        setRaw((prev) => ({...prev, ...patch}));
    };

    /** First name only, for compact greetings ("Hi, Braila"). */
    const firstName = profile.name.trim().split(/\s+/)[0] || DEFAULT_PROFILE.name;

    /** Up-to-two-letter initials for the avatar fallback. */
    const initials =
        profile.name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join("") || "M";

    return {profile, updateProfile, firstName, initials};
}
