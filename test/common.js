// @ts-check

const { join } = require('path');
const { readFileSync } = require('fs');
const fastify = require('fastify').default;
const fastifyCors = require('fastify-cors').default;
const fastifyCookie = require('fastify-cookie');

const nunjucksRuntime = require('nunjucks');
const faker = require('@faker-js/faker');

const publicHashID = '000000000000';
let analyticServerURL = 'https://collector.aasaam-analytics.gw:7000';

const BreadcrumbListSamples = require('./BreadcrumbListSamples');

let scriptTagTemplate = readFileSync(`${__dirname}/../script.js`, {
  encoding: 'utf8',
});

let analyticsScript = readFileSync(`${__dirname}/../a.js`, {
  encoding: 'utf8',
});

let analyticsLegacyScript = readFileSync(`${__dirname}/../l.js`, {
  encoding: 'utf8',
});

let ampScriptTemplate = readFileSync(`${__dirname}/../amp.json`, {
  encoding: 'utf8',
});

if (process.env.RUN_DIST_MODE) {
  scriptTagTemplate = readFileSync(`${__dirname}/../dist/script.js`, {
    encoding: 'utf8',
  });
  analyticsScript = readFileSync(`${__dirname}/../dist/a.js`, {
    encoding: 'utf8',
  });
  analyticsLegacyScript = readFileSync(`${__dirname}/../dist/l.js`, {
    encoding: 'utf8',
  });
  ampScriptTemplate = readFileSync(`${__dirname}/../dist/amp.json`, {
    encoding: 'utf8',
  });
}

const svgSample = `<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="480" height="543.03" viewBox="0 0 257.002 297.5" xml:space="preserve"><path d="m25.755 208.22-6.824 3.84V85.434l6.824 3.84V208.22z"/><path d="M128.501 267.484v8.102l-109.57-63.527 6.824-3.838L128.5 267.484z"/><path d="m231.252 208.22 6.82 3.84L128.5 275.585v-8.102l102.75-59.263z"/><path d="m231.252 89.274 6.82-3.839V212.06l-6.82-3.838V89.274z"/><path d="M128.501 30.011v-8.098l109.57 63.522-6.82 3.84-102.75-59.264zM25.755 89.274l-6.824-3.839L128.5 21.913v8.098L25.755 89.274z"/></svg>`;

const gifSingle = readFileSync(`${__dirname}/sample.gif`);

const maxURLTest = 32 * 1024;
const maxURLPath = `/img${'0'.repeat(maxURLTest - 4)}`;

const ampScript = ampScriptTemplate.replace(
  '__COLLECTOR_URL__',
  analyticServerURL
);

const tlsPrivateKey = readFileSync(join(__dirname, 'cert/hosts-key.pem'));
const tlsPublicKey = readFileSync(join(__dirname, 'cert/server.pem'));

const nunjucks = nunjucksRuntime.configure(`${__dirname}/templates`, {
  autoescape: true,
});

const fakerSeed = (id, lang) => {
  faker.seed(id);
  faker.setLocale(lang);
  return faker;
};

const randomString = () => {
  return (
    new Date().getTime().toString(32) + Math.random().toString(32).substring(2)
  ).substring(0, 16);
};

const getScriptTag = (initData) => {
  return scriptTagTemplate.replace(
    '__INITIALIZE_DATA__',
    JSON.stringify(initData)
  );
};

const pageJSONSchemaGenerate = (fakes) => {
  const [samples] = JSON.parse(JSON.stringify(BreadcrumbListSamples)).sort(
    () => 0.5 - Math.random()
  );
  let str = JSON.stringify(samples);
  str = str.replace(
    /__NAME1__/g,
    `${fakes.lorem.words(2).replace(/[^\p{L}\s]/gu, ' ')}-1`
  );
  str = str.replace(
    /__NAME2__/g,
    `${fakes.lorem.words(2).replace(/[^\p{L}\s]/gu, ' ')}-2`
  );
  str = str.replace(
    /__URL1__/g,
    `http://example.com/1-${encodeURIComponent(
      fakes.lorem.words(5).replace(/[^\p{L}]/gu, '-')
    )}`
  );
  str = str.replace(
    /__URL2__/g,
    `http://example.com/2-${encodeURIComponent(
      fakes.lorem.words(5).replace(/[^\p{L}]/gu, '-')
    )}`
  );

  return JSON.stringify(JSON.parse(str));
};

const sites = ['site0.gw', 'site1.gw', 'site2.gw', 'site3.gw'];

/**
 * @param {import('fastify').FastifyRequest} req
 */
