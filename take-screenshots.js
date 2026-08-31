const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function takeScreenshots() {
  const browser = await chromium.launch();
  
  const url = 'http://localhost:4173';
  
  // Define screenshot configs
  const configs = [
    {
      name: 'mobile-390-hero-v2.png',
      viewport: { width: 390, height: 844 },
      fullPage: false
    },
    {
      name: 'mobile-390-full-v2.png',
      viewport: { width: 390, height: 844 },
      fullPage: true
    },
    {
      name: 'desktop-1440-hero-v2.png',
      viewport: { width: 1440, height: 900 },
      fullPage: false
    },
    {
      name: 'desktop-1440-full-v2.png',
      viewport: { width: 1440, height: 900 },
      fullPage: true
    }
  ];
  
  for (const config of configs) {
    console.log(`Taking screenshot: ${config.name}`);
    
    const context = await browser.newContext({
      viewport: config.viewport,
      deviceScaleFactor: 2  // High DPI for better quality
    });
    
    const page = await context.newPage();
    
    // Navigate with hard refresh (cache busting)
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Scroll down to trigger animations and load all content
    if (config.fullPage) {
      await page.evaluate(async () => {
        const distance = 100;
        const delay = 50;
        while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
          document.scrollingElement.scrollBy(0, distance);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        // Scroll back to top
        document.scrollingElement.scrollTo(0, 0);
        await new Promise(resolve => setTimeout(resolve, 500));
      });
    }
    
    // Wait a bit for animations to settle
    await page.waitForTimeout(1000);
    
    // Take screenshot and save to both locations
    const screenshot = await page.screenshot({ 
      fullPage: config.fullPage,
      type: 'png'
    });
    
    // Save to both directories
    fs.writeFileSync(path.join('/workspace/screenshots', config.name), screenshot);
    fs.writeFileSync(path.join('/opt/cursor/artifacts', config.name), screenshot);
    
    console.log(`Saved: ${config.name}`);
    
    await context.close();
  }
  
  await browser.close();
  console.log('All screenshots completed!');
}

takeScreenshots().catch(console.error);
