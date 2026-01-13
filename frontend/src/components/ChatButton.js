import React, { useState } from 'react';
import api from '../api/api';
import './ChatButton.css';

const ChatButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ text: "Hi! I'm your AI assistant. Ask me anything!", sender: 'bot' }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await api.post('/chat', { message: input });
            setMessages(prev => [...prev, { text: data.response, sender: 'bot' }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now.", sender: 'bot' }]);
        }
        setLoading(false);
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
                    </div>
                    <form onSubmit={sendMessage} className="chat-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me something..."
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatButton;
