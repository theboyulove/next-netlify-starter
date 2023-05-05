const fetch = require('node-fetch');
const cheerio = require('cheerio');
const prettier = require('prettier');

exports.handler = async (event, context) => {
  const { id } = event.queryStringParameters;
  const articleUrl = `https://aubtu.biz/${id}`;

  try {
    const response = await fetch(articleUrl);
    const html = await response.text();

    const $ = cheerio.load(html);

    // Get the title of the article
    const title = $('h1.post-title').text();

    // Get the main content of the article
    const articleContent = $('div.post-content').html();

    // Get the featured image of the article
    const featuredImageUrl = $('div.post-image img').attr('src');

    // Format the HTML output using Prettier
    const formattedHtml = prettier.format(
      `
        <html>
          <head>
            <title>${title}</title>
          </head>
          <body>
            <h1>${title}</h1>
            <img src="${featuredImageUrl}">
            ${articleContent}
          </body>
        </html>
      `,
      { parser: 'html' }
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: formattedHtml,
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};