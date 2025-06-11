
import React from 'react';

export const GEMINI_MODEL_NAME = "gemini-2.5-flash-preview-04-17";
export const SYSTEM_PROMPT = "You are Yanto.Ai, a helpful and friendly AI assistant. Engage in clear and concise conversation, providing informative and insightful responses. Be creative when appropriate and keep your responses relatively brief unless asked for detail.";
export const APP_TITLE = "Yanto.Ai";

export const SendIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.53l4.093-1.023a.75.75 0 01.53.95l-1.414 4.949a.75.75 0 00.95.826l12.086-3.021a.75.75 0 000-1.39L3.105 2.289z" />
  </svg>
);

export const WarningIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);
