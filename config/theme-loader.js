// Theme loader - runs on every page
(function() {
  function loadAndApplyTheme() {
    const settings = JSON.parse(localStorage.getItem("themeSettings") || "{}");
    
    console.log("Loading theme settings:", settings); // Debug: check if loading
    
    if (Object.keys(settings).length === 0) return;
    
    // Remove existing theme classes
    document.body.classList.remove(
      'theme-bg-chill', 'theme-bg-parallax', 'theme-bg-solid', 'theme-bg-aurora', 'theme-bg-void',
      'theme-dark', 'theme-light', 'theme-rainbow', 'theme-neon'
    );
    
    // Apply background type
    if (settings.bg) {
      document.body.classList.add(`theme-bg-${settings.bg}`);
      
      // Handle solid color
      if (settings.bg === 'solid' && settings.solidColor) {
        document.body.style.setProperty('--solid-bg-color', settings.solidColor);
        // Also apply directly to body background
        document.body.style.background = settings.solidColor;
        document.body.style.animation = 'none';
      }
    } else {
      // Default to chill if nothing is set
      document.body.classList.add('theme-bg-chill');
    }
    
    // Apply theme preset (overrides some styles)
    if (settings.theme && settings.theme !== 'chill') {
      document.body.classList.add(`theme-${settings.theme}`);
    }
    
    // Apply text styles
    if (settings.fontColor) {
      document.documentElement.style.setProperty('--text-color', settings.fontColor);
    }
    
    if (settings.fontSize) {
      document.body.style.fontSize = settings.fontSize + 'px';
    }
    
    if (settings.font) {
      // Map font names to proper CSS fonts
      const fontMap = {
        'ubuntu': 'Ubuntu, sans-serif',
        'orbitron': 'Orbitron, monospace',
        'rajdhani': 'Rajdhani, sans-serif',
        'exo2': "'Exo 2', sans-serif",
        'spacegrotesk': "'Space Grotesk', sans-serif"
      };
      document.body.style.fontFamily = fontMap[settings.font] || settings.font;
    }
  }
  
  // Run immediately
  loadAndApplyTheme();
  
  // Also run after a tiny delay to ensure DOM is ready
  setTimeout(loadAndApplyTheme, 50);
})();
