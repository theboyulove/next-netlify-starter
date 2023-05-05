const fetch = require('node-fetch');
const { parse } = require('node-html-parser');
const prettier = require('prettier');

exports.handler = async (event, context) => {
  const articleId = event.path.split('/').pop();
  const articleUrl = `https://criticsbreakingnews.co.uk/?p=${articleId}`;

  const response = await fetch(articleUrl);
  const html = await response.text();

  const root = parse(html);

  // Get the title of the article
  const titleElement = root.querySelector('.entry-title');
  const title = titleElement ? titleElement.text.trim() : '';

  // Get the main content of the article
  const articleContentElement = root.querySelector('.entry-content');
  const articleContent = articleContentElement ? articleContentElement.innerHTML.trim() : '';

  // Get the featured image of the article
  const featuredImageElement = root.querySelector('.entry-content img');
  const imgSrc = featuredImageElement ? featuredImageElement.getAttribute('src') : '';

  console.log(`Title: ${title}`);
  console.log(`Content: ${articleContent}`);
  console.log(`Image: ${imgSrc}`);

  // Format the HTML output using Prettier
  const formattedHtml = prettier.format(
    `
      <html>
        <head>
          <title>${title}</title>
        </head>
        <body>
          <h1>${title}</h1>
          <img src="${imgSrc}" />
          ${articleContent}
        </body>
      </html>
    `,
    { parser: 'html' }
  );

  console.log(`Formatted HTML: ${formattedHtml}`);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: formattedHtml,
  };
};
