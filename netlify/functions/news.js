const fetch = require('node-fetch');
const cheerio = require('cheerio');
const prettier = require('prettier');

exports.handler = async (event, context) => {
  const { id } = event.queryStringParameters;
  const url = `https://aubtu.biz/${id}`;

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('h1.title').text();
    const content = $('div.content').html();
    const image = $('img').attr('src');
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
        'Content-type': 'text/html',
      },
      body: formattedHTML,
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
