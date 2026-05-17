import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Image as ImageIcon, FileText, Link as LinkIcon } from 'lucide-react';
import AnalysisTab from './AnalysisTab';
import ImagesTab from './ImagesTab';
import OCRTab from './OCRTab';
import BlockchainTab from './BlockchainTab';

const Tabs = ({ activeTab, setActiveTab, result, originalImage }) => {
  const tabs = [
    { id: 'analysis', label: 'Analysis', icon: Brain },
    { id: 'images', label: 'ELA', icon: ImageIcon },
    { id: 'ocr', label: 'OCR Text', icon: FileText },
    { id: 'blockchain', label: 'Blockchain', icon: LinkIcon },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex bg-slate-900/80 backdrop-blur-md rounded-xl p-2 border border-slate-800 gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all relative whitespace-nowrap ${
                isActive 
                  ? 'text-white' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : ''}`} />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-slate-800 rounded-lg -z-10 border border-slate-700/50 shadow-sm"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === 'analysis' && <AnalysisTab result={result} />}
            {activeTab === 'images' && <ImagesTab result={result} originalImage={originalImage} />}
            {activeTab === 'ocr' && <OCRTab result={result} />}
            {activeTab === 'blockchain' && <BlockchainTab result={result} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tabs;
