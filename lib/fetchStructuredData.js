const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const fetchStructuredData = async (url) => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  // On this new page:
  // - open the "http://quotes.toscrape.com/" website
  // - wait until the dom content is loaded (HTML is ready)
  const response = await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  const $ = cheerio.load(await response.text());
  // note that I'm not using .html(), although it works for me either way
  const jsonRaw = $("script[type='application/ld+json']")[0].children[0].data;
  // do not use JSON.stringify on the jsonRaw content, as it's already a string
  const result = JSON.parse(jsonRaw);
  browser.close();

  return result["@graph"].filter((elem) => elem["@type"] == "Recipe");
};

module.exports = fetchStructuredData;
