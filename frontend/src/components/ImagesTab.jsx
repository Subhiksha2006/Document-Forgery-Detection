import React, { useState } from 'react';
import FullScreenViewer from './FullScreenViewer';
import { motion } from 'framer-motion';

const ImagesTab = ({ result, originalImage }) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  if (!result) return null;

  const elaUrl = result.ela_image;

  const openViewer = (url) => {
    setSelectedImage(url);
    setViewerOpen(true);
  };

  return (
    <div className="glass-card p-6 min-h-[400px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        
        {/* Original Image */}
        <div className="flex flex-col group">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-widest">Original Document</h3>
          </div>
          <div 
            onClick={() => openViewer(originalImage)}
            className="cursor-pointer relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex-1 min-h-[300px] hover:border-glow-cyan transition-colors duration-300"
          >
            <motion.img 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src={originalImage} 
              alt="Original Document" 
              className="absolute inset-0 w-full h-full object-contain p-2"
            />
            <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
               <span className="bg-slate-900/80 text-white px-4 py-2 rounded-lg backdrop-blur text-sm border border-slate-700 pointer-events-none">Click to view fullscreen</span>
            </div>
          </div>
        </div>

        {/* ELA Image */}
        <div className="flex flex-col group">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              ELA Analysis
            </h3>
          </div>
          <div 
            onClick={() => openViewer(elaUrl)}
            className="cursor-pointer relative bg-slate-950 rounded-xl border border-cyan-500/50 border-glow-green overflow-hidden flex-1 min-h-[300px] hover:border-cyan-400 transition-colors duration-300"
          >
            <motion.img 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src={elaUrl} 
              alt="ELA Output" 
              className="absolute inset-0 w-full h-full object-contain p-2 mix-blend-screen"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'https://via.placeholder.com/400x300/1e293b/94a3b8?text=ELA+Image+Not+Found';
              }}
            />
            <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
               <span className="bg-slate-900/80 text-white px-4 py-2 rounded-lg backdrop-blur text-sm border border-slate-700 pointer-events-none">Click to view fullscreen</span>
            </div>
          </div>
        </div>

      </div>

      <FullScreenViewer 
        isOpen={viewerOpen} 
        imageUrl={selectedImage} 
        onClose={() => setViewerOpen(false)} 
      />
    </div>
  );
};

export default ImagesTab;
