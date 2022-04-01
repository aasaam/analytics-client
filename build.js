const { writeFileSync, statSync } = require('fs');
const { execSync } = require('child_process');

const amp = require('./amp.json');

const showFileSize = (file1, file2) => {
  const { size: size1 } = statSync(file1);
  const { size: size2 } = statSync(file2);
  console.log(
    [
      `${file1} ${size1}(Bytes)`,
      `${file2} ${size2}(Bytes)`,
      `${100 - Math.round((size2 / size1) * 100)}%`,
    ].join(' | ')
  );
};

const commands = [
  `rm -rf ${__dirname}/dist`,
  `mkdir -p ${__dirname}/dist`,
  `cd ${__dirname}/dist`,
  // a.js
  `cp ${__dirname}/a.js ${__dirname}/dist/a.src.js`,
  `${__dirname}/node_modules/.bin/uglifyjs a.src.js -cmo a.js`,
  // l.js
  `cp ${__dirname}/l.js ${__dirname}/dist/l.src.js`,
  `${__dirname}/node_modules/.bin/uglifyjs l.src.js -cmo l.js`,
  // script.js
  `cp ${__dirname}/script.js ${__dirname}/dist/script.src.js`,
  `${__dirname}/node_modules/.bin/uglifyjs script.src.js -cmo script.js`,
  `rm script.src.js`,
];

execSync(commands.join(' && '));

writeFileSync(`${__dirname}/dist/amp.json`, JSON.stringify(amp).trim(), {
  encoding: 'utf8',
});

showFileSize(`a.js`, `dist/a.js`);
showFileSize(`l.js`, `dist/l.js`);
showFileSize(`script.js`, `dist/script.js`);
showFileSize(`amp.json`, `dist/amp.json`);
