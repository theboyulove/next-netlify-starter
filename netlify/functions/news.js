const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.handler = async (event, context) => {
  // Fetch the article from the website
  const articleUrl = 'https://aubtu.biz/100680/';
  const response = await fetch(articleUrl);
  const html = await response.text();

  // Extract the article content
  const $ = cheerio.load(html);

  // Get the title
  const title = $('h1.entry-title').text();

  // Get the content
  let content = '';
  $('div.entry-content p').each((i, el) => {
    content += $(el).html();
  });

  // Get the images
  const images = [];
  $('div.entry-content img').each((i, el) => {
    images.push($(el).attr('src'));
  });

  // Return the article content as the response
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: `
      <h1>${title}</h1>
      <div>${content}</div>
      ${images.map(img => `<img src="${img}"/>`).join('')}
    `,
  };
};
