const fetch = require('node-fetch');
const prettier = require('prettier');
const { parse } = require('node-html-parser');

exports.handler = async (event, context) => {
  const { id } = event.queryStringParameters;
  const articleUrl = `https://criticsbreakingnews.co.uk/?p=${id}`;

  try {
    const response = await fetch(articleUrl);
    const html = await response.text();

    const root = parse(html);

    // Get the title of the article
    const title = root.querySelector('h1.post-title').text;

    // Get the main content of the article
    const articleContent = root.querySelector('div.post-content').innerHTML;

    // Get the featured image of the article
    const featuredImageUrl = root.querySelector('div.post-image img').getAttribute('src');

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