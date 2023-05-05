const fetch = require('node-fetch');
const { parse } = require('node-html-parser');
const prettier = require('prettier');

exports.handler = async (event, context) => {
  const { id } = event.queryStringParameters;
  const url = `https://criticsbreakingnews.co.uk/?p=${id}`;

  try {
    const response = await fetch(url);
    const html = await response.text();

    if (!html) {
      throw new Error('Failed to fetch HTML content');
    }

    const root = parse(html);
    const title = root.querySelector('h1.post-title')?.text;
    const content = root.querySelector('div.post-content')?.innerHTML;
    const image = root.querySelector('div.post-image img')?.getAttribute('src');

    const articleHTML = `
      <html>
        <head>
          <title>${title}</title>
        </head>
        <body>
          <h1>${title}</h1>
          <img src="${image}">
          ${content}
        </body>
      </html>
    `;

    const formattedHTML = prettier.format(articleHTML, { parser: 'html' });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: formattedHTML,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Error: ${err.message}`,
    };
  }
};
