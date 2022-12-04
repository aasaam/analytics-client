// @ts-check

const util = require('util');

const {
  tlsPrivateKey,
  tlsPublicKey,
  fastify,
  fastifyCors,
  analyticsScript,
  analyticsLegacyScript,
  ampScript,
  randomString,
  nunjucks,
  gifSingle,
  fastifyCompress
} = require('./common');

module.exports = async () => {
  const app = fastify({
    logger: false,
    http2: true,
    maxParamLength: 32 * 1024,
    https: {
      allowHTTP1: true,
      key: tlsPrivateKey,
      cert: tlsPublicKey
    }
  });

  app.register(fastifyCors, {
    origin: true
  });

  app.register(fastifyCompress, {
    global: true
  });

  app.all('/', (req, reply) => {
    reply.status(200);
    reply.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    reply.header('Pragma', 'no-cache');
    reply.header('Expires', '0');
    console.log('-'.repeat(80));
    console.group(`request ${req.id}`);
    let body = req.body;
    if (req.method === 'POST') {
      // @ts-ignore
      body = JSON.parse(body);
    }

    console.log(
      util.inspect(
        {
          ua: req.headers['user-agent'],
          method: req.method,
          l: req.url.length,
          query: JSON.parse(JSON.stringify(req.query)),
          body
        },
        { showHidden: false, depth: null, colors: true }
      )
    );

    console.log();
    console.groupEnd();
    // @ts-ignore
    if (['pv_il', 'pv_ins', 'pv_amp_i'].includes(req.query.m)) {
      reply.header('Content-Type', 'image/gif');
      reply.send(gifSingle);
    } else {
      reply.send('');
    }
  });

  app.get('/_/:version/a.js', (req, reply) => {
    reply
      .header('cache-control', 'public, max-age=31536000, immutable')
      .header('content-type', 'application/javascript')
      .send(analyticsScript);
  });

  app.get('/_/:version/l.js', (req, reply) => {
    reply
      .header('content-type', 'application/javascript')
      .send(analyticsLegacyScript);
  });

  app.get('/_/:version/amp.json', (req, reply) => {
    reply.header('content-type', 'application/json').send(ampScript);
  });

  return app;
};
