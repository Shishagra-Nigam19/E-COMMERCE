import React, { useState, useRef, useEffect } from 'react';
import api from '../api/api';
import './ChatButton.css';

const ChatButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ text: "Hi! I'm your AI assistant. Ask me anything about our products!", sender: 'bot' }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const suggestions = [
        "Track my order",
        "Best laptops under $1000",
        "Do you have iPhones?",
        "Return policy"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = async (text) => {
        if (!text.trim()) return;

        const userMsg = { text: text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await api.post('/chat', { message: text });
            setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now.", sender: 'bot' }]);
        }
        setLoading(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleSend(input);
    };

    return (
        <div className="chat-widget">
            <button className="chat-toggle" onClick={toggleChat}>
                {isOpen ? '✕' : '💬'}
            </button>
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">Store Assistant</div>
                    <div className="chat-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {loading && <div className="message bot">Typing...</div>}
                        <div ref={messagesEndRef} />

                        {messages.length < 3 && (
                            <div className="suggestions">
                                {suggestions.map((s, i) => (
                                    <button key={i} onClick={() => handleSend(s)} className="suggestion-chip">
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <form onSubmit={onSubmit} className="chat-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me something..."
                        />
                        <button type="submit" disabled={loading}>Send</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatButton;
