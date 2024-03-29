// @ts-check

const path = require('path');
const fastify = require('fastify').default;
const fastifyStatic = require('@fastify/static').default;
const appTestMaker = require('./app-test');
const appAnalyticsMaker = require('./app-analytics');

(async function () {
  const docs = fastify({
    logger: false
  });

  // @ts-ignore
  docs.register(fastifyStatic, {
    root: path.join(__dirname, '/../docs')
  });

  (await appTestMaker()).listen({ port: 5000, host: '0.0.0.0' }, (e) => {
    if (e) {
      console.error(e);
    }
  });

  (await appAnalyticsMaker()).listen({ port: 7000, host: '0.0.0.0' }, (e) => {
    if (e) {
      console.error(e);
    }
  });

  docs.listen({ port: 8000, host: '0.0.0.0' }, (e) => {
    console.error(e);
  });
})();
