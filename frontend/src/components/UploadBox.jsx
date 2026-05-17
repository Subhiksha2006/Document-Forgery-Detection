import React, { useCallback } from 'react';
import { UploadCloud, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const UploadBox = ({ file, previewUrl, onFileChange, onAnalyze, selectedLanguage, onLanguageChange }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 flex flex-col items-center justify-center w-full min-h-[400px]"
    >
      <div className="w-full flex-1 mb-8 flex flex-col">
        <label className="text-slate-300 font-medium mb-2 text-sm uppercase tracking-wide">Select Document Language</label>
        <select 
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="w-full sm:w-64 bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
        >
          <option value="eng">English (eng)</option>
          <option value="tam">Tamil (tam)</option>
          <option value="hin">Hindi (hin)</option>
          <option value="mal">Malayalam (mal)</option>
          <option value="tel">Telugu (tel)</option>
          <option value="multi">Multilingual (multi)</option>
        </select>
      </div>

      {!file ? (
        <div 
          className="w-full flex-1 border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-900/30 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-800/30 group py-12"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <div className="p-4 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors mb-4 group-hover:scale-110 duration-300">
            <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-emerald-400 transition-colors" />
          </div>
          <h3 className="text-xl font-medium mb-2 text-slate-200">Drag & drop your file here</h3>
          <p className="text-slate-500 mb-6">Support for images and documents</p>
          <span className="px-6 py-2 rounded-full bg-slate-800 text-sm font-medium text-slate-300 pointer-events-none group-hover:bg-slate-700">
            Browse Files
          </span>
          <input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            onChange={handleChange}
            accept="image/*" 
          />
        </div>
      ) : (
        <div className="w-full flex flex-col items-center w-full max-w-2xl py-4">
          <div className="relative w-full h-64 mb-6 rounded-xl overflow-hidden border border-slate-700 group bg-slate-950/50">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-contain bg-slate-950/80"
            />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(null);
              }}
              className="absolute top-4 right-4 bg-red-500/80 hover:bg-red-600 backdrop-blur text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Remove
            </button>
          </div>
          <div className="flex items-center gap-2 mb-8 text-emerald-400 text-sm bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20 w-full justify-center">
            <CheckCircle2 className="w-4 h-4" />
            <span className="truncate max-w-[200px]">{file.name} ready for analysis</span>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAnalyze}
            className="w-full py-4 text-lg font-medium bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2"
          >
            Start Forensic Analysis
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default UploadBox;
