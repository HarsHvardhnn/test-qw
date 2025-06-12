import React, { useState, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [messageInput, setMessageInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput('');
    }
  };

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file upload logic here
    console.log('File selected:', e.target.files);
    // Reset the input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="px-4 py-3 border-t border-gray-200 bg-white">
      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          <div className="absolute right-2 bottom-2 flex space-x-1">
            <button
              onClick={handleAttachFile}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Paperclip className="h-5 w-5 text-gray-500" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <button
          onClick={handleSend}
          disabled={!messageInput.trim()}
          className={`p-2 rounded-full ${
            messageInput.trim()
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          } transition-colors`}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};