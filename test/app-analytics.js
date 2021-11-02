// @ts-check

const {
  tlsPrivateKey,
  tlsPublicKey,
  fastify,
  fastifyCors,
  analyticsScript,
  ampScript,
} = require('./common');

module.exports = async () => {
  const app = fastify({
    logger: true,
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
    methods: ['GET', 'POST'],
  });

  app.all('/', (req, reply) => {
    reply.status(204);
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

  app.get('/amp.json', (req, reply) => {
    reply.header('content-type', 'application/json').send(ampScript);
  });

  return app;
};
