const fetch = require('node-fetch');
const cheerio = require('cheerio');
const prettier = require('prettier');

exports.handler = async (event, context) => {
  // Fetch the article from the website
  const articleUrl = 'https://aubtu.biz/100680/';
  const response = await fetch(articleUrl);
  const html = await response.text();

  // Extract the article content
  const $ = cheerio.load(html);
  const articleContent = $('.article-content').html();
  const articleImages = $('.article-content img')
    .map((_, element) => $(element).attr('src'))
    .get();

  // Format the article content using Prettier
  const formattedContent = prettier.format(articleContent, {
    parser: 'html',
    printWidth: 80,
    htmlWhitespaceSensitivity: 'ignore',
  });

  // Return the article content and images as the response
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: JSON.stringify({
      content: formattedContent,
      images: articleImages,
    }),
  };
};
