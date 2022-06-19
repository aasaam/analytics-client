// @ts-check

const {
  tlsPrivateKey,
  tlsPublicKey,
  pageProps,
  fastify,
  fastifyCookie,
  svgSample,
  nunjucks,
  maxURLTest,
  maxURLPath,
} = require('./common');

module.exports = async () => {
  const app = fastify({
    logger: false,
    http2: true,
    maxParamLength: maxURLTest,
    https: {
      allowHTTP1: true,
      key: tlsPrivateKey,
      cert: tlsPublicKey,
    },
  });

  // @ts-ignore
  app.register(fastifyCookie);

  app.get('/ajax', (req, reply) => {
    // @ts-ignore
    const props = pageProps(req);

    reply
      .header('content-type', 'text/html; charset=utf-8')
      .send(props.content2);
  });

  app.get(maxURLPath, (req, reply) => {
    // @ts-ignore
    const props = pageProps(req);

    reply.header('content-type', 'image/svg+xml').send(svgSample);
  });

  app.get('/', (req, reply) => {
    // @ts-ignore
    const props = pageProps(req);

    setTimeout(() => {
      reply
        .header('content-type', 'text/html; charset=utf-8')
        .send(nunjucks.render(`page.njk`, props));
    }, (Math.floor(Math.random() * 3) + 1) * 100);
  });

  app.get('/empty', (req, reply) => {
    // @ts-ignore
    const props = pageProps(req);

    setTimeout(() => {
      reply
        .header('content-type', 'text/html; charset=utf-8')
        .send(nunjucks.render(`empty.njk`, props));
    }, (Math.floor(Math.random() * 3) + 1) * 100);
  });

  app.get('/amp', (req, reply) => {
    // @ts-ignore
    const props = pageProps(req);

    reply
      .header('content-type', 'text/html; charset=utf-8')
      .send(nunjucks.render(`amp.njk`, props));
  });

  return app;
};
