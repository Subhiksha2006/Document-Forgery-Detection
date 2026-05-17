import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const AnalysisTab = ({ result }) => {
  if (!result) return null;

  const isReal = result.result?.includes('REAL');
  
  const confidenceValue = parseFloat(result.confidence);
  let smartText = "Needs review";
  if (confidenceValue >= 90) {
    smartText = "Highly reliable";
  } else if (confidenceValue >= 70) {
    smartText = "Moderate";
  }

  return (
    <div className={`glass-card p-8 min-h-[400px] flex flex-col justify-center border-t-4 ${isReal ? 'border-t-emerald-500' : 'border-t-red-500'}`}>
      
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between mb-12">
        <div className="flex-1 text-center md:text-left">
          <p className="text-slate-400 font-medium mb-2 uppercase tracking-widest text-xs">AI Assessment</p>
          <motion.h2 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-5xl md:text-6xl font-bold tracking-tight mb-2 ${isReal ? 'text-emerald-400 text-glow-green' : 'text-red-500 text-glow-red'}`}
          >
            {result.result.replace(/[^A-Za-z]/g, '').toUpperCase()} {isReal ? '✅' : '⚠'}
          </motion.h2>
        </div>
        
        <div className="flex-1 flex justify-center">
          <div className="relative">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-800"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="440"
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset: 440 - (440 * confidenceValue) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={isReal ? "text-emerald-500" : "text-red-500"}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${isReal ? 'text-emerald-400' : 'text-red-400'}`}>
                {confidenceValue.toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Confidence</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800/80">
        <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-cyan-400" />
          Analysis Confidence Rating
        </h3>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-lg bg-slate-950 border border-slate-800"
        >
          {confidenceValue >= 90 ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          ) : (
            <AlertTriangle className={`w-6 h-6 shrink-0 ${confidenceValue >= 70 ? 'text-yellow-500' : 'text-red-500'}`} />
          )}
          <div>
            <span className={`font-semibold text-lg ${confidenceValue >= 90 ? 'text-emerald-400' : confidenceValue >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
              {smartText}
            </span>
            <p className="text-slate-400 text-sm mt-1">Based on visual anomalies and structural metadata.</p>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default AnalysisTab;
