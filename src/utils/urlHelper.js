/**
 * Converts various video/presentation URLs to their embeddable versions.
 */
export const getEmbedUrl = (url) => {
    if (!url) return "";

    // Already an embed URL
    if (url.includes("/embed/")) return url;

    // YouTube handling
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
        let videoId = "";

        // 1. watch?v= format
        if (url.includes("v=")) {
            videoId = url.split("v=")[1].split("&")[0];
        }
        // 2. youtu.be/ ID format
        else if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1].split("?")[0];
        }
        // 3. youtube.com/shorts/ ID format
        else if (url.includes("/shorts/")) {
            videoId = url.split("/shorts/")[1].split("?")[0];
        }
        // 4. Handle placeholder/example links in dummy data (e.g. /example/id)
        else {
            const parts = url.split("/");
            const lastPart = parts[parts.length - 1];
            if (lastPart && lastPart.length > 5) {
                videoId = lastPart;
            }
        }

        if (videoId) {
            // Use www.youtube-nocookie.com for better compatibility and privacy
            return `https://www.youtube-nocookie.com/embed/${videoId}`;
        }
    }

    // Gamma handling
    if (url.includes("gamma.app")) {
        // Handle gamma.app/public/ID or gamma.app/docs/ID
        return url.replace("gamma.app/public/", "gamma.app/embed/")
            .replace("gamma.app/docs/", "gamma.app/embed/");
    }

    return url;
};