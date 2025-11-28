import { useRef, useEffect, useState, useCallback } from 'react';
import { AudioConfig, AudioStats } from '../types';

export const useAudioAnalysis = (config: AudioConfig) => {
  const [isListening, setIsListening] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // We use refs for data to avoid re-renders on every frame
  // The history buffer is a flat array where rows are time steps
  // Structure: [Frame 0 (current), Frame -1, Frame -2, ...]
  const frequencyHistoryRef = useRef<Uint8Array[]>([]);
  const statsRef = useRef<AudioStats>({ rms: 0, peakFreq: 0 });

  // Update smoothing dynamically without restarting stream
  useEffect(() => {
    if (analyserRef.current) {
      analyserRef.current.smoothingTimeConstant = config.smoothingTimeConstant;
    }
  }, [config.smoothingTimeConstant]);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = config.fftSize;
      analyser.smoothingTimeConstant = config.smoothingTimeConstant;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      // Initialize history buffer
      const bufferLength = analyser.frequencyBinCount;
      frequencyHistoryRef.current = Array(config.historySize)
        .fill(0)
        .map(() => new Uint8Array(bufferLength));

      setIsListening(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setIsListening(false);
    }
  }, [config.fftSize, config.smoothingTimeConstant, config.historySize]);

  const stopListening = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
  }, []);

  const update = useCallback(() => {
    if (!analyserRef.current || !isListening) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    // Create a temporary array for current frame
    const rawData = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(rawData);

    // --- Spatial Waveform Smoothing ---
    // Smooths across frequency bins to remove spikes
    const smoothFactor = config.waveformSmoothing;
    const finalData = new Uint8Array(bufferLength);
    
    if (smoothFactor > 0) {
        for (let i = 0; i < bufferLength; i++) {
            const prev = rawData[Math.max(0, i - 1)];
            const curr = rawData[i];
            const next = rawData[Math.min(bufferLength - 1, i + 1)];
            
            // Weighted average of neighbors
            // smoothFactor 0.0 -> Original signal
            // smoothFactor 1.0 -> Average of neighbors (heavy blur)
            const average = (prev + curr + next) / 3;
            // Lerp between current and average
            finalData[i] = (curr * (1 - smoothFactor)) + (average * smoothFactor);
        }
    } else {
        finalData.set(rawData);
    }

    // Calculate Stats (using raw data for accuracy)
    let sum = 0;
    let peak = 0;
    let peakIndex = 0;
    for (let i = 0; i < bufferLength; i++) {
      const val = rawData[i];
      sum += val * val;
      if (val > peak) {
        peak = val;
        peakIndex = i;
      }
    }
    const rms = Math.sqrt(sum / bufferLength);
    statsRef.current = { rms, peakFreq: peakIndex };

    // Update History: Pop last, Unshift new
    const history = frequencyHistoryRef.current;
    
    const oldestBuffer = history.pop(); 
    if (oldestBuffer) {
        oldestBuffer.set(finalData); // Store smoothed data
        history.unshift(oldestBuffer);
    }

  }, [isListening, config.waveformSmoothing]);

  return {
    isListening,
    startListening,
    stopListening,
    frequencyHistoryRef,
    statsRef,
    update
  };
};