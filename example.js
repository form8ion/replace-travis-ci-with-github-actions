// #### Import
// remark-usage-ignore-next 2
import stubbedFs from 'mock-fs';
import {dump} from 'js-yaml';
import {replace} from './lib/index.js';

// remark-usage-ignore-next 5
stubbedFs({
  'package.json': JSON.stringify({scripts: {}, publishConfig: {}}),
  'README.md': '',
  '.travis.yml': dump({})
});

// #### Execute

(async () => {
  await replace({
    projectRoot: process.cwd(),
    vcs: {owner: 'foo', name: 'bar'}
  });
})();
