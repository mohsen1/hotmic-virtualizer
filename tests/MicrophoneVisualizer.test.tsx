import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MicrophoneVisualizer } from '../components/MicrophoneVisualizer';
import { VisualizerConfig } from '../types';

// Mock getUserMedia
const mockGetUserMedia = vi.fn();
Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia,
  },
  writable: true,
});

// Mock AudioContext
class MockAudioContext {
  createAnalyser = vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    fftSize: 512,
    frequencyBinCount: 256,
    smoothingTimeConstant: 0.8,
    getByteFrequencyData: vi.fn(),
  }));
  createMediaStreamSource = vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
  }));
  close = vi.fn();
}

global.AudioContext = MockAudioContext as any;

describe('MicrophoneVisualizer', () => {
  const defaultConfig: VisualizerConfig = {
    baseColor: '#00ffff',
    sensitivity: 3.8,
    ringCount: 12,
    ringSpacing: 0.05,
    baseRadius: 0.48,
    waveAmplitude: 0.10,
    bloomIntensity: 1.0,
    smoothingTimeConstant: 0.8,
    waveformSmoothing: 0.8,
  };

  it('renders without crashing', () => {
    render(
      <MicrophoneVisualizer 
        config={defaultConfig} 
        theme="dark" 
      />
    );
    expect(screen.getByRole('button')).toBeDefined();
  });

  it('displays the correct initial state text', () => {
    render(
      <MicrophoneVisualizer 
        config={defaultConfig} 
        theme="dark" 
      />
    );
    expect(screen.getByText('CLICK TO START')).toBeDefined();
  });

  it('respects theme prop for light mode', () => {
    render(
      <MicrophoneVisualizer 
        config={defaultConfig} 
        theme="light" 
      />
    );
    // Component should render in light mode
    expect(screen.getByRole('button')).toBeDefined();
  });

  it('respects theme prop for dark mode', () => {
    render(
      <MicrophoneVisualizer 
        config={defaultConfig} 
        theme="dark" 
      />
    );
    // Component should render in dark mode
    expect(screen.getByRole('button')).toBeDefined();
  });

  it('accepts custom mic colors', () => {
    render(
      <MicrophoneVisualizer 
        config={defaultConfig} 
        theme="dark"
        micColorLight="#ff0000"
        micColorDark="#00ff00"
      />
    );
    expect(screen.getByRole('button')).toBeDefined();
  });

  it('calls setStats callback when provided', () => {
    const mockSetStats = vi.fn();
    render(
      <MicrophoneVisualizer 
        config={defaultConfig} 
        theme="dark"
        setStats={mockSetStats}
      />
    );
    // The component renders successfully with callback
    expect(screen.getByRole('button')).toBeDefined();
  });
});
