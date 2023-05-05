const fetch = require('node-fetch');
const cheerio = require('cheerio');
const prettier = require('prettier');

exports.handler = async (event, context) => {
  try {
    const articleUrl = 'https://aubtu.biz/100680/'; // Replace with your article URL
    const response = await fetch(articleUrl);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract the article content and images
    const $content = $('.entry-content');
    const articleContent = $content.html();
    const images = $content.find('img').map((_, img) => $(img).attr('src')).get();

    // Generate the HTML
    const htmlContent = `
      <html>
        <head>
          <title>Article</title>
        </head>
        <body>
          ${articleContent}
        </body>
      </html>
    `;
    const formattedHtml = prettier.format(htmlContent, { parser: 'html' });

    // Return the article content and images as the response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: formattedHtml,
      images: images,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
