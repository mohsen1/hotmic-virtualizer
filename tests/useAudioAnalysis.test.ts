import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAudioAnalysis } from '../hooks/useAudioAnalysis';

describe('useAudioAnalysis', () => {
  it('initializes with isListening false', () => {
    const { result } = renderHook(() =>
      useAudioAnalysis({
        fftSize: 512,
        smoothingTimeConstant: 0.8,
        historySize: 12,
        waveformSmoothing: 0.8,
      })
    );

    expect(result.current.isListening).toBe(false);
  });

  it('provides startListening and stopListening functions', () => {
    const { result } = renderHook(() =>
      useAudioAnalysis({
        fftSize: 512,
        smoothingTimeConstant: 0.8,
        historySize: 12,
        waveformSmoothing: 0.8,
      })
    );

    expect(typeof result.current.startListening).toBe('function');
    expect(typeof result.current.stopListening).toBe('function');
  });

  it('provides update function', () => {
    const { result } = renderHook(() =>
      useAudioAnalysis({
        fftSize: 512,
        smoothingTimeConstant: 0.8,
        historySize: 12,
        waveformSmoothing: 0.8,
      })
    );

    expect(typeof result.current.update).toBe('function');
  });

  it('provides refs for frequency history and stats', () => {
    const { result } = renderHook(() =>
      useAudioAnalysis({
        fftSize: 512,
        smoothingTimeConstant: 0.8,
        historySize: 12,
        waveformSmoothing: 0.8,
      })
    );

    expect(result.current.frequencyHistoryRef).toBeDefined();
    expect(result.current.statsRef).toBeDefined();
    expect(result.current.statsRef.current).toHaveProperty('rms');
    expect(result.current.statsRef.current).toHaveProperty('peakFreq');
  });
});
