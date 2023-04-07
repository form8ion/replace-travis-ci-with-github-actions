import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

import {After, Before, When} from '@cucumber/cucumber';
import any from '@travi/any';
import stubbedFs from 'mock-fs';
import * as td from 'testdouble';
import {dump} from 'js-yaml';

let replace;
const __dirname = dirname(fileURLToPath(import.meta.url));                  // eslint-disable-line no-underscore-dangle
const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

Before(async function () {
  this.execa = await td.replaceEsm('@form8ion/execa-wrapper');

  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({replace} = await import('@form8ion/replace-travis-ci-with-github-actions'));

  stubbedFs({
    node_modules: stubbedNodeModules,
    'package.json': JSON.stringify({scripts: {}}),
    '.travis.yml': dump(any.simpleObject()),
    'README.md': `# project-name

<!--status-badges start -->

<!--status-badges end -->
`
  });
});

After(function () {
  stubbedFs.restore();
  td.reset();
});

When('the service is replaced', async function () {
  this.vcs = {owner: any.word(), name: any.word()};

  this.results = await replace({projectRoot: process.cwd(), vcs: this.vcs});
});
