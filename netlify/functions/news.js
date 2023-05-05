const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const articleId = event.path.split('/').pop();
  const url = `https://criticsbreakingnews.co.uk/?p=${articleId}`;
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  const title = $('meta[property="og:title"]').attr('content') || '';
  const imageUrl = $('meta[property="og:image"]').attr('content') || '';
  const contentHtml = $('div[itemprop="articleBody"]').html() || '';
  
  const imgPath = path.join(__dirname, '/tmp', `${articleId}.jpg`);
  await fetch(imageUrl)
    .then(res => {
      const dest = fs.createWriteStream(imgPath);
      res.body.pipe(dest);
    });

  const formData = new FormData();
  formData.append('title', title);
  formData.append('contentHtml', contentHtml);
  formData.append('imageUrl', `https://hottestnews.netlify.app/tmp/${articleId}.jpg`);
  
  const formattedHtml = `
    <html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        <h1>${title}</h1>
        <img src="${imageUrl}" />
        ${contentHtml}
      </body>
    </html>
  `;
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: formattedHtml
  };
};
