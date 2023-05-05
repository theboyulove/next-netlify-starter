const fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs");

async function fetchHTML(url) {
  const response = await fetch(url);
  const html = await response.text();
  return html;
}

async function getArticles(url) {
  const html = await fetchHTML(url);
  const $ = cheerio.load(html);
  const articles = [];

  $('a[href^="https://aubtu.biz/"]').each(function () {
    const article = {};
    article.title = $(this).text();
    article.url = `/${$(this).attr("href").match(/\d+/)[0]}`;
    articles.push(article);
  });

  return articles;
}

(async () => {
  const articles = await getArticles("https://aubtu.biz/");
  const sitemap = articles.map((article) => {
    return `https://hottestnews.netlify.app/post/${article.url}`;
  });

  fs.writeFileSync("public/sitemap.txt", sitemap.join("\n"), {
    encoding: "utf8",
  });
})();