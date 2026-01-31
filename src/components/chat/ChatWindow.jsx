import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaPaperclip, FaTimes, FaFileAlt, FaSmile } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';

const ChatWindow = ({ activeChat, messages, onSendMessage, loadingMessages }) => {
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [showEmoji, setShowEmoji] = useState(false);
    const endRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, file]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim() && !file) return;

        onSendMessage(text, file);

        // Reset
        setText("");
        setFile(null);
        setShowEmoji(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleFileSelect = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    if (!activeChat) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-white h-full text-slate-400">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <span role="img" aria-label="chat" className="text-2xl">💬</span>
                </div>
                <p className="text-sm font-medium">Select a conversation to start chatting.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white h-full relative overflow-hidden">
            {/* Header */}
            <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white z-10 sticky top-0 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-primary-900 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
                        {activeChat.recipientName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm leading-tight">{activeChat.recipientName}</h3>
                        <span className="text-xs text-green-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Online
                        </span>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 flex flex-col gap-4 custom-scrollbar" onClick={() => setShowEmoji(false)}>
                {loadingMessages ? (
                    <div className="flex justify-center py-8">
                        <span className="text-xs font-medium text-slate-400 animate-pulse">Loading messages...</span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                        <span className="text-4xl">👋</span>
                        <p className="text-sm">No messages yet. Say Hi!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <MessageItem key={idx} msg={msg} />
                    ))
                )}
                <div ref={endRef} />
            </div>

            {/* File Preview */}
            {file && (
                <div className="px-4 py-2 bg-slate-50 flex items-center justify-between border-t border-slate-200">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <FaFileAlt size={14} />
                        </div>
                        <span className="text-sm font-medium text-slate-700 truncate max-w-xs">{file.name}</span>
                    </div>
                    <button
                        onClick={() => { setFile(null); fileInputRef.current.value = ""; }}
                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                    >
                        <FaTimes size={12} />
                    </button>
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200 relative">
                {showEmoji && (
                    <div className="absolute bottom-20 left-4 z-50 shadow-xl rounded-xl overflow-hidden border border-slate-200">
                        <EmojiPicker onEmojiClick={(em) => setText(prev => prev + em.emoji)} width={300} height={400} />
                    </div>
                )}

                <form className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-sm" onSubmit={handleSubmit}>
                    <button
                        type="button"
                        className="p-2 text-slate-400 hover:text-yellow-500 transition-colors"
                        onClick={() => setShowEmoji(!showEmoji)}
                    >
                        <FaSmile size={18} />
                    </button>

                    <button
                        type="button"
                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <FaPaperclip size={16} />
                    </button>
                    <input
                        type="file"
                        hidden
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                    />

                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={text}
                        onChange={e => setText(e.target.value)}
                        className="flex-1 bg-transparent border-none text-sm text-slate-800 placeholder-slate-400 focus:outline-none px-2"
                    />
                    <button
                        type="submit"
                        className={`p-2.5 rounded-lg transition-all flex items-center justify-center ${(!text.trim() && !file)
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-primary-900 text-white hover:bg-slate-800 shadow-sm'
                            }`}
                        disabled={!text.trim() && !file}
                    >
                        <FaPaperPlane size={14} />
                    </button>
                </form>
            </div>
        </div>
    );
};

const MessageItem = ({ msg }) => {
    const isMe = msg.isMyMessage;

    const renderAttachment = () => {
        if (!msg.attachment_url && !msg.attachment_file_id) return null;

        // Prefer explicit URL from backend, else construct it
        const url = msg.attachment_url || `http://localhost:5000/api/files/${msg.attachment_file_id}`;
        const type = msg.attachment_type || 'file'; // fallback

        if (type.includes('image')) {
            return (
                <div className="mb-2 overflow-hidden rounded-lg border border-slate-200/50">
                    <img src={url} alt="attachment" className="max-w-full sm:max-w-xs max-h-60 object-cover cursor-pointer hover:opacity-95 transition-opacity" onClick={() => window.open(url, '_blank')} />
                </div>
            );
        }
        if (type.includes('video')) {
            return (
                <div className="mb-2 overflow-hidden rounded-lg border border-slate-200/50">
                    <video src={url} controls className="max-w-full sm:max-w-xs max-h-60" />
                </div>
            );
        }
        return (
            <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-lg mb-2 text-indigo-600 hover:bg-slate-100 transition-colors border border-slate-200/50 group">
                <div className="p-2 bg-white rounded-md shadow-sm text-indigo-500 group-hover:text-indigo-600">
                    <FaFileAlt size={16} />
                </div>
                <span className="text-xs font-semibold underline decoration-transparent group-hover:decoration-indigo-600 transition-all underline-offset-2">
                    {msg.attachment_name || "Download File"}
                </span>
            </a>
        );
    };

    return (
        <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
            <div className={`
                p-3.5 rounded-2xl text-sm shadow-sm relative group transition-all
                ${isMe
                    ? 'bg-primary-900 text-white rounded-br-none'
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                }
            `}>
                {renderAttachment()}
                {msg.text && <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
            </div>
            <div className="text-[10px] font-medium text-slate-400 mt-1 px-1 flex gap-1">
                {new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {isMe && <span className="text-indigo-500">●</span>}
            </div>
        </div>
    );
}

export default ChatWindow;