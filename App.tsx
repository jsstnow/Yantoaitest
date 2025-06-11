
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { ChatMessage, MessageSender } from './types';
import { GEMINI_MODEL_NAME, SYSTEM_PROMPT, APP_TITLE } from './constants';
import ChatMessageItem from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ApiKeyMissingBanner from './components/ApiKeyMissingBanner';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const chatRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const currentAiMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    const initializeChat = async () => {
      setIsInitializing(true);
      setError(null);
      if (!process.env.API_KEY) {
        console.error("API_KEY environment variable is not set.");
        setError("API_KEY environment variable is not set. Please configure it to use the chat.");
        setApiKeyMissing(true);
        setIsInitializing(false);
        return;
      }

      try {
        const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatRef.current = genAI.chats.create({
          model: GEMINI_MODEL_NAME,
          config: {
            systemInstruction: SYSTEM_PROMPT,
          },
        });
        setMessages([
          {
            id: 'initial-ai-greeting',
            text: `Hello! I'm ${APP_TITLE}. How can I help you today?`,
            sender: MessageSender.AI,
            timestamp: Date.now(),
          }
        ]);
      } catch (err) {
        console.error("Failed to initialize Gemini AI:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during AI initialization.";
        setError(`Failed to initialize AI: ${errorMessage}`);
        setApiKeyMissing(true); // Treat initialization errors as API key issues for UI
      } finally {
        setIsInitializing(false);
      }
    };

    initializeChat();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (inputText: string) => {
    if (!chatRef.current || isLoading || apiKeyMissing) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text: inputText,
      sender: MessageSender.USER,
      timestamp: Date.now(),
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    const aiMessageId = `ai-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    currentAiMessageIdRef.current = aiMessageId;

    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: aiMessageId,
        text: '',
        sender: MessageSender.AI,
        isStreaming: true,
        timestamp: Date.now(),
      },
    ]);

    try {
      if (!chatRef.current) { // Check again, though unlikely due to initial check
        throw new Error("Chat session not initialized.");
      }
      const stream = await chatRef.current.sendMessageStream({ message: inputText });

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === aiMessageId ? { ...msg, text: msg.text + chunkText } : msg
          )
        );
      }
    } catch (err) {
      console.error("Error sending message to Gemini:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`AI Error: ${errorMessage}`);
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== aiMessageId)); // Remove placeholder
       setMessages(prevMessages => [
        ...prevMessages,
        {
          id: `ai-error-${Date.now()}`,
          text: `Sorry, I encountered an error: ${errorMessage}`,
          sender: MessageSender.AI,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
        )
      );
      currentAiMessageIdRef.current = null;
      setIsLoading(false);
    }
  }, [isLoading, apiKeyMissing]);

  if (isInitializing) {
    return (
      <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-lg">Initializing Yanto.Ai...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans">
      <header className="bg-slate-800 p-4 text-center shadow-lg sticky top-0 z-20">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-cyan-300 text-transparent bg-clip-text">
          {APP_TITLE}
        </h1>
      </header>

      {apiKeyMissing && <ApiKeyMissingBanner message={error || undefined} />}
      
      {error && !apiKeyMissing && ( // Show general errors if API key is not the primary issue shown
        <div className="bg-red-700 text-red-100 p-3 text-center text-sm">
          {error}
        </div>
      )}

      <main ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        {messages.map(msg => (
          <ChatMessageItem key={msg.id} message={msg} />
        ))}
        {isLoading && !currentAiMessageIdRef.current && /* Show general loading if not streaming into specific message yet */ (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        )}
      </main>

      <footer className="sticky bottom-0 z-20">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} disabled={apiKeyMissing || isInitializing} />
      </footer>
    </div>
  );
};

export default App;
