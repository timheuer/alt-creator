# Alt Text Creator

A browser extension for Chrome and Edge that uses AI to generate accessible alt text descriptions for images on social media platforms.

## Features

- 🎯 **Smart Image Detection**: Automatically detects images on supported social media sites
- ✨ **AI-Powered Descriptions**: Uses OpenAI's vision models to generate contextual alt text
- 📋 **One-Click Copy**: Easily copy generated alt text to your clipboard
- 🔄 **Regenerate Option**: Not satisfied? Generate a new description with one click
- 🎨 **Non-Intrusive UI**: Small purple adorner buttons appear in the corner of images
- 🌐 **Multi-Platform Support**: Works on X (Twitter), Facebook, Instagram, LinkedIn, and Threads

## Supported Platforms

- X (Twitter) - `twitter.com` and `x.com`
- Facebook - `facebook.com`
- Instagram - `instagram.com`
- LinkedIn - `linkedin.com`
- Threads - `threads.net`

## Installation

### Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `alt-creator` folder
5. The extension icon should appear in your toolbar

### Edge

1. Open Edge and navigate to `edge://extensions/`
2. Enable **Developer mode** (toggle in left sidebar)
3. Click **Load unpacked**
4. Select the `alt-creator` folder
5. The extension icon should appear in your toolbar

## Setup

1. Click the Alt Text Creator extension icon in your browser toolbar
2. Enter your OpenAI API key (get one at [platform.openai.com/api-keys](https://platform.openai.com/api-keys))
3. The extension will automatically load available vision-capable models from your account
4. Select your preferred AI model from the dropdown
5. Click **Save Settings**

## Usage

1. Navigate to any supported social media site
2. Look for the **purple button** (✨) in the top-right corner of images
3. Click the button to generate alt text
4. Wait for the AI to analyze the image
5. Review the suggested alt text (max 1000 characters)
6. Click **Copy to Clipboard** to copy the text
7. Paste into the alt text field of your social media post

## Alt Text Guidelines

The extension generates alt text following accessibility best practices:

- Concise yet descriptive (under 1000 characters)
- Focuses on important visual elements
- Uses plain, clear language
- Avoids redundant phrases like "image of" or "picture of"
- Includes visible text in images
- Describes mood, context, and key details

## Privacy & Security

- Your API key is stored locally in your browser using Chrome's sync storage
- Images are sent to OpenAI's API for analysis
- No data is collected or stored by the extension itself
- Review OpenAI's privacy policy for their data handling practices

## Troubleshooting

### Adorner buttons not appearing
- Make sure you're on a supported site
- Try refreshing the page
- Check that the extension is enabled in your browser's extension settings

### API errors
- Verify your API key is correct
- Check that your OpenAI account has available credits
- Ensure your API key has access to vision models

### Images not being analyzed
- Some images may be protected by CORS policies
- Very small images (under 50x50 pixels) are ignored
- SVG images are not supported

## Development

### Project Structure

```
alt-creator/
├── manifest.json           # Extension manifest (Manifest V3)
├── background/
│   └── service-worker.js   # Background service for API calls
├── content/
│   ├── content.js          # Content script for image detection
│   └── content.css         # Styles for adorners and modal
├── popup/
│   ├── popup.html          # Settings popup UI
│   ├── popup.css           # Popup styles
│   └── popup.js            # Popup functionality
└── icons/
    ├── icon16.png          # 16x16 icon
    ├── icon32.png          # 32x32 icon
    ├── icon48.png          # 48x48 icon
    └── icon128.png         # 128x128 icon
```

### Building for Production

The extension is ready to use as-is. For publishing to the Chrome Web Store or Edge Add-ons:

1. Remove development files (`.svg` files, `generate-icons.js`)
2. Zip the entire `alt-creator` folder
3. Submit to the respective store

## License

MIT License - Feel free to modify and distribute.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
