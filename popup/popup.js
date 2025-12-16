/**
 * Alt Text Creator - Popup Script
 * Handles settings management for the extension
 */

document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const modelSelect = document.getElementById('modelSelect');
  const toggleVisibility = document.getElementById('toggleVisibility');
  const saveBtn = document.getElementById('saveBtn');
  const statusBadge = document.getElementById('statusBadge');
  const message = document.getElementById('message');
  const refreshModelsBtn = document.getElementById('refreshModelsBtn');
  const modelHelper = document.getElementById('modelHelper');

  // Vision-capable model patterns (models that support image input)
  const VISION_MODEL_PATTERNS = [
    /^gpt-4o/,
    /^gpt-4-turbo/,
    /^gpt-4-vision/,
    /^gpt-5/,
    /^o1/,
    /^o3/,
    /^chatgpt-4o/
  ];

  // Preferred models to show at top (in order of preference)
  const PREFERRED_MODELS = [
    'gpt-4o-mini',
    'gpt-4o',
    'gpt-4-turbo',
    'gpt-4-turbo-preview'
  ];

  let cachedModels = [];

  loadSettings();

  toggleVisibility.addEventListener('click', () => {
    const isPassword = apiKeyInput.type === 'password';
    apiKeyInput.type = isPassword ? 'text' : 'password';
    
    const eyeIcon = toggleVisibility.querySelector('.eye-icon');
    const eyeOffIcon = toggleVisibility.querySelector('.eye-off-icon');
    
    eyeIcon.style.display = isPassword ? 'none' : 'block';
    eyeOffIcon.style.display = isPassword ? 'block' : 'none';
  });

  saveBtn.addEventListener('click', saveSettings);
  refreshModelsBtn.addEventListener('click', () => fetchModels(apiKeyInput.value.trim(), true));

  apiKeyInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveSettings();
    }
  });

  // Fetch models when API key changes (with debounce)
  let debounceTimer;
  apiKeyInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const apiKey = apiKeyInput.value.trim();
      if (apiKey && apiKey.startsWith('sk-')) {
        fetchModels(apiKey);
      } else {
        resetModelSelect();
      }
    }, 500);
  });

  async function loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['openaiApiKey', 'aiModel']);
      
      if (result.openaiApiKey) {
        apiKeyInput.value = result.openaiApiKey;
        updateStatus(true);
        await fetchModels(result.openaiApiKey);
        
        // Set saved model after models are loaded
        if (result.aiModel && modelSelect.querySelector(`option[value="${result.aiModel}"]`)) {
          modelSelect.value = result.aiModel;
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  async function fetchModels(apiKey, forceRefresh = false) {
    if (!apiKey || !apiKey.startsWith('sk-')) {
      resetModelSelect();
      return;
    }

    modelSelect.disabled = true;
    modelHelper.textContent = 'Loading models...';
    refreshModelsBtn.classList.add('loading');

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Filter for vision-capable models
      const visionModels = data.data
        .filter(model => VISION_MODEL_PATTERNS.some(pattern => pattern.test(model.id)))
        .map(model => model.id)
        .sort((a, b) => {
          // Sort preferred models to top
          const aIndex = PREFERRED_MODELS.indexOf(a);
          const bIndex = PREFERRED_MODELS.indexOf(b);
          
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          return a.localeCompare(b);
        });

      cachedModels = visionModels;
      populateModelSelect(visionModels);
      modelHelper.textContent = `${visionModels.length} vision-capable models available`;

    } catch (error) {
      console.error('Failed to fetch models:', error);
      modelHelper.textContent = 'Failed to load models. Check API key.';
      
      // Fall back to default models
      populateModelSelect(['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo']);
    } finally {
      refreshModelsBtn.classList.remove('loading');
    }
  }

  function populateModelSelect(models) {
    const currentValue = modelSelect.value;
    modelSelect.innerHTML = '';
    
    if (models.length === 0) {
      modelSelect.innerHTML = '<option value="">No vision models available</option>';
      modelSelect.disabled = true;
      return;
    }

    models.forEach(modelId => {
      const option = document.createElement('option');
      option.value = modelId;
      option.textContent = formatModelName(modelId);
      modelSelect.appendChild(option);
    });

    modelSelect.disabled = false;

    // Restore previous selection if available
    if (currentValue && models.includes(currentValue)) {
      modelSelect.value = currentValue;
    }
  }

  function formatModelName(modelId) {
    // Add friendly descriptions for known models
    const descriptions = {
      'gpt-4o-mini': 'GPT-4o Mini (Fast & Affordable)',
      'gpt-4o': 'GPT-4o (Recommended)',
      'gpt-4-turbo': 'GPT-4 Turbo',
      'gpt-4-turbo-preview': 'GPT-4 Turbo Preview',
      'gpt-4-vision-preview': 'GPT-4 Vision Preview'
    };
    return descriptions[modelId] || modelId;
  }

  function resetModelSelect() {
    modelSelect.innerHTML = '<option value="">Enter API key to load models...</option>';
    modelSelect.disabled = true;
    modelHelper.textContent = 'Vision-capable models for image analysis';
  }

  async function saveSettings() {
    const apiKey = apiKeyInput.value.trim();
    const model = modelSelect.value;

    if (!apiKey) {
      showMessage('Please enter an API key', 'error');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      showMessage('Invalid API key format', 'error');
      return;
    }

    if (!model) {
      showMessage('Please select a model', 'error');
      return;
    }

    setLoading(true);

    try {
      const isValid = await validateApiKey(apiKey);
      
      if (!isValid) {
        showMessage('Invalid API key. Please check and try again.', 'error');
        setLoading(false);
        return;
      }

      await chrome.storage.sync.set({
        openaiApiKey: apiKey,
        aiModel: model
      });

      updateStatus(true);
      showMessage('Settings saved successfully!', 'success');
    } catch (error) {
      showMessage('Failed to save settings: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function validateApiKey(apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  function updateStatus(configured) {
    const statusText = statusBadge.querySelector('.status-text');
    
    if (configured) {
      statusBadge.classList.add('configured');
      statusText.textContent = 'Ready to use';
    } else {
      statusBadge.classList.remove('configured');
      statusText.textContent = 'Not configured';
    }
  }

  function showMessage(text, type) {
    message.textContent = text;
    message.className = 'message ' + type;
    
    setTimeout(() => {
      message.className = 'message';
    }, 3000);
  }

  function setLoading(loading) {
    const btnText = saveBtn.querySelector('.btn-text');
    const btnLoading = saveBtn.querySelector('.btn-loading');
    
    saveBtn.disabled = loading;
    btnText.style.display = loading ? 'none' : 'inline';
    btnLoading.style.display = loading ? 'inline-flex' : 'none';
  }
});
