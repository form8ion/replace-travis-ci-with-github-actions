import {resolve} from 'path';
import {After, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';

const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

After(function () {
  stubbedFs.restore();
});

When('the service is replaced', async function () {
  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  const {replace} = require('@form8ion/replace-travis-ci-with-github-actions');

  stubbedFs({
    node_modules: stubbedNodeModules
  });

  await replace({projectRoot: process.cwd()});
});
