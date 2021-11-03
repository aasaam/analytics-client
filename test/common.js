// @ts-check

const { join } = require('path');
const { readFileSync } = require('fs');
const fastify = require('fastify').default;
const fastifyCors = require('fastify-cors').default;
const fastifyCookie = require('fastify-cookie');

const nunjucksRuntime = require('nunjucks');
const faker = require('faker');
faker.locale = 'fa';

const publicHashID = '000000000000';
const analyticServerURL = 'https://localhost:5001';
const appServerURL = 'https://127.0.0.1:5000';

let scriptTagTemplate = readFileSync(`${__dirname}/../script.js`, {
  encoding: 'utf8',
});

let analyticsScript = readFileSync(`${__dirname}/../index.js`, {
  encoding: 'utf8',
});

let ampScriptTemplate = readFileSync(`${__dirname}/../amp.json`, {
  encoding: 'utf8',
});

if (process.env.RUN_DIST_MODE) {
  scriptTagTemplate = readFileSync(`${__dirname}/../dist/script.js`, {
    encoding: 'utf8',
  });
  analyticsScript = readFileSync(`${__dirname}/../dist/index.js`, {
    encoding: 'utf8',
  });
  ampScriptTemplate = readFileSync(`${__dirname}/../dist/amp.json`, {
    encoding: 'utf8',
  });
}

const svgSample = `<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="480" height="543.03" viewBox="0 0 257.002 297.5" xml:space="preserve"><path d="m25.755 208.22-6.824 3.84V85.434l6.824 3.84V208.22z"/><path d="M128.501 267.484v8.102l-109.57-63.527 6.824-3.838L128.5 267.484z"/><path d="m231.252 208.22 6.82 3.84L128.5 275.585v-8.102l102.75-59.263z"/><path d="m231.252 89.274 6.82-3.839V212.06l-6.82-3.838V89.274z"/><path d="M128.501 30.011v-8.098l109.57 63.522-6.82 3.84-102.75-59.264zM25.755 89.274l-6.824-3.839L128.5 21.913v8.098L25.755 89.274z"/></svg>`;

const maxURLTest = 32 * 1024;
const maxURLPath = `/img${'0'.repeat(maxURLTest - 4)}`;

const ampScript = ampScriptTemplate.replace(
  '__COLLECTOR_URL__',
  analyticServerURL
);

const tlsPrivateKey = readFileSync(join(__dirname, 'cert/server-key.pem'));
const tlsPublicKey = readFileSync(join(__dirname, 'cert/server.pem'));

const nunjucks = nunjucksRuntime.configure(`${__dirname}/templates`, {
  autoescape: true,
});

const fakerSeed = (id) => {
  faker.seed(id);
  return faker;
};

const getScriptTag = (initData) => {
  return scriptTagTemplate.replace(
    '__INITIALIZE_DATA__',
    JSON.stringify(initData)
  );
};

/**
 * @param {import('fastify').FastifyRequest} req
 */
const pageProps = (req) => {
  const id =
    // @ts-ignore
    req.query && req.query.id && parseInt(req.query.id, 10)
      ? // @ts-ignore
        parseInt(req.query.id, 10)
      : 0;

  /** @type {string} */
  // @ts-ignore
  const referrer = req.headers.referrer ? req.headers.referrer : '';

  const fakes = fakerSeed(id);

  let analyticServerURLLocal = analyticServerURL;

  if (req.cookies['as']) {
    analyticServerURLLocal = req.cookies['as'];
  }

  const title = fakes.lorem.words(10);

  const content1 = `<p>${fakes.lorem
    .paragraphs(5)
    .split('\n')
    .join('</p><p>')}</p>`;
  const content2 = `<p>${fakes.lorem
    .paragraphs(10)
    .split('\n')
    .join('</p><p>')}</p>`;

  const description = fakes.lorem.paragraph();
  const pageURL = `${appServerURL}${req.url}`;
  const canonical = `${appServerURL}/?id=${id}&title=${encodeURIComponent(
    title
  )}`;

  const amp = `${appServerURL}/amp?id=${id}`;

  /**
   * @type {ModeOfRequest}
   */
  const modeImgLegacy = 'il';

  /** @type {ModeOfRequest} */
  const modeAmpLegacy = 'ia';

  return {
    id,
    title,
    titleEncoded: encodeURIComponent(title),
    ogTitle: title,
    keywords: faker.lorem
      .text()
      .split(' ')
      .filter((a) => !a.match(/[.?-،,]+$/gi) && a.length >= 5)
      .filter((v, i, a) => a.indexOf(v) === i)
      .map((a) => a.toLocaleLowerCase())
      .join(','),
    description,
    content1,
    content2,
    canonical,
    maxURLPath,
    amp,
    appServerURL,
    analyticServerURL: analyticServerURLLocal,
    script: getScriptTag({
      i: publicHashID,
      s: analyticServerURLLocal,
      pv: true,
    }),
    noscriptImageNoScript: [
      `m=${encodeURIComponent(modeImgLegacy)}`,
      `i=${encodeURIComponent(publicHashID)}`,
      `u=${encodeURIComponent(pageURL)}`,
      `r=${encodeURIComponent(referrer)}`,
      `cn=${encodeURIComponent(canonical)}`,
      `mid=${encodeURIComponent(`page-${id}`)}`,
    ].join('&'),
    noscriptAmpParams: [
      `m=${encodeURIComponent(modeAmpLegacy)}`,
      `i=${encodeURIComponent(publicHashID)}`,
      `u=${encodeURIComponent(pageURL)}`,
      `cn=${encodeURIComponent(pageURL)}`,
      `r=${encodeURIComponent(referrer)}`,
      `mid=${encodeURIComponent(`page-${id}`)}`,
    ].join('&'),
  };
};

module.exports = {
  svgSample,
  analyticServerURL,
  appServerURL,
  ampScript,
  ampScriptTemplate,
  tlsPrivateKey,
  tlsPublicKey,
  scriptTagTemplate,
  analyticsScript,
  nunjucks,
  maxURLTest,
  maxURLPath,
  getScriptTag,
  pageProps,
  faker: fakerSeed,
  fastify,
  fastifyCors,
  fastifyCookie,
};
