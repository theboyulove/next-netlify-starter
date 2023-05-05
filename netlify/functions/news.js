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
  const articleTitle = $('h1.entry-title').text().trim();
  const articleContent = $('div.entry-content').html();
  const articleImages = $('div.entry-content img');

  // Update image src to absolute URLs
  articleImages.each((index, element) => {
    const originalSrc = $(element).attr('src');
    const absoluteSrc = new URL(originalSrc, articleUrl).toString();
    $(element).attr('src', absoluteSrc);
  });

  // Format the HTML content using Prettier
  const formattedHtml = prettier.format(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${articleTitle}</title>
      </head>
      <body>
        <h1>${articleTitle}</h1>
        ${articleContent}
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
