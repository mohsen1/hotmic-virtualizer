# Hotmic Virtualizer 🎤

A high-fidelity WebGL microphone visualization library using concentric time-delayed waveforms. Built with React, Three.js, and WebGL for stunning real-time audio visualization.

![Hotmic Virtualizer Demo](https://img.shields.io/badge/demo-live-brightgreen)
[![npm version](https://img.shields.io/npm/v/hotmic-virtualizer.svg)](https://www.npmjs.com/package/hotmic-virtualizer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎵 **Real-time Audio Analysis** - Visualize microphone input with frequency analysis
- 🌊 **Time-Delayed Waveforms** - Concentric rings showing audio history
- 🎨 **Customizable Colors** - Choose from presets or use any color
- ⚙️ **Full Configuration** - Control sensitivity, smoothing, ring count, and more
- 🌓 **Light & Dark Themes** - Built-in theme support
- 📱 **Responsive** - Works on desktop and mobile browsers
- 🚀 **High Performance** - WebGL-accelerated rendering with Three.js

## Demo

[View Live Demo](https://mohsenazimi.github.io/hotmic-virtualizer)

## Installation

```bash
npm install hotmic-virtualizer
```

Or with yarn:

```bash
yarn add hotmic-virtualizer
```

## Quick Start

```tsx
import React from 'react';
import { MicrophoneVisualizer } from 'hotmic-virtualizer';

function App() {
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
      />
    </div>
  );
}

export default App;
```

## API Reference

### `MicrophoneVisualizer`

The main component for rendering the audio visualizer.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `VisualizerConfig` | Required | Configuration object for the visualizer |
| `theme` | `'light' \| 'dark'` | Required | Visual theme |
| `setStats` | `(stats: AudioStats) => void` | Optional | Callback for receiving audio statistics |
| `micColorLight` | `string` | `'#000000'` | Microphone icon color in light mode |
| `micColorDark` | `string` | `'#ffffff'` | Microphone icon color in dark mode |

### `VisualizerConfig`

Configuration object for customizing the visualizer.

```typescript
interface VisualizerConfig {
  baseColor: string;              // Hex color for the rings (e.g., '#00ffff')
  sensitivity: number;            // Audio sensitivity (0.1 - 5.0)
  ringCount: number;              // Number of historical rings (5 - 50)
  ringSpacing: number;            // Space between rings (0.001 - 0.2)
  baseRadius: number;             // Inner radius (0.05 - 1.0)
  waveAmplitude: number;          // Waveform amplitude (0.01 - 0.5)
  bloomIntensity: number;         // Glow intensity (0.0 - 2.0)
  smoothingTimeConstant: number;  // Time decay (0.1 - 0.99)
  waveformSmoothing: number;      // Waveform smoothing (0.0 - 0.95)
}
```

### `AudioStats`

Audio statistics returned via the `setStats` callback.

```typescript
interface AudioStats {
  rms: number;      // Root Mean Square amplitude
  peakFreq: number; // Peak frequency in Hz
}
```

## Advanced Usage

### With Stats Callback

```tsx
import React, { useState } from 'react';
import { MicrophoneVisualizer, AudioStats } from 'hotmic-virtualizer';

function App() {
  const [stats, setStats] = useState<AudioStats>({ rms: 0, peakFreq: 0 });

  return (
    <>
      <MicrophoneVisualizer
        config={{
          baseColor: '#ff00ff',
          sensitivity: 2.5,
          ringCount: 20,
          // ... other config
        }}
        theme="dark"
        setStats={setStats}
      />
      <div>
        RMS: {stats.rms.toFixed(3)} | Peak: {stats.peakFreq.toFixed(0)} Hz
      </div>
    </>
  );
}
```

### Multiple Color Presets

```tsx
const colorPresets = {
  cyan: '#00ffff',
  magenta: '#ff00ff',
  yellow: '#ffff00',
  red: '#ff4444',
  green: '#44ff44',
  white: '#ffffff',
};

function App() {
  const [color, setColor] = useState(colorPresets.cyan);

  return (
    <MicrophoneVisualizer
      config={{
        baseColor: color,
        // ... other config
      }}
      theme="dark"
    />
  );
}
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14.1+
- Modern mobile browsers

**Note:** Requires `getUserMedia` API support for microphone access.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build library
npm run build:lib

# Run tests
npm test

# Type check
npm run typecheck
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed development guidelines.

## Components

This package exports the following components:

- `MicrophoneVisualizer` - Main visualizer component
- `VisualizerScene` - Three.js scene component (advanced use)
- `StatsPanel` - Statistics display component (optional)
- `useAudioAnalysis` - Audio analysis hook (advanced use)

## License

MIT © Mohsen Azimi

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Acknowledgments

- Built with [React Three Fiber](https://github.com/pmndrs/react-three-fiber)
- Uses [Three.js](https://threejs.org/) for WebGL rendering
- Icons from [Lucide React](https://lucide.dev/)

## Support

- 🐛 [Report a Bug](https://github.com/mohsenazimi/hotmic-virtualizer/issues)
- 💡 [Request a Feature](https://github.com/mohsenazimi/hotmic-virtualizer/issues)
- 📖 [View Documentation](https://github.com/mohsenazimi/hotmic-virtualizer#readme)
