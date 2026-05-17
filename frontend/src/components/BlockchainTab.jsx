import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Zap, Server } from 'lucide-react';
import { motion } from 'framer-motion';

const BlockchainTab = ({ result }) => {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = () => {
    if (result.hash) {
      navigator.clipboard.writeText(result.hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusDisplay = () => {
    if (result.blockchain_status === 'already_exists') {
      return {
        label: 'Already Verified',
        icon: <Zap className="w-6 h-6 text-cyan-400" />,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/30'
      };
    }
    return {
      label: 'Stored on Blockchain',
      icon: <Server className="w-6 h-6 text-emerald-400" />,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30'
    };
  };

  const status = getStatusDisplay();

  return (
    <div className="glass-card p-8 min-h-[400px] flex flex-col justify-center">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${status.border} ${status.bg} border-glow-${status.color === 'text-emerald-400' ? 'green' : 'cyan'}`}
        >
          <div className="mb-3">
            {status.icon}
          </div>
          <h3 className={`text-xl font-bold ${status.color} mb-1 flex items-center gap-2`}>
            {status.label}
            {result.blockchain_status !== 'already_exists' && <ShieldCheck className="w-5 h-5" />}
          </h3>
          <p className="text-slate-400 text-sm">Status</p>
        </motion.div>

        {/* Verified Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${result.blockchain_verified ? 'border-glow-green bg-emerald-500/5' : 'border-glow-red bg-red-500/5'} `}
        >
          <div className="mb-3">
            {result.blockchain_verified ? (
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-red-400" />
            )}
          </div>
          <h3 className={`text-xl font-bold ${result.blockchain_verified ? 'text-emerald-400' : 'text-red-400'} mb-1`}>
            {result.blockchain_verified ? 'Verified' : 'Unverified'}
          </h3>
          <p className="text-slate-400 text-sm">Authenticity Check</p>
        </motion.div>

      </div>

      {/* Hash Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-slate-300 font-medium text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Cryptographic Hash (SHA-256)
          </h4>
          <button 
            onClick={handleCopy}
            disabled={!result.hash}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors border border-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Hash</span>
              </>
            )}
          </button>
        </div>
        
        <div className="bg-[#050505] p-4 rounded-xl border border-slate-800/80 overflow-x-auto no-scrollbar">
          <code className="text-emerald-400/90 font-mono text-sm whitespace-nowrap">
            {result.hash || 'N/A'}
          </code>
        </div>
      </motion.div>

    </div>
  );
};

export default BlockchainTab;
