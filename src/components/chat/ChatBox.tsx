import React, { useState, useRef, useEffect } from 'react';
import { Send, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Message } from '../../types';

interface ChatBoxProps {
  projectId: string;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ projectId, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  // Format message timestamp
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Project Chat</h3>
        <p className="text-sm text-gray-500">
          Discuss project details and tasks with team members
        </p>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4" style={{ maxHeight: '400px' }}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p>No messages yet</p>
            <p className="text-sm">Be the first to send a message!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isSelf = typeof message.sender !== 'string' && message.sender._id === user?._id;
            
            return (
              <div
                key={message._id}
                className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                    isSelf
                      ? 'bg-primary-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {!isSelf && (
                    <div className="font-medium text-xs mb-1">
                      {typeof message.sender === 'string'
                        ? 'Unknown User'
                        : message.sender.name}
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <div
                    className={`text-xs mt-1 text-right ${
                      isSelf ? 'text-primary-100' : 'text-gray-500'
                    }`}
                  >
                    {formatMessageTime(message.createdAt)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="input flex-grow"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="ml-2 p-2 rounded-md bg-primary-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;