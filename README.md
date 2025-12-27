# CNR Game Launcher

A modern, cross-platform desktop game launcher built with Electron and React. Organize and launch your games from anywhere in one unified interface.

## Description

CNR Game Launcher allows you to manage your game library across different platforms and locations. Whether your games are installed on Steam, Epic Games, or standalone executables, this app provides a clean, customizable interface to organize, search, and launch them all from one place.

## Features

- **Game Management**: Add games from any location or platform
- **Collections**: Organize games into custom collections
- **Big Picture Mode**: Full-screen gaming interface inspired by Steam Big Picture
- **Search & Filter**: Quickly find games with advanced search and filtering options
- **Cross-Platform**: Runs on Windows, macOS, and Linux
- **Keyboard & Gamepad Support**: Navigate using keyboard or gamepad
- **User Preferences**: Persistent settings and preferences storage

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Electron
- **Build Tool**: Vite
- **State Management**: Hooks and context
- **Audio**: Howler.js for sound effects
- **Animations**: Motion library
- **Icons**: React Icons

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/canerdemirci/CNR-Game-Launcher.git
   cd game-launcher
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development mode:
   ```bash
   npm run dev
   ```

This will start both the React development server and Electron app.

## Usage

### Adding Games

1. Launch the app
2. Navigate to the "Add Game" page
3. Enter game details and executable path
4. Save to add to your library

### Organizing Collections

- Create custom collections to group related games
- Drag and drop games between collections
- Use filters to quickly find specific games

### Big Picture Mode

- Navigate with keyboard or gamepad
- Full-screen interface optimized for gaming

### Settings

- Customize themes and appearance
- Configure default launch options
- Manage user preferences

## Building

### Development Build

```bash
npm run build
```

### Production Distribution

Build for specific platforms:

```bash
# macOS (ARM64)
npm run dist:mac

# Windows (x64)
npm run dist:win

# Linux (x64)
npm run dist:linux
```

The distributable files will be created in the `dist` folder.

## Project Structure

```
src/
├── electron/          # Electron main process files
│   ├── main.ts       # Main entry point
│   ├── preload.cts   # Preload script
│   └── store/        # Electron-side stores
├── ui/               # React UI components
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page components
│   ├── providers/    # React context providers
│   ├── hooks/        # Custom React hooks
│   └── utils/        # Utility functions
└── types.d.ts        # TypeScript declarations
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Author

**Caner Demirci** - [GitHub](https://github.com/canerdemirci)

## Acknowledgments

- Inspired by popular game launchers like Steam and Epic Games Store
- Built with modern web technologies for a smooth desktop experience