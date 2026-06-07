const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  await page.goto('http://localhost:3000');
  
  // Wait for the work section
  await page.waitForSelector('.work-section');
  
  // Scroll down to cards
  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight * 3);
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Try to click the first project card
  const cards = await page.$$('button[class*="projectCard"]');
  console.log('Found buttons:', cards.length);
  
  if (cards.length > 0) {
    await cards[0].click();
    console.log('Clicked first button');
    
    await new Promise(r => setTimeout(r, 500));
    
    // Check if sheet is open
    const sheetOpen = await page.evaluate(() => {
      const overlays = document.querySelectorAll('div');
      let foundOverlay = null;
      for (const el of overlays) {
        if (el.className.includes('overlay')) foundOverlay = el;
      }
      const sheet = document.querySelector('div[class*="sheet"]');
      return { 
        sheetClass: sheet ? sheet.className : 'null',
        overlayClass: foundOverlay ? foundOverlay.className : 'null',
        overlayVisible: foundOverlay ? getComputedStyle(foundOverlay).visibility : 'null',
        sheetTransform: sheet ? getComputedStyle(sheet).transform : 'null'
      };
    });
    console.log('Sheet results:', sheetOpen);
  }
  
  await browser.close();
})();
