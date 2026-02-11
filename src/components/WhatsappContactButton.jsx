import React from "react";

const WhatsAppContactButton = ({ variant = "light" }) => {
    const phoneNumber = "919041914601";
    const message = "Hi, I need help with Shnoor Learning Platform";

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
    )}`;

    const isDark = variant === "dark";

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-medium transition-colors ${isDark
                    ? "text-slate-200 hover:text-white"
                    : "text-[#94a3b8] hover:text-white"
                }`}
        >
            Chat on WhatsApp
        </a>
    );
};

export default WhatsAppContactButton;