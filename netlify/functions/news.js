const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.handler = async (event, context) => {
  // Fetch the article from the website
  const articleUrl = 'https://example.com/article';
  const response = await fetch(articleUrl);
  const html = await response.text();

  // Extract the article content
  const $ = cheerio.load(html);
  const articleTitle = $('h1.entry-title').text();
  const articleContent = $('div.entry-content').html();
  const articleImage = $('div.entry-content img').attr('data-src');

  // Return the article content as the response
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: `
      <html>
        <head>
          <title>${articleTitle}</title>
        </head>
        <body>
          <h1>${articleTitle}</h1>
          <img src="${articleImage}" loading="lazy" />
          ${articleContent}
        </body>
      </html>
    `,
  };
};
