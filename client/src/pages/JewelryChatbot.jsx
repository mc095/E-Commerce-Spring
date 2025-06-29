import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const JewelryChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I’m your jewelry assistant. Ask me anything about rings, necklaces, earrings, or other jewelry!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const updatedMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: 'system',
              content: 'You are a jewelry expert assistant for an e-commerce platform. Provide accurate, helpful, and concise information about jewelry, including types (rings, necklaces, earrings, bangles), materials (gold, silver, diamonds), styles (traditional, contemporary, vintage, minimalist), care tips, and trends. Only respond to jewelry-related queries. If the user asks about unrelated topics, politely redirect them to jewelry topics. Keep responses under 100 words.'
            },
            ...updatedMessages
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch response from Groq API');

      const data = await response.json();
      const botResponse = data.choices[0]?.message?.content || 'Sorry, I couldn’t process that. Please ask about jewelry!';

      setMessages((prev) => [...prev, { role: 'assistant', content: botResponse }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Oops, something went wrong. Please try asking about jewelry again!'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chatbot Toggle Button */}
      <button
        onClick={toggleChatbot}
        className="bg-amber-600 text-white rounded-full p-4 shadow-lg hover:bg-amber-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
        aria-label="Toggle chatbot"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 h-[500px] flex flex-col border border-gray-100 animate-slide-in-right mt-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <h3 className="text-lg font-light tracking-wide">Jewelry Assistant</h3>
            <button
              onClick={toggleChatbot}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close chatbot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-amber-100 text-gray-900'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-500 italic">Typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about jewelry..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-amber-600 text-white p-2 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-amber-400"
                disabled={isLoading}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default JewelryChatbot;
