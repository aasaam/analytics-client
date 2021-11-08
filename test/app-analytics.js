// @ts-check

const {
  tlsPrivateKey,
  tlsPublicKey,
  fastify,
  fastifyCors,
  analyticsScript,
  ampScript,
  randomString,
  nunjucks,
  iframeScript,
  gifSingle,
} = require('./common');

module.exports = async () => {
  const app = fastify({
    logger: false,
    http2: true,
    maxParamLength: 32 * 1024,
    https: {
      allowHTTP1: true,
      key: tlsPrivateKey,
      cert: tlsPublicKey,
    },
  });

  app.register(fastifyCors, {
    origin: true,
  });

  app.all('/', (req, reply) => {
    reply.status(204);
    console.log('-'.repeat(80));
    console.group(`request ${req.id}`);
    console.log({
      ua: req.headers['user-agent'],
      l: req.url.length,
      query: req.query,
      body: req.body,
    });
    console.groupEnd();
    reply.send('');
  });

  app.get('/a.js', (req, reply) => {
    reply
      .header('content-type', 'application/javascript')
      .send(analyticsScript);
  });

  app.get('/i.html', (req, reply) => {
    setTimeout(() => {
      reply.header('content-type', 'text/html; charset=utf-8').send(
        nunjucks.render('iframe.njk', {
          script: iframeScript,
        })
      );
    }, (Math.floor(Math.random() * 3) + 1) * 100);
  });

  app.get('/amp.json', (req, reply) => {
    reply.header('content-type', 'application/json').send(ampScript);
  });

  return app;
};
