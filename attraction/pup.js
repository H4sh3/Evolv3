const puppeteer = require('puppeteer');

(async () => {

  let dir = 'output2';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  for (let i = 0; i < 100; i++) {
    await page.setViewport({ width: 1800, height: 950 })
    await page.goto('http://localhost:8080/gravitation/');
    await page.waitFor(1000*10);
    await page.screenshot({ path: `${dir}/picture${i}-1.png` });
    await page.waitFor(1000*10);
    await page.screenshot({ path: `${dir}/picture${i}-2.png` });
  }

  await browser.close();
})();