const pageProps = (req) => {
  const appServerURL = `https://site0.gw:5000`;

  const appServerURLNoPortURL = new URL(appServerURL);
  const appServerURLNoPort =
    appServerURLNoPortURL.protocol + '//' + appServerURLNoPortURL.hostname;

  const lang =
    // @ts-ignore
    req.query.lang ? req.query.lang : 'en';

  let dir = 'ltr';
  if (['ar', 'fa', 'he', 'ur'].includes(lang)) {
    dir = 'rtl';
  }

  let id =
    // @ts-ignore
    req.query && req.query.id && parseInt(req.query.id, 10)
      ? // @ts-ignore
        parseInt(req.query.id, 10)
      : 1;

  if (id < 1) {
    id = 1;
  }

  /** @type {string} */
  // @ts-ignore
  const referrer = req.headers.referrer ? req.headers.referrer : '';

  const fakes = fakerSeed(id, lang);

  let analyticServerURLLocal = analyticServerURL;

  if (req.cookies['as']) {
    analyticServerURLLocal = req.cookies['as'];
  }

  const title = fakes.lorem.words(10);
  const postTitle = fakes.lorem.words(3);

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
  const pagePath = `/?id=${id}&lang=${lang}&title=${encodeURIComponent(title)}`;
  const canonical = `${appServerURL}${pagePath}`;

  const ampURL = `${appServerURL}/amp?id=${id}&lang=${lang}`;

  /**
   * @type {AnalyticsRequestMode}
   */
  const PageViewImageNoScript = 'pv_ins';

  /** @type {AnalyticsRequestMode} */
  const PageViewAMPImage = 'pv_amp_i';

  const chances = [];
  for (let i = 0; i < 10; i += 1) {
    chances[i] = (i + 1) / 10 > Math.random();
  }

  const pageJSONSchema = pageJSONSchemaGenerate(fakes);

  /** @type {InitializeData} */
  const initData = {
    i: publicHashID,
    s: analyticServerURLLocal,
  };

  if (Math.random() > 0.2) {
    initData.gl = {};
    if (Math.random() > 0.2) {
      initData.gl.fc = 1;
      initData.gl.to = 1;
      initData.gl.ha = false;
      initData.gl.lt = 10;
    }
  }

  if (Math.random() > 0.2) {
    initData.pv = {};

    initData.pv.bc = true;

    if (Math.random() > 0.2) {
      initData.pv.bc = true;
    } else if (Math.random() > 0.2) {
      initData.pv.bc = '#data-breadcrubm-list';
    } else if (Math.random() > 0.2) {
      initData.pv.bc = JSON.parse(pageJSONSchema);
    }

    if (Math.random() > 0.2) {
      initData.pv.geo = true;
    } else if (Math.random() > 0.2) {
      initData.pv.geo = {
        lat: Math.random() * 360 - 180,
        lon: Math.random() * 360 - 180,
        acc: Math.round(Math.random() * 1000) + 1,
      };
    }
  }

  return {
    sites,
    appServerURLNoPort,
    pageJSONSchema,
    pagePath,
    chances,
    lang,
    dir,
    id,
    title,
    postTitle,
    titleEncoded: encodeURIComponent(title),
    ogTitle: title,
    keywords: fakes.lorem
      .paragraph()
      .replace(/[^\p{L}\s]/gu, '')
      .split(' ')
      .filter((k) => k.length >= 3)
      .join(','),
    description,
    content1,
    content2,
    canonical,
    maxURLPath,
    ampURL,
    appServerURL,
    analyticServerURL: analyticServerURLLocal,
    script: getScriptTag(initData),
    PageViewImageNoScript: [
      `m=${PageViewImageNoScript}`,
      `i=${encodeURIComponent(publicHashID)}`,
      `u=${encodeURIComponent(pageURL)}`,
      `cu=${encodeURIComponent(pageURL)}`,
      `r=${encodeURIComponent(referrer)}`,
      `ei=${encodeURIComponent(`${id}`)}`,
      `ec=page`,
    ].join('&'),
    PageViewAMPImage: [
      `m=${PageViewAMPImage}`,
      `i=${encodeURIComponent(publicHashID)}`,
      `u=${encodeURIComponent(pageURL)}`,
      `cu=${encodeURIComponent(pageURL)}`,
      `r=${encodeURIComponent(referrer)}`,
      `ei=${encodeURIComponent(`${id}`)}`,
      `ec=page`,
    ].join('&'),
  };
};

module.exports = {
  svgSample,
  analyticServerURL,
  ampScript,
  ampScriptTemplate,
  tlsPrivateKey,
  tlsPublicKey,
  scriptTagTemplate,
  analyticsScript,
  nunjucks,
  gifSingle,
  randomString,
  maxURLTest,
  maxURLPath,
  getScriptTag,
  pageProps,
  faker: fakerSeed,
  fastify,
  fastifyCors,
  fastifyCookie,
  analyticsLegacyScript,
};
