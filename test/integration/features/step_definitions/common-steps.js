import {resolve} from 'path';
import {After, Before, When} from '@cucumber/cucumber';
import any from '@travi/any';
import stubbedFs from 'mock-fs';
import td from 'testdouble';
import {safeDump} from 'js-yaml';

let replace;
const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

Before(function () {
  this.execa = td.replace('execa');

  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({replace} = require('@form8ion/replace-travis-ci-with-github-actions'));

  stubbedFs({
    node_modules: stubbedNodeModules,
    '.travis.yml': safeDump(any.simpleObject()),
    'README.md': `# project-name

<!--status-badges start -->

[![Build Status][ci-badge]][ci-link]

<!--status-badges end -->

[ci-link]: https://travis-ci.com/foo/bar

[ci-badge]: https://img.shields.io/travis/com/foo/bar.svg?branch=master
`
  });
});

After(function () {
  stubbedFs.restore();
});

When('the service is replaced', async function () {
  this.vcs = {owner: any.word(), name: any.word()};

  this.results = await replace({projectRoot: process.cwd(), vcs: this.vcs});
});
