const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.handler = async (event, context) => {
  // Fetch the article from the website
  const articleUrl = 'https://aubtu.biz/100680/';
  const response = await fetch(articleUrl);
  const html = await response.text();

  // Extract the article content
  const $ = cheerio.load(html);
  const articleContent = $('.article-content').html();

  // Return the article content as the response
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: articleContent,
  };
};
