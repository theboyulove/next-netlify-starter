const fetch = require('node-fetch');
const cheerio = require('cheerio');
const prettier = require('prettier');

exports.handler = async (event, context) => {
  try {
    // Fetch the article from the website
    const articleUrl = 'https://aubtu.biz/100680/';
    const response = await fetch(articleUrl);
    const html = await response.text();

    // Extract the article content
    const $ = cheerio.load(html);
    const articleContent = $('.article-content').html();

    // Format the article content with Prettier
    const formattedContent = articleContent ? prettier.format(articleContent, { parser: 'html' }) : '';

    // Return the article content as the response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: formattedContent,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
