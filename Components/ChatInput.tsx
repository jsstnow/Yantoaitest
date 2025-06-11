
import React, { useState, KeyboardEvent } from 'react';
import { SendIcon } from '../constants';
import LoadingSpinner from './LoadingSpinner';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, disabled = false }) => {
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim() && !isLoading && !disabled) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-start p-3 bg-slate-800 border-t border-slate-700">
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={disabled ? "Chat unavailable" : "Type your message to Yanto.Ai..."}
        className="flex-grow p-3 bg-slate-700 text-slate-100 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
        rows={Math.min(3, inputText.split('\n').length)}
        disabled={isLoading || disabled}
      />
      <button
        onClick={handleSend}
        disabled={isLoading || disabled || !inputText.trim()}
        className="ml-3 p-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center h-[48px] w-[48px] aspect-square"
        aria-label="Send message"
      >
        {isLoading ? <LoadingSpinner size="sm" color="text-white" /> : <SendIcon />}
      </button>
    </div>
  );
};

export default ChatInput;
