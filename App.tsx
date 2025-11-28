import React, { useState } from 'react';
import { MicrophoneVisualizer } from './components/MicrophoneVisualizer';
import { StatsPanel } from './components/StatsPanel';
import { VisualizerConfig, AudioStats, Theme } from './types';
import { Sliders, Activity, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [stats, setStats] = useState<AudioStats>({ rms: 0, peakFreq: 0 });
  const [theme, setTheme] = useState<Theme>('light'); // Default to light to match screenshot background
  
  // Updated defaults based on user feedback and screenshot
  const [config, setConfig] = useState<VisualizerConfig>({
    baseColor: '#00ffff', // Cyan from screenshot
    sensitivity: 3.8,     // Increased sensitivity
    ringCount: 12,        
    ringSpacing: 0.05, 
    baseRadius: 0.48,     // Significantly increased base radius
    waveAmplitude: 0.10,  
    bloomIntensity: 1.0,
    smoothingTimeConstant: 0.8,
    waveformSmoothing: 0.8, // Default to high smoothing for "smooth a bunch"
  });

  const [showControls, setShowControls] = useState(true);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';

  return (
    <div className={`relative w-full h-full flex flex-col transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-neutral-50'}`}>
      
      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-start pointer-events-none">
        <div>
            <h1 className={`text-2xl font-bold tracking-tighter mb-1 ${isDark ? 'text-white' : 'text-black'}`}>
                SONIC<span className="text-neutral-500">RINGS</span>
            </h1>
            <p className="text-neutral-500 text-sm max-w-xs">
                WebGL Audio Latency Visualization. Frequency mapped to polar coordinates with temporal decay.
            </p>
        </div>
      </header>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-30">
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/5 text-black hover:bg-black/10'}`}
        >
           {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Visualizer Area */}
      <main className="flex-1 relative overflow-hidden">
        <MicrophoneVisualizer 
            config={config} 
            setStats={setStats} 
            theme={theme} 
            micColorLight="#000000"
            micColorDark="#ffffff"
        />
      </main>

      {/* Stats Overlay */}
      <StatsPanel stats={stats} theme={theme} />

      {/* Control Panel Toggle */}
      <button 
        onClick={() => setShowControls(!showControls)}
        className={`absolute bottom-6 left-6 z-30 p-3 backdrop-blur border rounded-full transition-colors
            ${isDark 
                ? 'bg-neutral-900/80 border-neutral-800 text-white hover:bg-neutral-800' 
                : 'bg-white/80 border-neutral-200 text-black hover:bg-white'}
        `}
      >
        <Sliders className="w-5 h-5" />
      </button>

      {/* Controls Overlay */}
      {showControls && (
        <div className={`absolute bottom-20 left-6 z-20 w-80 backdrop-blur-xl border rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 max-h-[70vh] overflow-y-auto
            ${isDark 
                ? 'bg-neutral-900/90 border-neutral-800' 
                : 'bg-white/90 border-neutral-200'}
        `}>
            <div className={`flex items-center gap-2 mb-6 border-b pb-4 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
                <Activity className="w-4 h-4 text-neutral-400" />
                <h2 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>Configuration</h2>
            </div>
            
            <div className="space-y-5">
                {/* Color Picker */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs text-neutral-400 font-mono uppercase">Emission Color</label>
                    <div className="flex gap-2">
                        {['#00ffff', '#ff00ff', '#ffff00', '#ff4444', '#44ff44', '#ffffff'].map(c => (
                            <button
                                key={c}
                                onClick={() => setConfig(prev => ({ ...prev, baseColor: c }))}
                                className={`w-6 h-6 rounded-full transition-transform hover:scale-110 shadow-sm ${config.baseColor === c ? (isDark ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900' : 'ring-2 ring-black ring-offset-2 ring-offset-white') : ''}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                        <input 
                            type="color" 
                            value={config.baseColor}
                            onChange={(e) => setConfig(prev => ({ ...prev, baseColor: e.target.value }))}
                            className="w-6 h-6 bg-transparent rounded-full overflow-hidden cursor-pointer"
                        />
                    </div>
                </div>

                {/* Sliders */}
                <div className="space-y-4">
                     <div className="space-y-1">
                        <div className="flex justify-between text-xs text-neutral-400 font-mono">
                            <span>SENSITIVITY</span>
                            <span>{config.sensitivity.toFixed(1)}</span>
                        </div>
                        <input 
                            type="range" min="0.1" max="5.0" step="0.1"
                            value={config.sensitivity}
                            onChange={(e) => setConfig(prev => ({ ...prev, sensitivity: parseFloat(e.target.value) }))}
                            className={`w-full h-1 rounded-lg appearance-none cursor-pointer ${isDark ? 'bg-neutral-700 accent-white' : 'bg-neutral-300 accent-black'}`}
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-neutral-400 font-mono">
                            <span>WAVE SMOOTHING</span>
                            <span>{config.waveformSmoothing.toFixed(2)}</span>
                        </div>
                        <input 
                            type="range" min="0.0" max="0.95" step="0.05"
                            value={config.waveformSmoothing}
                            onChange={(e) => setConfig(prev => ({ ...prev, waveformSmoothing: parseFloat(e.target.value) }))}
                            className={`w-full h-1 rounded-lg appearance-none cursor-pointer ${isDark ? 'bg-neutral-700 accent-white' : 'bg-neutral-300 accent-black'}`}
                        />
                        <div className="text-[10px] text-neutral-500">Reduces spikes in waveform</div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-neutral-400 font-mono">
                            <span>TIME DECAY</span>
                            <span>{config.smoothingTimeConstant.toFixed(2)}</span>
                        </div>
                        <input 
                            type="range" min="0.1" max="0.99" step="0.01"
                            value={config.smoothingTimeConstant}
                            onChange={(e) => setConfig(prev => ({ ...prev, smoothingTimeConstant: parseFloat(e.target.value) }))}
                            className={`w-full h-1 rounded-lg appearance-none cursor-pointer ${isDark ? 'bg-neutral-700 accent-white' : 'bg-neutral-300 accent-black'}`}
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-neutral-400 font-mono">
                            <span>HISTORY DEPTH</span>
                            <span>{config.ringCount} Rings</span>
                        </div>
                        <input 
                            type="range" min="5" max="50" step="1"
                            value={config.ringCount}
                            onChange={(e) => setConfig(prev => ({ ...prev, ringCount: parseInt(e.target.value) }))}
                            className={`w-full h-1 rounded-lg appearance-none cursor-pointer ${isDark ? 'bg-neutral-700 accent-white' : 'bg-neutral-300 accent-black'}`}
                        />
                    </div>

                     <div className="space-y-1">
                        <div className="flex justify-between text-xs text-neutral-400 font-mono">
                            <span>SPACING</span>
                            <span>{config.ringSpacing.toFixed(3)}</span>
                        </div>
                        <input 
                            type="range" min="0.001" max="0.2" step="0.001"
                            value={config.ringSpacing}
                            onChange={(e) => setConfig(prev => ({ ...prev, ringSpacing: parseFloat(e.target.value) }))}
                            className={`w-full h-1 rounded-lg appearance-none cursor-pointer ${isDark ? 'bg-neutral-700 accent-white' : 'bg-neutral-300 accent-black'}`}
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-neutral-400 font-mono">
                            <span>BASE RADIUS</span>
                            <span>{config.baseRadius.toFixed(2)}</span>
                        </div>
                        <input 
                            type="range" min="0.05" max="1.0" step="0.01"
                            value={config.baseRadius}
                            onChange={(e) => setConfig(prev => ({ ...prev, baseRadius: parseFloat(e.target.value) }))}
                            className={`w-full h-1 rounded-lg appearance-none cursor-pointer ${isDark ? 'bg-neutral-700 accent-white' : 'bg-neutral-300 accent-black'}`}
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-neutral-400 font-mono">
                            <span>AMPLITUDE</span>
                            <span>{config.waveAmplitude.toFixed(2)}</span>
                        </div>
                        <input 
                            type="range" min="0.01" max="0.5" step="0.01"
                            value={config.waveAmplitude}
                            onChange={(e) => setConfig(prev => ({ ...prev, waveAmplitude: parseFloat(e.target.value) }))}
                            className={`w-full h-1 rounded-lg appearance-none cursor-pointer ${isDark ? 'bg-neutral-700 accent-white' : 'bg-neutral-300 accent-black'}`}
                        />
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;