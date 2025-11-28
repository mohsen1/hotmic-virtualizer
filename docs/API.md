# API Documentation

Complete API reference for Sonic Rings Visualizer.

## Table of Contents

- [Components](#components)
  - [MicrophoneVisualizer](#microphonevisualizer)
  - [VisualizerScene](#visualizerscene)
  - [StatsPanel](#statspanel)
- [Hooks](#hooks)
  - [useAudioAnalysis](#useaudioanalysis)
- [Types](#types)

---

## Components

### MicrophoneVisualizer

The main component that handles microphone input, user controls, and renders the 3D visualization.

#### Import

```tsx
import { MicrophoneVisualizer } from 'hotmic-virtualizer';
```

#### Props

```typescript
interface MicrophoneVisualizerProps {
  config: VisualizerConfig;
  setStats?: (stats: AudioStats) => void;
  theme: Theme;
  micColorLight?: string;
  micColorDark?: string;
}
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `config` | `VisualizerConfig` | Yes | - | Configuration object for visualization |
| `theme` | `'light' \| 'dark'` | Yes | - | Theme for UI elements |
| `setStats` | `(stats: AudioStats) => void` | No | - | Callback to receive audio statistics |
| `micColorLight` | `string` | No | `'#000000'` | Microphone icon color in light mode |
| `micColorDark` | `string` | No | `'#ffffff'` | Microphone icon color in dark mode |

#### Example

```tsx
import React, { useState } from 'react';
import { MicrophoneVisualizer, AudioStats } from 'hotmic-virtualizer';

function MyApp() {
  const [stats, setStats] = useState<AudioStats>({ rms: 0, peakFreq: 0 });

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <MicrophoneVisualizer
        config={{
          baseColor: '#00ffff',
          sensitivity: 3.8,
          ringCount: 12,
          ringSpacing: 0.05,
          baseRadius: 0.48,
          waveAmplitude: 0.10,
          bloomIntensity: 1.0,
          smoothingTimeConstant: 0.8,
          waveformSmoothing: 0.8,
        }}
        theme="dark"
        setStats={setStats}
      />
    </div>
  );
}
```

---

### VisualizerScene

Advanced component that renders the Three.js scene with the waveform rings. Typically used internally by `MicrophoneVisualizer`.

#### Import

```tsx
import { VisualizerScene } from 'hotmic-virtualizer';
```

#### Props

```typescript
interface VisualizerSceneProps {
  config: VisualizerConfig;
  frequencyHistoryRef: React.MutableRefObject<Float32Array[]>;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `config` | `VisualizerConfig` | Configuration object |
| `frequencyHistoryRef` | `React.MutableRefObject<Float32Array[]>` | Reference to frequency history buffer |

#### Example

```tsx
// Advanced usage - typically you'd use MicrophoneVisualizer instead
import { Canvas } from '@react-three/fiber';
import { VisualizerScene, useAudioAnalysis } from 'hotmic-virtualizer';

function CustomVisualizer() {
  const { frequencyHistoryRef } = useAudioAnalysis({
    fftSize: 512,
    smoothingTimeConstant: 0.8,
    historySize: 12,
    waveformSmoothing: 0.8,
  });

  return (
    <Canvas>
      <VisualizerScene 
        config={myConfig} 
        frequencyHistoryRef={frequencyHistoryRef} 
      />
    </Canvas>
  );
}
```

---

### StatsPanel

Displays real-time audio statistics (RMS amplitude and peak frequency).

#### Import

```tsx
import { StatsPanel } from 'hotmic-virtualizer';
```

#### Props

```typescript
interface StatsPanelProps {
  stats: AudioStats;
  theme: Theme;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `stats` | `AudioStats` | Audio statistics to display |
| `theme` | `'light' \| 'dark'` | Theme for styling |

#### Example

```tsx
import { StatsPanel, AudioStats } from 'hotmic-virtualizer';

function MyApp() {
  const [stats, setStats] = useState<AudioStats>({ rms: 0, peakFreq: 0 });

  return (
    <>
      {/* Your visualizer */}
      <StatsPanel stats={stats} theme="dark" />
    </>
  );
}
```

---

## Hooks

### useAudioAnalysis

React hook that handles microphone access, audio analysis, and frequency history management.

#### Import

```tsx
import { useAudioAnalysis } from 'hotmic-virtualizer';
```

#### Parameters

```typescript
interface AudioAnalysisOptions {
  fftSize: number;
  smoothingTimeConstant: number;
  historySize: number;
  waveformSmoothing: number;
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `fftSize` | `number` | FFT size (must be power of 2, e.g., 256, 512, 1024) |
| `smoothingTimeConstant` | `number` | Audio analyzer smoothing (0.0 - 1.0) |
| `historySize` | `number` | Number of historical frames to keep |
| `waveformSmoothing` | `number` | Additional waveform smoothing (0.0 - 1.0) |

#### Returns

```typescript
{
  isListening: boolean;
  startListening: () => Promise<void>;
  stopListening: () => void;
  frequencyHistoryRef: React.MutableRefObject<Float32Array[]>;
  statsRef: React.MutableRefObject<AudioStats>;
  update: () => void;
}
```

| Return Value | Type | Description |
|--------------|------|-------------|
| `isListening` | `boolean` | Whether microphone is active |
| `startListening` | `() => Promise<void>` | Start microphone capture |
| `stopListening` | `() => void` | Stop microphone capture |
| `frequencyHistoryRef` | `React.MutableRefObject<Float32Array[]>` | Reference to frequency buffer |
| `statsRef` | `React.MutableRefObject<AudioStats>` | Reference to audio stats |
| `update` | `() => void` | Update function (call on each frame) |

#### Example

```tsx
import { useAudioAnalysis } from 'hotmic-virtualizer';

function CustomAudioComponent() {
  const { 
    isListening, 
    startListening, 
    stopListening,
    statsRef,
    update 
  } = useAudioAnalysis({
    fftSize: 512,
    smoothingTimeConstant: 0.8,
    historySize: 20,
    waveformSmoothing: 0.6,
  });

  return (
    <button onClick={isListening ? stopListening : startListening}>
      {isListening ? 'Stop' : 'Start'}
    </button>
  );
}
```

---

## Types

### VisualizerConfig

Complete configuration object for the visualizer.

```typescript
interface VisualizerConfig {
  baseColor: string;              // Hex color (e.g., '#00ffff')
  sensitivity: number;            // Audio sensitivity (0.1 - 5.0)
  ringCount: number;              // Number of rings (5 - 50)
  ringSpacing: number;            // Space between rings (0.001 - 0.2)
  baseRadius: number;             // Inner radius (0.05 - 1.0)
  waveAmplitude: number;          // Waveform amplitude (0.01 - 0.5)
  bloomIntensity: number;         // Glow intensity (0.0 - 2.0)
  smoothingTimeConstant: number;  // Time decay (0.1 - 0.99)
  waveformSmoothing: number;      // Waveform smoothing (0.0 - 0.95)
}
```

#### Field Descriptions

- **baseColor**: Primary color of the visualization rings. Accepts any valid hex color.
- **sensitivity**: How responsive the visualization is to audio input. Higher = more reactive.
- **ringCount**: Number of concentric rings showing audio history. More rings = longer history.
- **ringSpacing**: Distance between each ring. Smaller = more compressed.
- **baseRadius**: Starting radius of the innermost ring from center.
- **waveAmplitude**: How much the waveform deforms the rings. Higher = more pronounced waves.
- **bloomIntensity**: Glow/bloom effect strength. 0 = no glow, 2 = maximum glow.
- **smoothingTimeConstant**: Audio analyzer smoothing. Higher = smoother but less responsive.
- **waveformSmoothing**: Additional smoothing applied to reduce spikes. Higher = smoother.

### AudioStats

Real-time audio statistics.

```typescript
interface AudioStats {
  rms: number;      // Root Mean Square amplitude (0.0 - 1.0)
  peakFreq: number; // Dominant frequency in Hz
}
```

### Theme

```typescript
type Theme = 'light' | 'dark';
```

---

## Best Practices

### Performance

- Use appropriate `fftSize`: 256-512 for most cases
- Limit `ringCount` on mobile devices (8-15 recommended)
- Higher `waveformSmoothing` reduces CPU usage

### Visual Quality

- `sensitivity` 2.0-4.0 works well for most microphones
- `waveformSmoothing` 0.6-0.8 balances responsiveness and smoothness  
- `bloomIntensity` around 1.0 provides good visual impact

### Accessibility

- Always provide visual feedback when microphone is active
- Handle microphone permission denials gracefully
- Support keyboard controls for play/pause

---

## Browser APIs

This library uses the following browser APIs:

- **MediaDevices.getUserMedia()** - Microphone access
- **Web Audio API** - Audio analysis (AnalyserNode)
- **WebGL** - 3D rendering via Three.js

Ensure your target browsers support these features.

---

## Examples

See the [demo directory](../demo) for complete working examples.
