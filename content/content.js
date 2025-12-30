/**
 * Alt Text Creator - Content Script
 * Detects images on social media pages and adds adorner overlays for alt text generation
 */

const ALT_CREATOR_CONFIG = {
  minImageSize: 50,
  adornerSize: 28,
  debounceMs: 500,
  observerThrottle: 100,
  // Selectors for post composition areas on each site
  composeSelectors: {
    'x.com': [
      '[data-testid="attachments"]',           // Attached media in compose
      '[data-testid="tweetCompose"]',          // Compose tweet area
      '[aria-label*="Compose"]',               // Compose dialogs
      '[data-testid="cellInnerDiv"] [data-testid="tweetPhoto"]', // Quote tweet with media
      '[aria-labelledby*="modal-header"]',     // Edit image description modal
      '[data-testid="altTextInput"]',          // Alt text input area (parent)
      '[role="dialog"]'                        // Any dialog (includes alt text editor)
    ],
    'instagram.com': [
      '[role="dialog"] img',                   // Create post modal
      '[aria-label*="Create"]',                // Create new post dialog
      '[aria-label*="Edit"]',                  // Edit post dialog
      'form img'                               // Form-based image uploads
    ]
  }
};

class AltTextCreator {
  constructor() {
    this.modal = null;
    this.currentImageUrl = null;
    this.init();
  }

  init() {
    this.createModal();
    this.processExistingImages();
    this.observeNewImages();
    this.setupMessageListener();
  }

