import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  Trash2, 
  Clock, 
  TrendingDown, 
  CheckCircle2, 
  ListOrdered,
  FileCheck
} from 'lucide-react';
import { SummaryData } from '../types';
import { summarizeTextApi } from '../api/summarize';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { DEMO_SUMMARY } from '../utils/demoData';

export const SummarizerPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'detailed' | 'bullet_points'>('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [copied, setCopied] = useState(false);

  // Compute word and character count
  const charCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  const sampleEducationalText = `Computer networks rely on layered architectures (most notably the TCP/IP and OSI models) to abstract the immense physical complexity of transmitting electrical and optical signals across global distances.

At the transport layer, TCP (Transmission Control Protocol) provides a connection-oriented, guaranteed-delivery service through a three-way handshake (SYN, SYN-ACK, ACK), sequence tracking, flow control, and automatic packet retransmission. In contrast, UDP (User Datagram Protocol) provides connectionless, best-effort datagram delivery with near-zero latency overhead, making it the bedrock for real-time applications such as video conferencing, DNS resolution, and online gaming.

Modern protocols like QUIC (which underpins HTTP/3) merge the low-latency speed of UDP with built-in encryption and transport reliability, illustrating how networking protocols continually evolve to meet higher bandwidth and security demands. Understanding the trade-offs between transport latency and packet reliability is a cornerstone of modern software architecture.`;

  const handleSummarize = async () => {
    if (!inputText.trim() || inputText.length < 10) {
      setError("Please paste at least 10 characters of educational text to summarize.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await summarizeTextApi({
        text: inputText,
        summary_length: summaryLength,
        format: summaryLength === 'bullet_points' ? 'bullet_points' : 'standard',
      });
      setSummaryData(data);
    } catch (err: any) {
      setError(err.message || "Failed to summarize text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!summaryData) return;
    const textToCopy = `${summaryData.summary}\n\nKey Takeaways:\n${summaryData.key_takeaways.map(t => `• ${t}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!summaryData) return;
    const content = `# EduGenie Summary\n\n${summaryData.summary}\n\n## Key Takeaways\n${summaryData.key_takeaways.map(t => `- ${t}`).join('\n')}\n\n---\nOriginal Words: ${summaryData.original_word_count} | Summary Words: ${summaryData.summary_word_count} | Compression: ${summaryData.compression_ratio}%\nGenerated with ${summaryData.model_used}`;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edugenie-summary-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePasteSample = () => {
    setInputText(sampleEducationalText);
    setError(null);
  };

  const handleClear = () => {
    setInputText('');
    setSummaryData(null);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>Intelligent Condensation Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Text Summarizer
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Convert long educational material, research papers, and textbook notes into crisp summaries and key takeaways.
        </p>
      </div>

      {/* Two-Column Document Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Source Input */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col shadow-xl space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Source Educational Content</span>
              </h2>
              <span className="text-[11px] text-slate-400">
                Textbooks, articles, or lecture notes
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePasteSample}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 transition-colors"
              >
                Insert Sample
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                title="Clear input"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Length & Format Options */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Summary Depth & Format
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'short', label: 'Short' },
                { id: 'medium', label: 'Medium' },
                { id: 'detailed', label: 'Detailed' },
                { id: 'bullet_points', label: 'Bullet Points' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSummaryLength(opt.id as any)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                    summaryLength === opt.id
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              rows={13}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your study material, article, notes, or textbook content here..."
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-2xl p-4 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed shadow-inner"
            />
          </div>

          {/* Counts & Submit */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{charCount} characters</span>
            </div>

            <button
              onClick={handleSummarize}
              disabled={loading || wordCount === 0}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Summarize Content</span>
            </button>
          </div>

        </div>

        {/* Right Column: AI Generated Summary */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col shadow-xl space-y-5 min-h-[480px]">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>AI-Generated Summary</span>
              </h2>
              <span className="text-[11px] text-slate-400">
                Essential insights & structured key takeaways
              </span>
            </div>

            {summaryData && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySummary}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
                  title="Download as Markdown"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
                <button
                  onClick={handleSummarize}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                  title="Regenerate"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <LoadingState 
              message="Analyzing your content..." 
              subMessage="Filtering noise, extracting key arguments, and distilling takeaways"
              iconType="summary"
            />
          )}

          {/* Error Message */}
          {error && (
            <ErrorMessage message={error} onRetry={handleSummarize} />
          )}

          {/* Empty State */}
          {!loading && !summaryData && !error && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 my-auto">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center mb-4 text-slate-500">
                <FileCheck className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-semibold text-slate-300 mb-1">
                Your AI summary will appear here
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mb-4">
                Paste study text on the left, select your preferred length, and click Summarize Content.
              </p>
              <button
                onClick={() => setSummaryData(DEMO_SUMMARY)}
                className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium"
              >
                Preview with sample networking summary
              </button>
            </div>
          )}

          {/* Summary Display */}
          {summaryData && !loading && (
            <div className="space-y-5 animate-fade-in">
              
              {/* Metrics Bar */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Reduction</div>
                  <div className="text-base font-extrabold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>{summaryData.compression_ratio}%</span>
                  </div>
                </div>
                <div className="border-x border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Words</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {summaryData.summary_word_count} <span className="text-xs text-slate-500">/ {summaryData.original_word_count}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Reading Time</div>
                  <div className="text-base font-bold text-indigo-400 flex items-center justify-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{summaryData.reading_time_minutes} min</span>
                  </div>
                </div>
              </div>

              {/* Main Summary Text */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/50 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {summaryData.summary}
              </div>

              {/* Key Takeaways */}
              {summaryData.key_takeaways && summaryData.key_takeaways.length > 0 && (
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2.5">
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Core Key Takeaways</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {summaryData.key_takeaways.map((point, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-[11px] text-slate-500 text-right">
                Processed via {summaryData.model_used}
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
