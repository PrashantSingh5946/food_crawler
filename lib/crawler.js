const axios = require("axios");
const cheerio = require("cheerio");
const superagent = require("superagent");
const Recipe = require("../models/recipe");

async function crawl(url, crawler_limit = 10) {
  let currentInsertions = 0;

  const visited = new Set();
  const queue = [url];

  while (queue.length > 0 && currentInsertions < crawler_limit) {
    try {
      const currentUrl = queue.shift();
      visited.add(currentUrl);

      const response = await superagent(currentUrl);
      const $ = cheerio.load(response.text);

      //Check if the page has recipe or not

      if (await isValidPage(response.text)) {
        currentInsertions++;
      }

      const links = [];
      $("a").each((index, element) => {
        const link = $(element).attr("href");

        if (link && !visited.has(link) && link.startsWith(url)) {
          links.push(link);
        }
      });

      queue.push(...links);
    } catch (error) {
      console.log("Error fetching data", error.message);
    }
  }

  console.log("Crawling completed");

  return currentInsertions;
}

const isValidPage = async (responseData) => {
  const $ = cheerio.load(responseData);
  const jsonRaw = $("script[type='application/ld+json']")[0].children[0].data;
  const result = JSON.parse(jsonRaw);

  let saveData = result["@graph"].filter((elem) => elem["@type"] == "Recipe");
  saveData = saveData[0];

  if (saveData) {
    await new Recipe(saveData).save();

    console.log("Recipe created - ", saveData["name"]);

    return true;
  }
};

//crawl("https://www.indianhealthyrecipes.com/");

module.exports = crawl;
