# Privacy Policy for Alt Text Creator

**Last Updated:** December 30, 2025

## Overview

Alt Text Creator is a browser extension that helps users generate AI-powered alt text descriptions for images on social media platforms. Your privacy is important to us, and this policy explains how we handle your data.

## Data Collection

### What We Collect
- **Image URLs**: When you click the adorner button on an image, the URL of that image is temporarily processed to generate alt text.
- **API Key**: Your OpenAI API key is stored locally in your browser's storage to authenticate requests.

### What We Do NOT Collect
- Personal information (name, email, etc.)
- Browsing history
- Social media account information
- Any data from pages you visit (unless you explicitly click the generate button)
- Analytics or tracking data

## Data Usage

### Image Processing
When you request alt text for an image:
1. The image URL is sent to OpenAI's API
2. OpenAI processes the image and returns a text description
3. The description is displayed to you
4. No image data is stored by this extension

### API Key Storage
- Your OpenAI API key is stored locally in your browser using Chrome's secure storage API
- The key never leaves your device except to authenticate with OpenAI
- The key is not transmitted to any servers we control
- You can remove your API key at any time through the extension popup

## Third-Party Services

This extension uses **OpenAI's API** to generate alt text descriptions. When you use this feature:
- Image URLs are sent to OpenAI for processing
- OpenAI's privacy policy applies to their handling of this data
- Review OpenAI's privacy policy at: https://openai.com/privacy

## Data Storage

- All settings and your API key are stored locally in your browser
- No data is stored on external servers controlled by us
- Clearing your browser data or uninstalling the extension removes all stored data

## Permissions Explained

| Permission | Why We Need It |
|------------|----------------|
| `activeTab` | To detect images on the current page when you interact with them |
| `storage` | To save your API key locally in your browser |
| `host_permissions` (x.com, instagram.com) | To run the extension on these social media sites |
| `host_permissions` (api.openai.com) | To send requests to OpenAI for alt text generation |

## Your Rights

You can:
- **Delete your data**: Clear your API key via the extension popup or browser settings
- **Stop using the service**: Uninstall the extension at any time
- **Review permissions**: Check what permissions the extension has in your browser's extension settings

## Children's Privacy

This extension is not intended for children under 13 years of age.

## Changes to This Policy

We may update this privacy policy from time to time. Changes will be reflected in the "Last Updated" date above.

## Contact

If you have questions about this privacy policy, please open an issue on our GitHub repository:
https://github.com/timheuer/alt-creator

## Open Source

This extension is open source. You can review the complete source code at:
https://github.com/timheuer/alt-creator
