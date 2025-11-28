export type Theme = 'light' | 'dark';

export interface AudioConfig {
  fftSize: number;
  smoothingTimeConstant: number;
  historySize: number; // Number of "past" frames to keep
  waveformSmoothing: number; // 0-1, Spatial smoothing strength
}

export interface VisualizerConfig {
  baseColor: string;
  sensitivity: number;
  ringCount: number;
  ringSpacing: number;
  baseRadius: number;
  waveAmplitude: number;
  bloomIntensity: number;
  smoothingTimeConstant: number;
  waveformSmoothing: number;
}

export interface AudioStats {
  rms: number; // Root Mean Square (Energy)
  peakFreq: number; // Dominant frequency bin
}