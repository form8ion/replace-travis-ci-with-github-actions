import {resolve} from 'path';
import {After, Before, When} from '@cucumber/cucumber';
import any from '@travi/any';
import stubbedFs from 'mock-fs';
import {safeDump} from 'js-yaml';

let replace;
const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

Before(function () {
  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({replace} = require('@form8ion/replace-travis-ci-with-github-actions'));

  stubbedFs({
    node_modules: stubbedNodeModules,
    '.travis.yml': safeDump(any.simpleObject())
  });
});

After(function () {
  stubbedFs.restore();
});

When('the service is replaced', async function () {
  this.results = await replace({projectRoot: process.cwd()});
});
