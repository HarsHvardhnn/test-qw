import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, FileText } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [messageInput, setMessageInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [verificationLink, setVerificationLink] = useState<string | null>(null);
  const [verificationType, setVerificationType] = useState<string | null>(null);

  useEffect(() => {
    // Check for verification link in localStorage
    const storedLink = localStorage.getItem('verificationLink');
    const storedType = localStorage.getItem('verificationType');
    if (storedLink && storedType) {
      setVerificationLink(storedLink);
      setVerificationType(storedType);
      // Clear localStorage
      localStorage.removeItem('verificationLink');
      localStorage.removeItem('verificationType');
    }
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (messageInput.trim() || verificationLink) {
      let finalMessage = messageInput.trim();
      
      // Append verification link with proper formatting
      if (verificationLink) {
        if (finalMessage) {
          finalMessage += '\n\n'; // Add spacing if there's existing message content
        }
        finalMessage += `[${verificationType?.toUpperCase()} VERIFICATION]\n${verificationLink}`;
      }
      
      onSendMessage(finalMessage);
      setMessageInput('');
      setVerificationLink(null);
      setVerificationType(null);
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

  const removeVerificationLink = () => {
    setVerificationLink(null);
    setVerificationType(null);
  };

  return (
    <div className="px-4 py-3 border-t border-gray-200 bg-white">
      {/* Verification Link Display */}
      {verificationLink && (
        <div className="mb-2">
          <div className="flex items-center p-2 bg-gray-50 rounded-lg border border-gray-200">
            <FileText className="w-4 h-4 text-blue-500 mr-2" />
            <span className="text-sm text-gray-700 flex-1">
              {verificationType?.charAt(0).toUpperCase()}{verificationType?.slice(1)} Verification
            </span>
            <button
              onClick={removeVerificationLink}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={verificationLink ? "Add a message (optional)..." : "Type a message..."}
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
          disabled={!messageInput.trim() && !verificationLink}
          className={`p-2 rounded-full ${
            messageInput.trim() || verificationLink
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