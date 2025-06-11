
import React from 'react';
import { ChatMessage, MessageSender } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface ChatMessageProps {
  message: ChatMessage;
}

const ChatMessageItem: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          p-3 rounded-xl max-w-lg lg:max-w-xl xl:max-w-2xl shadow-md
          ${isUser
            ? 'bg-sky-600 text-white rounded-br-none'
            : 'bg-slate-700 text-slate-100 rounded-bl-none'}
        `}
      >
        <p className="whitespace-pre-wrap break-words text-sm md:text-base">{message.text}</p>
        {message.sender === MessageSender.AI && message.isStreaming && (
          <div className="mt-2 flex items-center">
            <LoadingSpinner size="sm" color="text-sky-300" />
            <span className="ml-2 text-xs text-slate-400">Yanto is typing...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageItem;
