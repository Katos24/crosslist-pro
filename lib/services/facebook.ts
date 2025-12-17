import puppeteer from 'puppeteer';

interface ListingData {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function postToFacebookMarketplace(listing: ListingData) {
  let browser;
  
  try {
    console.log('🚀 Launching browser...');
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    console.log('🚀 Going to Facebook...');
    await page.goto('https://www.facebook.com/login', { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await wait(2000);

    console.log('🔐 Logging in...');
    await page.waitForSelector('#email', { timeout: 10000 });
    await page.type('#email', process.env.FACEBOOK_EMAIL || '', { delay: 100 });
    await page.type('#pass', process.env.FACEBOOK_PASSWORD || '', { delay: 100 });
    await page.click('button[name="login"]');
    
    console.log('⏳ Waiting for login...');
    await wait(5000);
    
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    
    // Check if 2FA is required
    if (currentUrl.includes('two_step_verification') || currentUrl.includes('checkpoint')) {
      console.log('🔒 2FA DETECTED!');
      console.log('⏸️  Please complete 2FA verification in the browser window');
      console.log('⏸️  Waiting 60 seconds for you to complete 2FA...');
      
      // Wait 60 seconds for user to complete 2FA
      await wait(60000);
      
      console.log('✅ Continuing after 2FA wait...');
    } else {
      console.log('✅ Login successful (no 2FA)');
    }

    console.log('🚀 Navigating to Marketplace...');
    await page.goto('https://www.facebook.com/marketplace/create/item', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    console.log('✅ At Marketplace! URL:', page.url());
    await wait(5000);

    // Take screenshot
    await page.screenshot({ path: 'fb-marketplace.png' });
    console.log('📸 Screenshot: fb-marketplace.png');

    console.log('🚀 Looking for form...');
    const inputs = await page.$$('input[type="text"]');
    const textareas = await page.$$('textarea');
    console.log(`Found ${inputs.length} inputs, ${textareas.length} textareas`);

    if (inputs.length > 0) {
      console.log('📝 Filling title...');
      await inputs[0].click();
      await wait(500);
      await page.keyboard.type(listing.title, { delay: 50 });
    }

    if (textareas.length > 0) {
      console.log('📝 Filling description...');
      await textareas[0].click();
      await wait(500);
      await page.keyboard.type(listing.description, { delay: 30 });
    }

    // Price
    const allInputs = await page.$$('input');
    for (const input of allInputs) {
      const placeholder = await input.evaluate(el => el.getAttribute('placeholder')?.toLowerCase() || '');
      if (placeholder.includes('price')) {
        console.log('💰 Filling price...');
        await input.click();
        await wait(500);
        await page.keyboard.type(listing.price.toString(), { delay: 50 });
        break;
      }
    }

    console.log('✅ Form filled! Complete the rest manually.');
    await page.screenshot({ path: 'fb-filled.png' });
    
    // Keep browser open for 3 minutes
    console.log('⏸️  Browser will stay open for 3 minutes');
    await wait(180000);

    return {
      success: true,
      message: 'Posted to Facebook Marketplace',
      url: page.url()
    };

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}
