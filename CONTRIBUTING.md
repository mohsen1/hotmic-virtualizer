# Contributing to Hotmic Virtualizer

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Getting Started

1. **Fork and Clone**
   ```bash
   git clone https://github.com/mohsen1/hotmic-virtualizer.git
   cd hotmic-virtualizer
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view the demo.

## Project Structure

```
hotmic-virtualizer/
├── components/          # React components
│   ├── MicrophoneVisualizer.tsx
│   ├── VisualizerScene.tsx
│   └── StatsPanel.tsx
├── hooks/              # React hooks
│   └── useAudioAnalysis.ts
├── tests/              # Test files
├── docs/               # Documentation
├── demo/               # Demo application
├── index.ts            # Library entry point
├── types.ts            # TypeScript types
└── vite.config.lib.ts  # Library build config
```

## Development Workflow

### Running Tests

```bash
# Run tests once
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### Building

```bash
# Build library
npm run build:lib

# Build demo
npm run build:demo

# Build both
npm run build
```

### Type Checking

```bash
npm run typecheck
```

## Code Style

- Use TypeScript for all new code
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components focused and reusable

## Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clear, concise commit messages
   - Add tests for new features
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   npm test
   npm run typecheck
   npm run build
   ```

4. **Submit PR**
   - Push your branch to your fork
   - Open a pull request
   - Describe your changes clearly
   - Link any related issues

## Adding New Features

When adding new features:

1. **Update Types** - Add/modify types in `types.ts`
2. **Add Tests** - Create tests in `tests/` directory
3. **Update Docs** - Update README.md and API documentation
4. **Update Exports** - Add exports to `index.ts` if needed

## Testing Guidelines

- Write unit tests for hooks and utility functions
- Write integration tests for components
- Mock browser APIs (MediaDevices, AudioContext)
- Aim for >80% code coverage

## Documentation

- Update README.md for user-facing changes
- Update docs/API.md for API changes
- Add JSDoc comments for public APIs
- Include code examples

## Reporting Bugs

Use GitHub Issues to report bugs. Include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and version
- Screenshots if applicable

## Feature Requests

Feature requests are welcome! Please:

- Check existing issues first
- Clearly describe the feature
- Explain the use case
- Consider implementation complexity

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help each other learn

## Questions?

Feel free to open an issue for questions or discussion.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
