/**
 * Turn a user-picked image File into a small cover data URL suitable for
 * storing inside the single `localStorage` progress blob. The image is
 * downscaled so its longest side is at most `max` px and re-encoded as WebP, so
 * a phone photo drops from megabytes to ~40–120 KB. Covers are rendered with
 * `background-size: cover`, so the original aspect ratio is preserved.
 */
export async function fileToCoverDataUrl(file: File, max = 640): Promise<string> {
    const bitmap = await createImageBitmap(file);
    try {
        const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
        const width = Math.max(1, Math.round(bitmap.width * scale));
        const height = Math.max(1, Math.round(bitmap.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas 2D context unavailable");
        ctx.drawImage(bitmap, 0, 0, width, height);

        return canvas.toDataURL("image/webp", 0.82);
    } finally {
        bitmap.close();
    }
}
