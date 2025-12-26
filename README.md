# CC Plus - YouTube Enhancement Suite

<div align="center">
  <img src="src/public/icon/128.png" alt="CC Plus Logo" width="100"/>
  <br>
  <h3>Transform your YouTube viewing experience with interactive transcripts, immersive cinema mode, and advanced comment search.</h3>
  
  <a href="https://nicetooo.github.io/youtube-cc/"><strong>🌐 Official Website</strong></a> |
  <a href="https://chrome.google.com/webstore/detail/YOUR_ID_HERE"><strong>📥 Install from Chrome Web Store</strong></a>
</div>

<br>

## ✨ Key Features

### 📝 Interactive Transcript Sidebar
Stop scrolling through endless descriptions. CC Plus generates a synchronized, interactive transcript sidebar.
- **Click-to-Jump**: Instantly navigate to any part of the video by clicking on the subtitle line.
- **Auto-Scroll**: The transcript follows the video playback automatically.
- **Copy Support**: Easily copy text for notes or study.

### 🖥️ Immersive Wide Screen Mode
Break free from the default layout.
- automatically expands the video player to fill the full width of your browser window.
- Perfect for 21:9 monitors or just a more cinematic experience on standard screens.

### 🔍 Advanced Comment Search
Find exactly what you're looking for in the comments section.
- **Keyword Search**: Filter thousands of comments instantly.
- **Time-saving**: No more "Load more" clicking fatigue.

### ⚡ Clean & Focus Mode
- **Distraction Free**: Remove sidebar recommendations, banners, and clutter.
- **Pure Viewing**: Focus 100% on the content.

### 🌐 Polyglot Support
Fully localized and optimized for:
- 🇺🇸 English
- 🇨🇳 Chinese (Simplified & Traditional)
- 🇯🇵 Japanese
- 🇰🇷 Korean

---

## 🚀 Installation

### Option 1: Chrome Web Store (Recommended)
1. Visit the [CC Plus on Chrome Web Store](https://chrome.google.com/webstore/detail/YOUR_ID_HERE).
2. Click **"Add to Chrome"**.

### Option 2: Manual Installation (Developer Mode)
1. Download the latest release from the [Releases](https://github.com/nicetooo/youtube-cc/releases) page.
2. Unzip the file.
3. Open Chrome and go to `chrome://extensions/`.
4. Enable **Developer mode** (top right).
5. Click **Load unpacked** and select the unzipped folder.

---

## 🛠️ Development

This project is built with [WXT](https://wxt.dev/), [Svelte](https://svelte.dev/), and [Tailwind CSS](https://tailwindcss.com/).

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Setup
```bash
# Clone the repository
git clone https://github.com/nicetooo/youtube-cc.git

# Enter directory
cd youtube-cc

# Install dependencies
npm install
```

### Running Locally
Start the development server with hot-reloading:
```bash
npm run dev
```
Chrome will open automatically with the extension loaded.

### Building for Production
To create a production build (output to `.output/`):
```bash
npm run build
```

---

## 🔒 Privacy & Permissions

We value your privacy. CC Plus operates strictly on your local device.

- **`webRequest` Permission**: Used *only* to intercept `timedtext` (subtitle) requests from YouTube to display the transcript sidebar. We do not track your browsing history.
- **`tabs` Permission**: Used to detect when you navigate between videos (since YouTube is a Single Page Application) to refresh the transcript.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

<br>

<div align="center">
  <sub>Built with ❤️ by the CC Plus Team</sub>
</div>
