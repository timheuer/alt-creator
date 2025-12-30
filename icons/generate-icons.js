/**
 * Icon Generator Script
 * 
 * Run this in a browser console or Node.js with canvas support to generate PNG icons.
 * 
 * Or use an online tool like:
 * - https://convertio.co/svg-png/
 * - https://cloudconvert.com/svg-to-png
 * 
 * Generate PNG files at these sizes:
 * - icon16.png (16x16)
 * - icon32.png (32x32)  
 * - icon48.png (48x48)
 * - icon128.png (128x128)
 * - icon300.png (300x300) - Edge Add-ons store logo
 * - promo-small.png (440x280) - Chrome Web Store small promo tile
 */

// Browser-based generation (paste in browser console)
function generateIcons() {
  const sizes = [16, 32, 48, 128, 300];
  
  sizes.forEach(size => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    
    // Draw rounded rectangle
    const radius = size * 0.2;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw text
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (size <= 16) {
      ctx.font = `bold ${size * 0.6}px Arial`;
      ctx.fillText('A', size / 2, size / 2 + 1);
    } else if (size >= 300) {
      // For store logo, show full text with sparkle
      ctx.font = `bold ${size * 0.25}px Arial`;
      ctx.fillText('✨ Alt', size / 2, size / 2 - size * 0.08);
      ctx.font = `${size * 0.12}px Arial`;
      ctx.fillText('Text Creator', size / 2, size / 2 + size * 0.15);
    } else {
      ctx.font = `bold ${size * 0.4}px Arial`;
      ctx.fillText('Alt', size / 2, size / 2);
    }
    
    // Download
    const link = document.createElement('a');
    link.download = `icon${size}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}

// Generate promotional tile (440x280) for Chrome Web Store
function generatePromoTile() {
  const canvas = document.createElement('canvas');
  canvas.width = 440;
  canvas.height = 280;
  const ctx = canvas.getContext('2d');
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, 440, 280);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 440, 280);
  
  // Draw text
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.font = 'bold 48px Arial';
  ctx.fillText('✨ Alt Text Creator', 220, 100);
  
  ctx.font = '24px Arial';
  ctx.fillText('AI-powered alt text for', 220, 160);
  ctx.fillText('social media images', 220, 190);
  
  ctx.font = '18px Arial';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText('X.com • Instagram', 220, 240);
  
  // Download
  const link = document.createElement('a');
  link.download = 'promo-small-440x280.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Generate screenshot template (1280x800) for store listings
function generateScreenshotTemplate() {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  
  // Light gray background to represent browser
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, 1280, 800);
  
  // Header bar
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1280, 60);
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, 1280, 60);
  
  // Placeholder text
  ctx.fillStyle = '#666666';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Replace this with an actual screenshot of the extension in action', 640, 400);
  ctx.font = '18px Arial';
  ctx.fillText('Recommended: Show the adorner button and modal on X.com or Instagram', 640, 440);
  
  // Download
  const link = document.createElement('a');
  link.download = 'screenshot-template-1280x800.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Generate marquee promo tile (1400x560) for Chrome Web Store
function generateMarqueeTile() {
  const canvas = document.createElement('canvas');
  canvas.width = 1400;
  canvas.height = 560;
  const ctx = canvas.getContext('2d');
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, 1400, 560);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1400, 560);
  
  // Draw decorative circles in background
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.beginPath();
  ctx.arc(200, 450, 200, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(1200, 100, 150, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(1300, 400, 100, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw main title
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.font = 'bold 80px Arial';
  ctx.fillText('✨ Alt Text Creator', 700, 180);
  
  // Draw subtitle
  ctx.font = '36px Arial';
  ctx.fillText('AI-powered alt text descriptions for social media images', 700, 280);
  
  // Draw features
  ctx.font = '28px Arial';
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillText('🖼️ One-click generation  •  🤖 GPT-4 Vision  •  ♿ Improve accessibility', 700, 380);
  
  // Draw supported platforms
  ctx.font = '24px Arial';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('Works on X.com and Instagram', 700, 460);
  
  // Download
  const link = document.createElement('a');
  link.download = 'marquee-1400x560.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Call these functions to generate assets:
console.log('Available functions:');
console.log('  generateIcons() - Generate all icon sizes including 300x300 store logo');
console.log('  generatePromoTile() - Generate 440x280 promotional tile');
console.log('  generateMarqueeTile() - Generate 1400x560 marquee tile');
console.log('  generateScreenshotTemplate() - Generate 1280x800 screenshot template');
