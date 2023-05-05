const fetch = require('node-fetch');
const cheerio = require('cheerio');
const prettier = require('prettier');

exports.handler = async (event, context) => {
  const articleUrl = 'https://aubtu.biz/100680/'; // replace with your article URL
  const response = await fetch(articleUrl);
  const html = await response.text();

  const $ = cheerio.load(html);

  // Extract the title and content of the article
  const title = $('h1.entry-title').text().trim();
  const content = $('.entry-content').html();

  // Extract the images in the article and replace the "data-src" attribute with "src"
  $('img[data-src]').each(function () {
    $(this).attr('src', $(this).attr('data-src'));
  });

  // Prettify the HTML output
  const prettyHtml = prettier.format(content, { parser: 'html' });

  // Combine the title and content into a single HTML document
  const outputHtml = `
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        ${prettyHtml}
      </body>
    </html>
  `;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: outputHtml,
  };
};