  createModal() {
    const modal = document.createElement('div');
    modal.id = 'alt-creator-modal';
    modal.innerHTML = `
      <div class="alt-creator-modal-content">
        <div class="alt-creator-modal-header">
          <h3>✨ AI Alt Text Suggestion</h3>
          <button class="alt-creator-close-btn" aria-label="Close">&times;</button>
        </div>
        <div class="alt-creator-modal-body">
          <div class="alt-creator-image-preview">
            <img src="" alt="Preview" />
          </div>
          <div class="alt-creator-result">
            <div class="alt-creator-loading">
              <div class="alt-creator-spinner"></div>
              <p>Analyzing image...</p>
            </div>
            <div class="alt-creator-text-container" style="display: none;">
              <label for="alt-creator-textarea">Suggested Alt Text:</label>
              <textarea id="alt-creator-textarea" readonly></textarea>
              <div class="alt-creator-char-count">
                <span id="alt-creator-char-current">0</span> / 1000 characters
              </div>
            </div>
            <div class="alt-creator-error" style="display: none;">
              <p class="alt-creator-error-message"></p>
            </div>
          </div>
        </div>
        <div class="alt-creator-modal-footer">
          <button class="alt-creator-btn alt-creator-btn-secondary alt-creator-regenerate-btn" style="display: none;">
            🔄 Regenerate
          </button>
          <button class="alt-creator-btn alt-creator-btn-primary alt-creator-copy-btn" style="display: none;">
            📋 Copy to Clipboard
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    this.modal = modal;
    this.setupModalEvents();
  }

  setupModalEvents() {
    const closeBtn = this.modal.querySelector('.alt-creator-close-btn');
    const copyBtn = this.modal.querySelector('.alt-creator-copy-btn');
    const regenerateBtn = this.modal.querySelector('.alt-creator-regenerate-btn');

    closeBtn.addEventListener('click', () => this.hideModal());
    
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hideModal();
      }
    });

    copyBtn.addEventListener('click', () => this.copyToClipboard());
    regenerateBtn.addEventListener('click', () => this.regenerateAltText());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('visible')) {
        this.hideModal();
      }
    });
  }

  showModal(imageUrl) {
    this.currentImageUrl = imageUrl;
    const preview = this.modal.querySelector('.alt-creator-image-preview img');
    preview.src = imageUrl;

    this.modal.querySelector('.alt-creator-loading').style.display = 'flex';
    this.modal.querySelector('.alt-creator-text-container').style.display = 'none';
    this.modal.querySelector('.alt-creator-error').style.display = 'none';
    this.modal.querySelector('.alt-creator-copy-btn').style.display = 'none';
    this.modal.querySelector('.alt-creator-regenerate-btn').style.display = 'none';

    this.modal.classList.add('visible');
    document.body.style.overflow = 'hidden';

    this.requestAltText(imageUrl);
  }

  hideModal() {
    this.modal.classList.remove('visible');
    document.body.style.overflow = '';
  }

  async requestAltText(imageUrl) {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'GENERATE_ALT_TEXT',
        imageUrl: imageUrl
      });

      if (response.success) {
        this.displayAltText(response.altText);
      } else {
        this.displayError(response.error);
      }
    } catch (error) {
      this.displayError(error.message || 'Failed to generate alt text');
    }
  }

  displayAltText(altText) {
    const textarea = this.modal.querySelector('#alt-creator-textarea');
    const charCount = this.modal.querySelector('#alt-creator-char-current');
    
    textarea.value = altText;
    charCount.textContent = altText.length;

    this.modal.querySelector('.alt-creator-loading').style.display = 'none';
    this.modal.querySelector('.alt-creator-text-container').style.display = 'block';
    this.modal.querySelector('.alt-creator-copy-btn').style.display = 'inline-flex';
    this.modal.querySelector('.alt-creator-regenerate-btn').style.display = 'inline-flex';
  }

  displayError(message) {
    const errorEl = this.modal.querySelector('.alt-creator-error');
    const errorMsg = this.modal.querySelector('.alt-creator-error-message');
    
    // Handle multi-line error messages with proper formatting
    errorMsg.innerHTML = message.replace(/\n/g, '<br>');
    
    this.modal.querySelector('.alt-creator-loading').style.display = 'none';
    errorEl.style.display = 'block';
    this.modal.querySelector('.alt-creator-regenerate-btn').style.display = 'inline-flex';
    
    // Log full error to console for debugging
    console.error('Alt Text Creator Error:', message);
  }

  async copyToClipboard() {
    const textarea = this.modal.querySelector('#alt-creator-textarea');
    const copyBtn = this.modal.querySelector('.alt-creator-copy-btn');
    
    try {
      await navigator.clipboard.writeText(textarea.value);
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '✅ Copied!';
      copyBtn.classList.add('copied');
      
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.classList.remove('copied');
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }

  regenerateAltText() {
    if (this.currentImageUrl) {
      this.modal.querySelector('.alt-creator-loading').style.display = 'flex';
      this.modal.querySelector('.alt-creator-text-container').style.display = 'none';
      this.modal.querySelector('.alt-creator-error').style.display = 'none';
      this.modal.querySelector('.alt-creator-copy-btn').style.display = 'none';
      this.modal.querySelector('.alt-creator-regenerate-btn').style.display = 'none';
      
      this.requestAltText(this.currentImageUrl);
    }
  }

  processExistingImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => this.processImage(img));
  }

  observeNewImages() {
    let timeout;
    const observer = new MutationObserver((mutations) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        // Process all images on any DOM change (Twitter loads dynamically)
        this.processExistingImages();
      }, ALT_CREATOR_CONFIG.observerThrottle);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'srcset']
    });

    // Also observe for attribute changes on images (Twitter changes src dynamically)
    const imgObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.target.tagName === 'IMG') {
          // Re-process if src changed
          const img = mutation.target;
          if (img.dataset.altCreatorProcessed !== 'true') {
            this.processImage(img);
          }
        }
      });
    });

    // Periodic scan for lazy-loaded images (Twitter/X specific)
    setInterval(() => {
      this.processExistingImages();
    }, 2000);
  }

  processImage(img) {
    // Skip if already processed (using dataset as primary check)
    if (img.dataset.altCreatorProcessed === 'true') return;
    if (!this.isValidImage(img)) return;

    if (img.complete && img.naturalWidth > 0) {
      this.addAdorner(img);
    } else {
      img.addEventListener('load', () => this.addAdorner(img), { once: true });
    }
  }

  isValidImage(img) {
    const rect = img.getBoundingClientRect();
    const width = rect.width || img.naturalWidth || img.width;
    const height = rect.height || img.naturalHeight || img.height;

    // Minimum size - skip very small images
    if (width < ALT_CREATOR_CONFIG.minImageSize || height < ALT_CREATOR_CONFIG.minImageSize) {
      return false;
    }

    const src = img.src || img.currentSrc;
    if (!src || src.startsWith('data:image/svg') || src.includes('.svg')) {
      return false;
    }

    if (img.closest('#alt-creator-modal')) {
      return false;
    }

    // Check if image is visible
    const style = window.getComputedStyle(img);
    if (style.display === 'none' || style.visibility === 'hidden') {
      return false;
    }

    // Only show on images in post composition areas
    if (!this.isInComposeArea(img)) {
      return false;
    }

    return true;
  }

  isInComposeArea(img) {
    const hostname = window.location.hostname;
    
    // Determine which site we're on
    let siteKey = null;
    if (hostname.includes('x.com') || hostname.includes('twitter.com')) {
      siteKey = 'x.com';
    } else if (hostname.includes('instagram.com')) {
      siteKey = 'instagram.com';
    }

    if (!siteKey) return false;

    const selectors = ALT_CREATOR_CONFIG.composeSelectors[siteKey];
    if (!selectors) return false;

    // Check if image is within any compose area selector
    for (const selector of selectors) {
      // Check if image matches or is inside the selector
      if (img.closest(selector) || img.matches(selector)) {
        return true;
      }
    }

    return false;
  }

  addAdorner(img) {
    // Check if adorner already exists for this image
    if (img.dataset.altCreatorProcessed === 'true') return;
    img.dataset.altCreatorProcessed = 'true';

    console.log('Alt Text Creator: Adding adorner to image', img.src?.substring(0, 50));

    const adorner = document.createElement('button');
    adorner.className = 'alt-creator-adorner';
    adorner.setAttribute('aria-label', 'Generate alt text for this image');
    adorner.setAttribute('title', 'Generate AI alt text');
    adorner.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    `;

    adorner.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const imageUrl = img.src || img.currentSrc;
      this.showModal(imageUrl);
    });

    // Find a suitable anchor - prefer parent with position set, or image's direct parent
    let anchor = img.parentElement;
    if (!anchor) return;
    
    const anchorStyle = window.getComputedStyle(anchor);
    if (anchorStyle.position === 'static') {
      anchor.style.position = 'relative';
    }
    
    // Ensure anchor has overflow visible so adorner shows
    if (anchorStyle.overflow === 'hidden') {
      anchor.style.overflow = 'visible';
    }

    anchor.appendChild(adorner);

    const updatePosition = () => {
      const imgRect = img.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      
      // Center-top positioning
      const centerX = (imgRect.left + imgRect.width / 2) - anchorRect.left;
      adorner.style.left = `${centerX - 14}px`; // 14 = half of adorner width (28/2)
      adorner.style.top = `${imgRect.top - anchorRect.top + 8}px`;
      adorner.style.right = 'auto';
    };

    updatePosition();

    // Update position on resize
    const resizeObserver = new ResizeObserver(() => updatePosition());
    resizeObserver.observe(img);
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'REFRESH_ADORNERS') {
        this.processExistingImages();
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new AltTextCreator());
} else {
  new AltTextCreator();
}
