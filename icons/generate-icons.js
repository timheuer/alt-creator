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
 */

// Browser-based generation (paste in browser console)
function generateIcons() {
  const sizes = [16, 32, 48, 128];
  
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

// Call generateIcons() to download all icon sizes
console.log('Run generateIcons() to generate and download PNG icons');
