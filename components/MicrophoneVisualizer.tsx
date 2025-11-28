import React, { useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mic, MicOff } from 'lucide-react';
import { useAudioAnalysis } from '../hooks/useAudioAnalysis';
import { VisualizerScene } from './VisualizerScene';
import { VisualizerConfig, AudioStats, Theme } from '../types';

interface MicrophoneVisualizerProps {
  config: VisualizerConfig;
  setStats?: (stats: AudioStats) => void;
  theme: Theme;
  micColorLight?: string; // Hex color for light mode
  micColorDark?: string;  // Hex color for dark mode
}

// Component to bridge the hook update loop with the render loop
const AudioUpdater = ({ update, statsRef, setStats }: { 
    update: () => void, 
    statsRef: React.MutableRefObject<AudioStats>,
    setStats?: (stats: AudioStats) => void
}) => {
    useFrame(() => {
        update();
        if (setStats && statsRef.current) {
            setStats({ ...statsRef.current });
        }
    });
    return null;
}

export const MicrophoneVisualizer: React.FC<MicrophoneVisualizerProps> = ({ 
    config, 
    setStats, 
    theme,
    micColorLight = '#000000',
    micColorDark = '#ffffff'
}) => {
  const { 
    isListening, 
    startListening, 
    stopListening, 
    frequencyHistoryRef, 
    statsRef,
    update 
  } = useAudioAnalysis({
    // Increased to 512 to give 256 frequency bins
    // This provides better resolution in the lower end (0-500Hz) where voice fundamentals live
    fftSize: 512, 
    smoothingTimeConstant: config.smoothingTimeConstant,
    historySize: config.ringCount,
    waveformSmoothing: config.waveformSmoothing
  });

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const isDark = theme === 'dark';
  const activeColor = isDark ? micColorDark : micColorLight;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 60 }}
          dpr={[1, 2]} // Handle high DPI screens
          gl={{ 
            antialias: true,
            alpha: true,
          }}
        >
          {isListening && (
            <>
               <AudioUpdater update={update} statsRef={statsRef} setStats={setStats} />
               <VisualizerScene config={config} frequencyHistoryRef={frequencyHistoryRef} />
            </>
          )}
          {/* Ambient light purely for any mesh materials, though we use basic materials mostly */}
          <ambientLight intensity={0.5} />
        </Canvas>
      </div>

      {/* Center Microphone Button */}
      <div className="z-10 relative group">
        <button
          onClick={toggleMic}
          className={`
            relative flex items-center justify-center
            w-16 h-16 rounded-full 
            transition-all duration-500 ease-out
            ${isListening 
              ? 'bg-transparent' // Active: Transparent bg, custom text color
              : (isDark 
                  ? 'bg-white/10 text-white/50 hover:bg-white/20 hover:scale-105 hover:text-white' 
                  : 'bg-black/5 text-black/50 hover:bg-black/10 hover:scale-105 hover:text-black')
            }
          `}
          style={{ color: isListening ? activeColor : undefined }}
        >
          {isListening ? (
            <Mic className="w-6 h-6 z-20" />
          ) : (
            <MicOff className="w-6 h-6 z-20" />
          )}
        </button>
        
        {/* Helper text if not listening */}
        {!isListening && (
            <div className={`absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-mono tracking-wider
                ${isDark ? 'text-white/40' : 'text-black/40'}
            `}>
                CLICK TO START
            </div>
        )}
      </div>
    </div>
  );
};