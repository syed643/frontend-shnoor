import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatList from '../../components/chat/ChatList';
import ChatWindow from '../../components/chat/ChatWindow';
import { auth } from '../../auth/firebase';
import { useSocket } from '../../context/SocketContext';
import '../../styles/Chat.css';

const InstructorChat = () => {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const currentUser = auth.currentUser;
    const { socket, unreadCounts, markChatRead, handleSetActiveChat } = useSocket();

    const activeChatRef = useRef(null);
    const chatsRef = useRef([]);

    useEffect(() => {
        activeChatRef.current = activeChat;
        // Sync with context to prevent notification counts
        if (handleSetActiveChat) handleSetActiveChat(activeChat ? activeChat.id : null);
    }, [activeChat, handleSetActiveChat]);
    useEffect(() => { chatsRef.current = chats; }, [chats]);

    useEffect(() => {
        if (!currentUser) return;
        const fetchChats = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                const res = await axios.get(`${API_URL}/api/chats`, {
                    params: { firebase_uid: currentUser.uid }
                });
                const formattedChats = res.data.map(c => ({
                    id: c.chat_id,
                    recipientName: c.recipient_name,
                    recipientId: c.recipient_uid,
                    participants: [currentUser.uid, c.recipient_uid],
                    lastMessage: 'View conversation',
                    updatedAt: c.created_at,
                    messages: [],
                    unreadCount: unreadCounts[c.chat_id] || 0
                }));
                setChats(formattedChats);
            } catch (err) {
                console.error("Error fetching chats:", err);
            }
        };
        fetchChats();
    }, [currentUser]);

    const [notification, setNotification] = useState(null);

    // Find this useEffect in StudentChat.jsx and replace the logic inside
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (newMsg) => {
            // A. NOTIFICATION LOGIC (Keep existing)
            if (newMsg.sender_uid !== currentUser.uid) {
                playNotificationSound();
                const currentChatId = activeChatRef.current ? String(activeChatRef.current.id) : null;
                const messageChatId = String(newMsg.chat_id);

                if (currentChatId !== messageChatId) {
                    const senderChat = chatsRef.current.find(c => String(c.id) === messageChatId);
                    const senderName = senderChat ? senderChat.recipientName : "New Message";
                    setNotification({
                        sender: senderName,
                        message: newMsg.text || 'Sent an attachment',
                        visible: true
                    });
                    setTimeout(() => setNotification(prev => prev ? { ...prev, visible: false } : null), 4000);
                }
            }

            // B. UI UPDATE LOGIC
            const currentActive = activeChatRef.current;
            if (currentActive && String(newMsg.chat_id) === String(currentActive.id)) {
                setActiveChat(prev => {
                    // ✅ FIX: Improved Deduplication Logic
                    // Match if ID is same OR if it's an optimistic message with same content from me
                    const existsIndex = prev.messages.findIndex(m =>
                        m.id === newMsg.message_id ||
                        (
                            m.isOptimistic &&
                            m.senderId === newMsg.sender_uid &&
                            m.text === newMsg.text &&
                            // Allow loose match for attachment name or ignore if both are null
                            (m.attachment_name === newMsg.attachment_name || (!m.attachment_name && !newMsg.attachment_name))
                        )
                    );

                    if (existsIndex !== -1) {
                        const updatedMessages = [...prev.messages];
                        // Update the optimistic message with real server data (ID, final URL, timestamp)
                        updatedMessages[existsIndex] = {
                            ...newMsg,
                            id: newMsg.message_id,
                            senderId: newMsg.sender_uid,
                            timestamp: newMsg.created_at, // Use server timestamp now
                            isOptimistic: false
                        };
                        return { ...prev, messages: updatedMessages };
                    }
                    return {
                        ...prev, messages: [...prev.messages, {
                            ...newMsg,
                            id: newMsg.message_id,
                            senderId: newMsg.sender_uid,
                            timestamp: newMsg.created_at
                        }]
                    };
                });

                // Mark read logic...
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                axios.put(`${API_URL}/api/messages/mark-read`, {
                    chat_id: newMsg.chat_id,
                    user_firebase_uid: currentUser.uid
                }).catch(console.error);

                if (markChatRead) markChatRead(newMsg.chat_id);
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        return () => socket.off('receive_message', handleReceiveMessage);
    }, [socket, currentUser, markChatRead]);

    const playNotificationSound = () => {
        try {
            const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
            audio.play().catch(e => console.warn("Audio blocked:", e));
        } catch (error) { console.error("Audio error:", error); }
    };

    const handleSelectChat = async (chat) => {
        try {
            if (socket) socket.emit('join_chat', chat.id);
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            await axios.put(`${API_URL}/api/messages/mark-read`, {
                chat_id: chat.id,
                user_firebase_uid: currentUser.uid
            });
            if (markChatRead) markChatRead(chat.id);
            const res = await axios.get(`${API_URL}/api/messages/${chat.id}`);
            const messages = res.data.map(msg => ({
                ...msg,
                id: msg.message_id,
                senderId: msg.sender_uid,
                timestamp: msg.created_at
            }));
            setActiveChat({ ...chat, messages: messages });
        } catch (err) {
            console.error("Error loading messages:", err);
        }
    };

    // ✅ FILE UPLOAD LOGIC
    const handleSendMessage = async (text, file) => {
        if (!activeChat || (!text.trim() && !file)) return;

        let attachmentFileId = null;
        let attachmentName = null;
        let attachmentType = null;
        let attachmentPreviewUrl = null;

        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);

                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                const res = await axios.post(`${API_URL}/api/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                attachmentFileId = res.data.file_id;
                attachmentName = file.name;
                attachmentType = file.type;
                attachmentPreviewUrl = URL.createObjectURL(file);
            } catch (err) {
                console.error("Upload failed:", err);
                alert("Failed to upload file.");
                return;
            }
        }

        const optimisticMsg = {
            id: 'temp_' + Date.now(),
            text: text,
            senderId: currentUser.uid,
            timestamp: new Date().toISOString(),
            isOptimistic: true,
            attachment_url: attachmentPreviewUrl,
            attachment_type: attachmentType,
            attachment_name: attachmentName
        };

        setActiveChat(prev => ({
            ...prev,
            messages: [...prev.messages, optimisticMsg]
        }));

        if (socket) {
            socket.emit('send_message', {
                chat_id: activeChat.id,
                text: text,
                sender_firebase_uid: currentUser.uid,
                receiver_firebase_uid: activeChat.recipientId,
                attachment_file_id: attachmentFileId
            });
        }
    };

    return (
        <div className="instructor-chat-page student-chat-page">
            {notification && notification.visible && (
                <div className="notification-alert">
                    <div className="notification-icon">🔔</div>
                    <div className="notification-content">
                        <strong>{notification.sender}</strong>
                        <p>{notification.message}</p>
                    </div>
                    <button className="notification-close" onClick={() => setNotification({ ...notification, visible: false })}>×</button>
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Instructor Messages</h2>
            </div>
            <div className={`chat-container ${activeChat ? 'view-chat' : 'view-list'}`}>
                <ChatList
                    chats={chats}
                    activeChat={activeChat}
                    onSelectChat={handleSelectChat}
                    currentUser={currentUser}
                    unreadCounts={unreadCounts}
                />
                <ChatWindow
                    activeChat={activeChat}
                    currentUser={currentUser}
                    onSendMessage={handleSendMessage}
                    onBack={() => setActiveChat(null)}
                />
            </div>
        </div>
    );
};

export default InstructorChat;