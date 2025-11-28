# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-28

### Added
- Initial release of Sonic Rings Visualizer
- Real-time microphone audio visualization with WebGL
- Concentric time-delayed waveform rings
- Configurable visualization parameters
  - Base color selection
  - Sensitivity control
  - Ring count and spacing
  - Wave amplitude and smoothing
  - Time decay constant
- Light and dark theme support
- TypeScript support with full type definitions
- React Three Fiber integration
- Responsive design for desktop and mobile
- Stats panel for RMS and peak frequency display
- Comprehensive API documentation
- Unit tests with Vitest
- GitHub Actions CI/CD pipeline
- GitHub Pages demo site

### Features
- `MicrophoneVisualizer` - Main component with mic toggle
- `VisualizerScene` - Three.js scene management
- `StatsPanel` - Audio statistics display
- `useAudioAnalysis` - Audio analysis React hook
- Full TypeScript type definitions
- ES modules and UMD bundle support
- Tree-shakeable exports

[1.0.0]: https://github.com/mohsen1/hotmic-virtualizer/releases/tag/v1.0.0
