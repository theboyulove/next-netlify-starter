const axios = require('axios');
const cheerio = require('cheerio');
const prettier = require('prettier');

exports.handler = async (event, context) => {
  const { id } = event.queryStringParameters;
  const url = `https://aubtu.biz/{id}`;

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const title = $('h1.entry-title').text().trim();
    const content = $('div.entry-content').html();
    const image = $('div.entry-content img').attr('src');

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