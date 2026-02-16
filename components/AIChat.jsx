/**
 * AI Chat Component for the Todo Chatbot
 * Supports English, Roman Urdu, and Urdu messages
 */
import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../lib/api-client';
import '../styles/AIChat.css';

const AIChat = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Call backend Cohere AI endpoint
      const data = await apiClient.post('/chat/conversation', { message: inputValue });

      const aiMessage = {
        id: Date.now() + 1,
        text: data.response_text || data.response || "Sorry, I couldn't understand that.",
        sender: 'ai',
        timestamp: new Date().toISOString(),
        toolCalls: data.tool_calls || []
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError(`Failed to send message: ${err.message}`);
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <h3>AI Todo Assistant</h3>
        <p>Manage your tasks with natural language (English, Roman Urdu, Urdu)</p>
      </div>

      <div className="ai-chat-messages">
        {messages.length === 0 ? (
          <div className="ai-welcome-message">
            <p>Hello! I'm your AI assistant. You can ask me to:</p>
            <ul>
              <li>Add tasks: "Add a task to buy groceries" / "Naya task bnaye" / "Naye kaam add karo"</li>
              <li>List tasks: "Show me my tasks" / "Tasks dekhao" / "Mujhe dikhaiye"</li>
              <li>Complete tasks: "Complete task #1" / "Task 1 ho gaya"</li>
              <li>Update tasks: "Update task #2 to include more details" / "Task 2 ka naam badal do"</li>
              <li>Delete tasks: "Delete task #3" / "Task 3 hatado"</li>
            </ul>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`ai-message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
            >
              <div className="message-content">
                <span className="sender">{message.sender === 'user' ? 'You' : 'AI Assistant'}</span>
                <p className="message-text">{message.text}</p>

                {message.toolCalls && message.toolCalls.length > 0 && (
                  <div className="tool-calls">
                    <small>Tools used:</small>
                    <ul>
                      {message.toolCalls.map((toolCall, index) => (
                        <li key={index}>
                          {toolCall.tool_name || toolCall.function?.name}({JSON.stringify(toolCall.arguments || toolCall.function?.arguments)})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="ai-message ai-loading">
            <div className="message-content">
              <span className="sender">AI Assistant</span>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="ai-chat-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask me to manage your tasks..."
          disabled={isLoading}
          className="ai-chat-input"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="ai-send-button"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AIChat;
