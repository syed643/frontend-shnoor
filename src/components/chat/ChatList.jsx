import React from 'react';

const ChatList = ({ chats, activeChat, onSelectChat, unreadCounts }) => {
    return (
        <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50 h-full">
            <div className="p-4 border-b border-slate-200 bg-white">
                <input
                    type="text"
                    placeholder="Search contacts..."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {chats.map(chat => {
                    const unreadCount = unreadCounts[chat.id] || 0;
                    const isActive = activeChat?.id === chat.id;

                    return (
                        <div
                            key={chat.id}
                            className={`flex items-center gap-3 p-4 cursor-pointer transition-all border-b border-slate-100 hover:bg-white ${isActive
                                    ? 'bg-white border-r-4 border-r-indigo-600 shadow-sm'
                                    : 'border-r-4 border-r-transparent'
                                }`}
                            onClick={() => onSelectChat(chat)}
                        >
                            {/* Avatar with indicator */}
                            <div className="relative shrink-0 w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                {chat.recipientName?.charAt(0).toUpperCase() || 'U'}
                                {unreadCount > 0 && !isActive && (
                                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className={`text-sm font-semibold truncate ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>
                                        {chat.recipientName}
                                    </span>
                                    {chat.lastMessageTime && (
                                        <span className={`text-[10px] ${unreadCount > 0 ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
                                            {new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center gap-2">
                                    <p className={`text-xs truncate flex-1 ${unreadCount > 0 ? 'font-semibold text-slate-700' : 'text-slate-500'}`}>
                                        {chat.lastMessage || 'No messages yet'}
                                    </p>
                                    {unreadCount > 0 && !isActive && (
                                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shrink-0">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {chats.length === 0 && (
                    <div className="p-8 text-center">
                        <p className="text-slate-400 text-sm">No conversations yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;