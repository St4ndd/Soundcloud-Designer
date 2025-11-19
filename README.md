# SoundCloud Designer

<p align="center">
  <a href="https://github.com/yourusername/Soundcloud-Designer">
    <img src="https://img.shields.io/badge/version-1.0-blue.svg">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-green.svg">
  </a>
  <a href="https://www.mozilla.org/firefox/">
    <img src="https://img.shields.io/badge/Firefox-109%2B-orange.svg">
  </a>
  <a href="manifest.json">
    <img src="https://img.shields.io/badge/Manifest-V3-purple.svg">
  </a>
</p>


[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)

> Transform your SoundCloud experience with custom themes, stunning backgrounds, and an immersive fullscreen player mode.

![SoundCloud Designer Banner](https://via.placeholder.com/1200x400/001f4d/ffffff?text=SoundCloud+Designer)

## ✨ Features

### 🎨 Custom Theming
- **Background Customization**: Set any image URL as your SoundCloud background
- **Color Accent Control**: Customize primary button colors with hex codes
- **Glass-Morphism Design**: Modern, transparent UI with blur effects
- **Dark Theme**: Eye-friendly dark interface optimized for music listening

### 📺 Fullscreen Player
- **Immersive Mode**: Distraction-free fullscreen player for focused listening
- **Three Background Styles**:
  - **Blurry**: Adjustable blur strength (0-30px)
  - **Transparent Color**: Custom color with opacity control (0-100%)
  - **Solid Color**: Single color background
- **Intuitive Controls**: Play/Pause, Previous/Next track buttons
- **Auto-sync**: Automatically updates cover art and playback state
- **Hover Interface**: Controls appear on mouse movement

### 🛠️ Easy Configuration
- **Sidebar Settings Panel**: Toggle with browser action button
- **Real-time Preview**: Changes apply instantly
- **Persistent Storage**: Settings saved across sessions
- **Clean UI**: Vercel-inspired modern design

## 🚀 Installation

### Firefox
1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the sidebar
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the extension folder

### Chrome/Edge (Coming Soon)
Support for Chromium-based browsers will be added in future updates.

## 📖 Usage

### Opening the Settings Sidebar
1. Navigate to [SoundCloud](https://soundcloud.com)
2. Click the extension icon in your browser toolbar
3. The settings sidebar will slide in from the left

### Customizing Your Theme
1. **Background Image**: Enter any image URL
2. **Primary Color**: Enter a hex color code (e.g., `#1761df`)
3. Click "Save & Apply Theme" to see changes instantly

### Using Fullscreen Mode
1. Look for the fullscreen button (⛶) on any track's playback controls
2. Click it to enter fullscreen mode
3. Configure background style in settings:
   - **Blurry**: Adjust blur intensity
   - **Transparent**: Choose color and opacity
   - **Solid**: Select a single color
4. Hover to reveal playback controls
5. Press ESC or click ✕ to exit

## 🎯 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `ESC` | Exit fullscreen mode |
| `Space` | Play/Pause (when controls visible) |

## 🗂️ Project Structure

```
Soundcloud-Designer/
├── manifest.json           # Extension configuration
├── background.js           # Background service worker
├── content.js              # Main content script & sidebar logic
├── fullscreen.js           # Fullscreen player functionality
├── style.css               # SoundCloud theme customization
├── fullscreen.css          # Fullscreen player styles
├── designer_sidebar.css    # Sidebar UI styles
├── popup.html              # Extension popup interface
├── popup.js                # Popup logic
├── options.html            # Settings page
├── icon48.png              # Extension icon (48x48)
├── icon128.png             # Extension icon (128x128)
└── README.md               # This file
```

## 🎨 Customization Examples

### Neon Cyberpunk Theme
```
Background: https://example.com/cyberpunk-neon.jpg
Color: #ff00ff
Fullscreen: Transparent Color (#ff00ff, 30%)
```

### Minimal Dark
```
Background: https://example.com/dark-gradient.jpg
Color: #ffffff
Fullscreen: Blurry (15px)
```

### Sunset Vibes
```
Background: https://example.com/sunset.jpg
Color: #ff6b35
Fullscreen: Solid Color (#1a1a2e)
```

## 🔧 Technical Details

### Technologies Used
- **Manifest V3**: Latest WebExtension standard
- **Browser Storage API**: Persistent settings storage
- **Content Scripts**: DOM manipulation and theme injection
- **CSS Variables**: Dynamic theming system
- **MutationObserver**: SPA compatibility for SoundCloud

### Browser Compatibility
- Firefox 109+
- Chrome/Edge support planned

### Permissions Required
- `storage`: Save user preferences
- `activeTab`: Apply themes to SoundCloud
- `scripting`: Inject content scripts

## 🐛 Known Issues

- Fullscreen mode may not work on restricted pages
- Some SoundCloud UI updates might require page refresh
- Custom backgrounds may affect page load time depending on image size

## 🛣️ Roadmap

- [ ] Chrome/Edge compatibility
- [ ] Theme presets library
- [ ] Playlist view in fullscreen mode
- [ ] Keyboard shortcuts customization
- [ ] Export/Import theme settings
- [ ] Animated backgrounds support
- [ ] Lyrics display integration

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Support

If you enjoy this extension, please:
- ⭐ Star this repository
- 🐛 Report bugs via [Issues](https://github.com/yourusername/Soundcloud-Designer/issues)
- 💡 Suggest features via [Discussions](https://github.com/yourusername/Soundcloud-Designer/discussions)

## 📧 Contact

**Developer**: Your Name  
**Email**: your.email@example.com  
**GitHub**: [@yourusername](https://github.com/yourusername)

---

<p align="center">Made with ❤️ for the SoundCloud community</p>
<p align="center">
  <a href="#-soundcloud-designer">Back to Top ⬆️</a>
</p>
