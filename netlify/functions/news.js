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
  const articleTitle = $('.article-title').text();
  const articleContent = $('.article-content').html();
  const articleImage = $('.article-image img').attr('src');

  // Format the HTML output with Prettier
  const formattedHtml = prettier.format(`
    <html>
      <head>
        <title>${articleTitle}</title>
      </head>
      <body>
        <img src="${articleImage}">
        <div>${articleContent}</div>
      </body>
    </html>
  `, { parser: 'html' });

  // Return the article content as the response
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: formattedHtml,
  };
};
