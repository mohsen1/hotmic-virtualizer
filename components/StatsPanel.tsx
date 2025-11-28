import React from 'react';
import { AudioStats, Theme } from '../types';

interface StatsPanelProps {
  stats: AudioStats;
  theme: Theme;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats, theme }) => {
  // Normalize stats for display
  const energyPercent = Math.min(100, (stats.rms / 255) * 100);
  const isDark = theme === 'dark';
  
  return (
    <div className={`absolute top-4 right-4 w-64 backdrop-blur-md border rounded-lg p-4 font-mono text-xs pointer-events-none select-none transition-colors duration-300
      ${isDark ? 'bg-black/50 border-white/10 text-gray-300' : 'bg-white/50 border-black/10 text-gray-800'}
    `}>
      <div className="flex justify-between items-center mb-2">
        <span className="uppercase tracking-widest opacity-50">Signal Analysis</span>
        <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] text-red-400">LIVE</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-1">
            <span>RMS (Energy)</span>
            <span>{stats.rms.toFixed(1)}</span>
          </div>
          <div className={`h-1 w-full rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <div 
                className={`h-full transition-all duration-75 ${isDark ? 'bg-white' : 'bg-black'}`}
                style={{ width: `${energyPercent}%` }} 
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span>Peak Bin</span>
            <span>{stats.peakFreq} Hz idx</span>
          </div>
           <div className={`h-1 w-full rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <div 
                className="h-full bg-blue-400 transition-all duration-75" 
                style={{ width: `${(stats.peakFreq / 64) * 100}%` }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};