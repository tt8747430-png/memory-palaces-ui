export function DynamicBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Base gradient layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ADC8FF] via-[#E8F2FF] to-white"/>

            {/* Static atmospheric light. Previously three perpetually animating
                orbs; held at a calm fixed state so the background reads as a lit
                room without continuous motion (see PRODUCT.md: calm baseline). */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(circle at 20% 30%, rgba(173, 200, 255, 0.20) 0%, transparent 50%)",
                }}
            />
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(circle at 80% 70%, rgba(173, 200, 255, 0.15) 0%, transparent 40%)",
                }}
            />
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at center, rgba(173, 200, 255, 0.10) 0%, transparent 60%)",
                }}
            />

            {/* Subtle noise texture overlay for depth */}
            <div
                className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "repeat",
                }}
            />
        </div>
    );
}
