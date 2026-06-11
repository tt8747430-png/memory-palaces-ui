import {Capacitor} from "@capacitor/core";
import {Keyboard} from "@capacitor/keyboard";

/**
 * Capacitor native-shell tweaks. A no-op in the browser / installed PWA (where
 * `isNativePlatform()` is false), so the same web bundle ships everywhere and
 * the visualViewport keyboard handling stays in charge there.
 */
export async function initNativeShell(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    try {
        // Hide the iOS input accessory bar: the autofill / contact / formatting
        // strip that sits above the keyboard and steals vertical space.
        await Keyboard.setAccessoryBarVisible({isVisible: false});
    } catch {
        // Plugin unavailable on this platform (e.g. Android); ignore.
    }
}
