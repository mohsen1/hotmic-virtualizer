import React, { useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mic } from 'lucide-react';
import { useAudioAnalysis } from '../hooks/useAudioAnalysis';
import { VisualizerScene } from './VisualizerScene';
import { VisualizerConfig, AudioStats } from '../types';

interface MicrophoneVisualizerProps {
  config: VisualizerConfig;
  setStats?: (stats: AudioStats) => void;
  /** Optional: custom icon to show in center. Defaults to Mic icon. Pass null to hide. */
  icon?: React.ReactNode | null;
  /** Icon color. Defaults to white */
  iconColor?: string;
  /** Icon size as percentage of container (0-100). Defaults to 40 */
  iconSize?: number;
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

/**
 * MicrophoneVisualizer - A WebGL audio visualizer that automatically starts listening
 * 
 * Renders the visualization canvas filling its container. Optionally shows a centered icon.
 * Automatically starts capturing audio when mounted and stops when unmounted.
 * 
 * @example
 * // Basic usage - just the visualization
 * <div className="w-20 h-20">
 *   <MicrophoneVisualizer config={config} icon={null} />
 * </div>
 * 
 * @example
 * // With centered icon
 * <button className="relative w-12 h-12 rounded-full">
 *   <MicrophoneVisualizer config={config} icon={<Mic />} iconColor="#fff" />
 * </button>
 */
export const MicrophoneVisualizer: React.FC<MicrophoneVisualizerProps> = ({ 
    config, 
    setStats,
    icon,
    iconColor = '#ffffff',
    iconSize = 40,
}) => {
  const { 
    isListening, 
    startListening, 
    stopListening, 
    frequencyHistoryRef, 
    statsRef,
    update 
  } = useAudioAnalysis({
    fftSize: 512, 
    smoothingTimeConstant: config.smoothingTimeConstant,
    historySize: config.ringCount,
    waveformSmoothing: config.waveformSmoothing
  });

  // Auto-start listening when mounted, stop when unmounted
  useEffect(() => {
    startListening();
    return () => {
      stopListening();
    };
  }, [startListening, stopListening]);

  const showIcon = icon !== null && icon !== undefined;
  const iconElement = icon ?? <Mic style={{ width: '100%', height: '100%', color: iconColor }} />;

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* WebGL Canvas */}
      <Canvas 
        camera={{ position: [0, 0, 1.5], fov: 55 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
        }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        {isListening && (
          <>
            <AudioUpdater update={update} statsRef={statsRef} setStats={setStats} />
            <VisualizerScene config={config} frequencyHistoryRef={frequencyHistoryRef} />
          </>
        )}
        <ambientLight intensity={0.5} />
      </Canvas>
      
      {/* Centered Icon Overlay */}
      {showIcon && (
        <div 
          style={{ 
            position: 'relative',
            zIndex: 10,
            pointerEvents: 'none',
            width: `${iconSize}%`, 
            height: `${iconSize}%`,
            color: iconColor,
          }}
        >
          {iconElement}
        </div>
      )}
    </div>
  );
};
