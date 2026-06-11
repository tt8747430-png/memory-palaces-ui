import type {CapacitorConfig} from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "app.mindscape.memory",
    appName: "Mindscape",
    webDir: "dist",
    ios: {
        // Let our own safe-area padding handle insets instead of the web view.
        contentInset: "never",
    },
    plugins: {
        Keyboard: {
            // Overlay the keyboard (web view keeps full height); our
            // visualViewport-based inset docks sheets/footers above it. This
            // matches the PWA path so behaviour is identical native vs web.
            resize: "none",
        },
    },
};

export default config;
