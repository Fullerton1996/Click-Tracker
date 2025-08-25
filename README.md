# ClickTrackZen - Desktop Click Tracker with Mindful Breaks

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

ClickTrackZen is now available as both a **web application** and a **desktop application** built with Electron, featuring system-wide click tracking to help you monitor your computer usage and take mindful breaks.

## Features

### 🖱️ **System-Wide Click Tracking** (Desktop App)
- Tracks clicks across all applications and windows
- Cross-platform support (Windows, macOS, Linux)
- Real-time click counting with visual feedback

### 🌐 **Web Application**
- Browser-based click tracking within the application window
- Responsive design for mobile and desktop
- No installation required

### ⏰ **Mindful Break Timer**
- Automatic break prompts when reaching click goals
- Customizable click thresholds
- Relaxing break overlay with meditation quotes
- Integration with Spotify for calming music

### ⚙️ **Customizable Settings**
- Personalized user names and click goals
- Persistent settings storage
- Easy configuration interface

## Installation & Usage

### Desktop Application (Recommended)

**Prerequisites:** Node.js

1. Clone the repository:
   ```bash
   git clone https://github.com/Fullerton1996/Click-Tracker.git
   cd Click-Tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

4. **Development Mode:**
   ```bash
   npm run electron:dev
   ```

5. **Build Desktop App:**
   ```bash
   npm run electron:pack
   ```

### Web Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the web app:
   ```bash
   npm run dev
   ```

## Desktop App Features

### System-Wide Click Tracking
The desktop application uses Electron's native capabilities to track clicks across your entire system:

- **Windows**: Uses Windows hooks API for global mouse event capture
- **macOS**: Implements Quartz event taps for system-wide monitoring  
- **Linux**: Utilizes X11 event listening for cross-application tracking

### Global Shortcuts
- `Ctrl+Shift+C` (or `Cmd+Shift+C` on macOS): Toggle window visibility
- Minimize to system tray for background monitoring

### Status Indicators
- Real-time tracking status display
- Visual feedback for active/inactive states
- Click count progress toward break goals

## Scripts

- `npm run dev` - Start web development server
- `npm run build` - Build both web and desktop applications
- `npm run electron:dev` - Start Electron app in development mode
- `npm run electron:pack` - Package desktop app for distribution
- `npm run electron:dist` - Build and package for release

## Technical Architecture

### Electron Structure
```
src/
├── main/           # Electron main process
│   ├── main.ts     # Main application entry
│   ├── clickTracker.ts # System-wide click tracking
│   └── utils.ts    # Utility functions
├── preload/        # Preload scripts for IPC
│   └── preload.ts  # Secure IPC bridge
└── types/          # TypeScript definitions
    └── electron.d.ts # Electron type definitions
```

### IPC Communication
The app uses secure IPC (Inter-Process Communication) between the main and renderer processes:
- Main process handles system-wide click detection
- Renderer process manages the React UI
- Preload script provides secure API bridge

## Platform-Specific Notes

### Windows
- Requires elevation for global mouse hooks in some cases
- Uses Windows API for low-level mouse event capture

### macOS  
- May require accessibility permissions for system-wide event monitoring
- Uses Quartz Event Services for global click detection

### Linux
- Requires X11 libraries for event listening
- May need additional permissions for global input monitoring

## Development

View your app in AI Studio: https://ai.studio/apps/drive/1hnyhp2bHrdfaZZF_PTmraYsXtMa8L2L1

## License

This project is open source and available under the [MIT License](LICENSE).
