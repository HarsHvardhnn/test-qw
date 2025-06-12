import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronRight, X } from 'lucide-react';
import { GlassmorphicButton } from './GlassmorphicButton';
import { QwilloLogo } from './QwilloLogo';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface QwilloAIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QwilloAIChat: React.FC<QwilloAIChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm Qwillo AI, your personal assistant. I can help you with any questions about your project. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I understand you're interested in kitchen remodeling. Based on the topics we've covered, I can help you explore different cabinet styles, countertop materials, or discuss specific layout considerations. What aspect would you like to focus on?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`fixed top-0 right-0 h-full w-80 transform transition-transform duration-300 z-50 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="h-full bg-black/80 border-l border-white/10 rounded-l-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center">
            <div className="w-5 h-5 mr-2">
              <QwilloLogo variant="icon" />
            </div>
            <h3 className="text-white font-semibold">Qwillo AI</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${
                message.type === 'user'
                  ? 'bg-blue-400/20 text-white'
                  : 'bg-white/10 text-gray-300'
              } rounded-lg p-3 space-y-1`}>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-gray-400">{formatTime(message.timestamp)}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Qwillo AI..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-4 pr-12 py-3 text-white placeholder-gray-500 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
              rows={2}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`absolute right-2 bottom-2 p-2 rounded-lg transition-colors ${
                input.trim()
                  ? 'text-blue-400 hover:bg-white/10'
                  : 'text-gray-600 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};