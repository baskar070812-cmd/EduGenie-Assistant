import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  RotateCcw, 
  Bookmark, 
  BookmarkCheck, 
  Plus, 
  Clock, 
  BookOpen, 
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../api/chat';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { 
  loadChatMessages, 
  saveChatMessages, 
  loadSavedQuestions, 
  saveQuestionToBookmarks,
  loadUserStats,
  saveUserStats
} from '../utils/storage';

export const TutorPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(loadChatMessages());
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [savedQuestions, setSavedQuestions] = useState<string[]>(loadSavedQuestions());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const exampleQuestions = [
    "What is photosynthesis?",
    "Explain binary search in simple terms.",
    "What is the difference between TCP and UDP?",
    "Explain the Pythagoras theorem with an example."
  ];

  const recentTopics = [
    "Data Structures & BST",
    "Computer Networks (TCP/UDP)",
    "Calculus & Derivatives",
    "Photosynthesis & Chlorophyll"
  ];

  useEffect(() => {
    saveChatMessages(messages);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || loading) return;

    setError(null);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Update stats
    const stats = loadUserStats();
    stats.questionsAsked += 1;
    saveUserStats(stats);

    try {
      const response = await sendChatMessage(
        textToSend,
        messages,
        level
      );

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowups: response.suggested_followups
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (err: any) {
      setError(err.message || "Something went wrong while generating your response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Clear current conversation?")) {
      const resetMsg: ChatMessage = {
        id: `intro-${Date.now()}`,
        role: 'assistant',
        content: "New conversation started. Ask me any concept, formula, or problem you'd like simplified!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowups: exampleQuestions
      };
      setMessages([resetMsg]);
      saveChatMessages([resetMsg]);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveQuestion = (q: string) => {
    const updated = saveQuestionToBookmarks(q);
    setSavedQuestions(updated);
  };

  const handleRegenerate = () => {
    if (messages.length < 2) return;
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      handleSend(lastUserMessage.content);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-6">
      
      {/* Left Sidebar */}
      <aside className="w-full md:w-72 lg:w-80 flex-shrink-0 flex flex-col gap-4 bg-slate-900/70 border border-slate-800 rounded-3xl p-4 shadow-xl">
        
        {/* New Conversation Button */}
        <button
          onClick={handleClearChat}
          className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Conversation</span>
        </button>

        {/* Level Selector */}
        <div className="rounded-xl bg-slate-850/80 border border-slate-800 p-3">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Explanation Level
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  level === lvl
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Topics */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Recent Topics</span>
            </div>
            <div className="space-y-1">
              {recentTopics.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(`Tell me about ${topic}`)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors truncate block"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Saved Questions */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Saved Questions</span>
            </div>
            <div className="space-y-1">
              {savedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors truncate block"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleClearChat}
            className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
          <span className="text-[10px] text-slate-500">
            {messages.length} messages
          </span>
        </div>

      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>EduGenie Academic Workspace</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {level} Level
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Patience-driven, step-by-step conceptual mastery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRegenerate}
              disabled={messages.length < 2 || loading}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-40 transition-colors"
              title="Regenerate last response"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleClearChat}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div 
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 text-sm ${
                  isUser 
                    ? 'bg-indigo-600 text-white rounded-br-sm shadow-md shadow-indigo-600/10'
                    : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-tl-sm shadow-md'
                }`}>
                  
                  {/* Message Content */}
                  <div className="whitespace-pre-wrap leading-relaxed prose prose-invert max-w-none text-xs sm:text-sm">
                    {msg.content}
                  </div>

                  {/* Actions for Assistant messages */}
                  {!isUser && (
                    <div className="mt-4 pt-3 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                      <span className="text-[11px] text-slate-500">{msg.timestamp}</span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="hover:text-indigo-300 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-slate-700/50"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Follow-up suggestion chips */}
                  {!isUser && msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-700/50">
                      <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Recommended Follow-ups:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestedFollowups.map((sug, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(sug)}
                            className="text-left text-xs bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/30 rounded-xl px-3 py-1.5 transition-colors"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold flex-shrink-0">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Animation */}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl rounded-tl-sm p-4 text-xs text-indigo-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span>EduGenie is thinking... formulating a clear explanation</span>
              </div>
            </div>
          )}

          {error && (
            <ErrorMessage 
              message={error} 
              onRetry={() => {
                const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
                if (lastUserMessage) handleSend(lastUserMessage.content);
              }} 
            />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar & Suggestion Chips */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3">
          
          {/* Quick Prompt Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex-shrink-0">
              Try:
            </span>
            {exampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 text-xs transition-colors flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Textarea Input */}
          <div className="relative rounded-2xl bg-slate-900 border border-slate-700/80 focus-within:border-indigo-500 shadow-inner">
            <textarea
              ref={textareaRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask EduGenie anything about your studies... (Enter to send, Shift+Enter for new line)"
              className="w-full bg-transparent px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none"
            />
            <div className="flex items-center justify-between px-3 py-2 border-t border-slate-800/60 text-xs text-slate-500">
              <span>Press <kbd className="bg-slate-800 px-1 py-0.5 rounded text-[10px]">Enter</kbd> to send</span>
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
};
