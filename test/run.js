// @ts-check

const path = require('path');
const fastify = require('fastify').default;
const fastifyStatic = require('fastify-static');
const appTestMaker = require('./app-test');
const appAnalyticsMaker = require('./app-analytics');

(async function () {
  const docs = fastify({
    logger: false,
  });

  // @ts-ignore
  docs.register(fastifyStatic, {
    root: path.join(__dirname, '/../docs'),
  });

  const appTest = await appTestMaker();
  const appAnalytics = await appAnalyticsMaker();

  appTest.listen(5000, '0.0.0.0', (e) => {
    console.error(e);
  });

  appAnalytics.listen(5001, '0.0.0.0', (e) => {
    console.error(e);
  });

  docs.listen(5002, '0.0.0.0', (e) => {
    console.error(e);
  });
})();
