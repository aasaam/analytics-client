const { writeFileSync, statSync } = require('fs');
const { execSync } = require('child_process');

const amp = require('./amp.json');

const showFileSize = (name) => {
  const { size } = statSync(`${__dirname}/dist/${name}`);
  console.log(`Size of ${name} is ${size} Bytes`);
};

const commands = [
  `rm -rf ${__dirname}/dist`,
  `mkdir -p ${__dirname}/dist`,
  `${__dirname}/node_modules/.bin/uglifyjs --compress --mangle -- index.js > ${__dirname}/dist/index.js`,
  `truncate -s -1 ${__dirname}/dist/index.js`,
  `${__dirname}/node_modules/.bin/uglifyjs --compress --mangle -- iframe.js > ${__dirname}/dist/iframe.js`,
  `truncate -s -1 ${__dirname}/dist/iframe.js`,
  `${__dirname}/node_modules/.bin/uglifyjs --compress --mangle -- script.js > ${__dirname}/dist/script.js`,
  `${__dirname}/node_modules/.bin/uglifyjs --compress --mangle -- script-modern.js > ${__dirname}/dist/script-modern.js`,
  `truncate -s -1 ${__dirname}/dist/script.js`,
  `truncate -s -1 ${__dirname}/dist/script-modern.js`,
];

execSync(commands.join(' && '));

writeFileSync(`${__dirname}/dist/amp.json`, JSON.stringify(amp).trim(), {
  encoding: 'utf8',
});

showFileSize('index.js');
showFileSize('script.js');
showFileSize('script-modern.js');
showFileSize('iframe.js');
showFileSize('amp.json');

