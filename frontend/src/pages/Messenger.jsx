import React, { useState } from 'react';
import { Search, Phone, Video, MoreVertical, Paperclip, Send } from 'lucide-react';
import styles from './Messenger.module.css';
import Sidebar from '../components/Sidebar';

const Messenger = () => {
    const [selectedChat, setSelectedChat] = useState('john-carlio');
    const [messageInput, setMessageInput] = useState('');

    const contacts = [
        {
            id: 'shelby-goode',
            name: 'Shelby Goode',
            message: 'Lorem ipsum is simply dummy text of the printing',
            time: '1 min ago',
            avatar: '👩‍💼',
            online: true
        },
        {
            id: 'robert-bacins',
            name: 'Robert Bacins',
            message: 'Lorem ipsum is simply dummy text of the printing',
            time: '6 min ago',
            avatar: '👨‍💼',
            online: false
        },
        {
            id: 'john-carlio',
            name: 'John Carlio',
            message: 'Lorem ipsum is simply dummy text of the printing',
            time: '15 min ago',
            avatar: '👨‍🎨',
            online: true
        },
        {
            id: 'adriene-watson',
            name: 'Adriene Watson',
            message: 'Lorem ipsum is simply dummy text of the printing',
            time: '23 min ago',
            avatar: '👩‍💻',
            online: true
        },
        {
            id: 'jhon-deo',
            name: 'Jhon Deo',
            message: 'Lorem ipsum is simply dummy text of the printing',
            time: '29 min ago',
            avatar: '👨‍🔬',
            online: false
        },
        {
            id: 'mark-ruffalo',
            name: 'Mark Ruffalo',
            message: 'Lorem ipsum is simply dummy text of the printing',
            time: '45 min ago',
            avatar: '👨‍🚀',
            online: false
        },
        {
            id: 'bethany-jackson',
            name: 'Bethany Jackson',
            message: 'Lorem ipsum is simply dummy text of the printing',
            time: '1h ago',
            avatar: '👩‍🎓',
            online: true
        }
    ];

    const messages = [
        {
            id: 1,
            text: 'Lorem ipsum is simply',
            sender: 'other',
            time: '09:02 PM'
        },
        {
            id: 2,
            text: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
            sender: 'other',
            time: '09:02 PM'
        },
        {
            id: 3,
            text: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.',
            sender: 'me',
            time: '09:04 PM',
            hasAttachment: true
        }
    ];

    const currentContact = contacts.find(c => c.id === selectedChat);

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            setMessageInput('');
        }
    };

    return (
        <div className={styles.messenger}>
            <Sidebar />
            <div className={styles.chatContainer}>
                {/* Sidebar */}
                <div className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <h2 className={styles.sidebarTitle}>Messenger</h2>
                    </div>

                    <div className={styles.searchContainer}>
                        <div className={styles.searchBox}>
                            <Search size={16} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search"
                                className={styles.searchInput}
                            />
                        </div>
                    </div>

                    <div className={styles.contactsList}>
                        {contacts.map((contact) => (
                            <div
                                key={contact.id}
                                className={`${styles.contactItem} ${selectedChat === contact.id ? styles.contactActive : ''
                                    }`}
                                onClick={() => setSelectedChat(contact.id)}
                            >
                                <div className={styles.contactAvatarContainer}>
                                    <div className={styles.contactAvatar}>{contact.avatar}</div>
                                </div>
                                <div className={styles.contactInfo}>
                                    <div className={styles.contactName}>{contact.name}</div>
                                    <div className={styles.contactMessage}>{contact.message}</div>
                                </div>
                                <div className={styles.contactTime}>{contact.time}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={styles.chatArea}>
                    <div className={styles.chatHeader}>
                        <div className={styles.chatContactInfo}>
                            <div className={styles.chatAvatarContainer}>
                                <div className={styles.chatAvatar}>{currentContact?.avatar}</div>
                            </div>
                            <div className={styles.chatContactName}>
                                {currentContact?.name}
                            </div>
                        </div>
                        <div className={styles.chatActions}>
                            <button className={styles.chatActionBtn}>
                                <Phone size={20} />
                            </button>
                            <button className={styles.chatActionBtn}>
                                <Video size={20} />
                            </button>
                            <button className={styles.chatActionBtn}>
                                <MoreVertical size={20} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.messagesContainer}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`${styles.message} ${message.sender === 'me'
                                    ? styles.messageSent
                                    : styles.messageReceived
                                    }`}
                            >
                                {message.sender === 'other' && (
                                    <div className={styles.messageAvatar}>
                                        {currentContact?.avatar}
                                    </div>
                                )}
                                <div className={styles.messageContent}>
                                    <div className={styles.messageBubble}>
                                        {message.text}
                                        {message.hasAttachment && (
                                            <div className={styles.messageAttachments}>
                                                <div className={styles.attachment}>
                                                    <div className={styles.attachmentPreview}>📊</div>
                                                    <span>Dashboard.png</span>
                                                </div>
                                                <div className={styles.attachment}>
                                                    <div className={styles.attachmentPreview}>⚙️</div>
                                                    <span>Settings.png</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.messageTime}>{message.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.messageInputContainer}>
                        <button className={styles.inputActionBtn}>
                            <Paperclip size={20} />
                        </button>
                        <div className={styles.messageInputWrapper}>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                className={styles.messageInput}
                            />
                        </div>
                        <button className={styles.sendBtn} onClick={handleSendMessage}>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messenger;