/**
 * Alt Text Creator - Background Service Worker
 * Handles AI API calls for generating alt text descriptions
 */

const MAX_ALT_TEXT_LENGTH = 1000;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GENERATE_ALT_TEXT') {
    generateAltText(message.imageUrl)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

async function generateAltText(imageUrl) {
  try {
    const settings = await chrome.storage.sync.get(['openaiApiKey', 'aiModel']);
    
    if (!settings.openaiApiKey) {
      return {
        success: false,
        error: 'API key not configured. Please click the extension icon to set up your OpenAI API key.'
      };
    }

    const model = settings.aiModel || 'gpt-4o-mini';
    
    const imageData = await fetchImageAsBase64(imageUrl);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.openaiApiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: `You are an expert at writing accessible alt text descriptions for images. Your descriptions should be:
- Concise yet descriptive (maximum ${MAX_ALT_TEXT_LENGTH} characters)
- Focused on the most important visual elements
- Written in plain, clear language
- Useful for screen reader users
- Avoiding phrases like "image of" or "picture of" at the start
- Including relevant text visible in the image
- Describing the mood, context, and key details

For social media posts, consider what information would be most valuable for someone who cannot see the image.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please write an alt text description for this image that would be suitable for social media. Keep it under 1000 characters.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData.startsWith('data:') ? imageData : imageUrl,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_completion_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorCode = errorData.error?.code || 'unknown';
      const errorType = errorData.error?.type || 'unknown';
      const errorMessage = errorData.error?.message || `API request failed with status ${response.status}`;
      
      console.error('OpenAI API Error:', {
        status: response.status,
        code: errorCode,
        type: errorType,
        message: errorMessage,
        fullError: errorData
      });

      // Provide user-friendly messages for common errors
      let userMessage = errorMessage;
      if (response.status === 429 || errorCode === 'insufficient_quota') {
        userMessage = `Quota exceeded (${errorCode}): ${errorMessage}\n\nPlease check your OpenAI billing at platform.openai.com/account/billing`;
      } else if (response.status === 401) {
        userMessage = `Authentication failed (${errorCode}): Invalid API key. Please check your key in the extension settings.`;
      } else if (response.status === 400) {
        userMessage = `Bad request (${errorCode}): ${errorMessage}`;
      } else if (response.status >= 500) {
        userMessage = `OpenAI server error (${response.status}): ${errorMessage}. Please try again later.`;
      } else {
        userMessage = `Error ${response.status} (${errorCode}): ${errorMessage}`;
      }
      
      return { 
        success: false, 
        error: userMessage,
        errorDetails: {
          status: response.status,
          code: errorCode,
          type: errorType,
          raw: errorMessage
        }
      };
    }

    const data = await response.json();
    let altText = data.choices?.[0]?.message?.content?.trim() || '';

    if (altText.length > MAX_ALT_TEXT_LENGTH) {
      altText = altText.substring(0, MAX_ALT_TEXT_LENGTH - 3) + '...';
    }

    return { success: true, altText };

  } catch (error) {
    console.error('Error generating alt text:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
}

async function fetchImageAsBase64(imageUrl) {
  try {
    if (imageUrl.startsWith('data:')) {
      return imageUrl;
    }

    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  } catch (error) {
    console.warn('Could not convert image to base64, using URL directly:', error);
    return imageUrl;
  }
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Alt Text Creator installed successfully');
  }
});
