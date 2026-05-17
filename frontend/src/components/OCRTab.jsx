import React from 'react';
import { Terminal } from 'lucide-react';

const OCRTab = ({ result }) => {
  if (!result || !result.extracted_text) {
    return (
      <div className="glass-card p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
        <Terminal className="w-12 h-12 text-slate-500 mb-4" />
        <h3 className="text-xl font-medium text-slate-300">No Text Extracted</h3>
        <p className="text-slate-500 max-w-md mt-2">
          The forensic AI could not extract any readable text from this document.
        </p>
      </div>
    );
  }

  // Clean extra newlines
  const cleanText = result.extracted_text.replace(/\n{3,}/g, '\n\n').trim();

  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (cleanText) {
      navigator.clipboard.writeText(cleanText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass-card flex flex-col min-h-[400px]">
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Text_Extraction_Terminal</span>
        </div>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors border border-slate-700"
        >
          {copied ? (
            <span className="text-emerald-400 flex items-center gap-1.5">Copied!</span>
          ) : (
            <span>Copy Text</span>
          )}
        </button>
      </div>
      
      <div className="p-4 flex-1">
        <div className="bg-[#050505] rounded-xl p-6 h-full min-h-[300px] max-h-[500px] overflow-y-auto border border-slate-800/50 shadow-inner">
          <pre className="text-emerald-400 font-mono text-sm whitespace-pre-wrap leading-relaxed">
            {cleanText}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default OCRTab;
