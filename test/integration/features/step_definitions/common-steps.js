import {promises as fs} from 'fs';
import {resolve} from 'path';
import {projectTypes} from '@form8ion/javascript-core';
import {After, Before, When} from '@cucumber/cucumber';
import any from '@travi/any';
import stubbedFs from 'mock-fs';
import td from 'testdouble';
import {safeDump} from 'js-yaml';

let replace;
const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

async function updatePackageDetailsForProjectType(type = any.fromList(Object.values(projectTypes)), visibility) {
  let updatedContents;
  const pathToPackageFile = `${process.cwd()}/package.json`;
  const packageContents = JSON.parse(await fs.readFile(pathToPackageFile, 'utf-8'));

  if (projectTypes.APPLICATION === type) {
    updatedContents = {...packageContents, private: true};
  }

  if (projectTypes.CLI === type) {
    updatedContents = {
      ...packageContents,
      bin: {foo: any.string()},
      publishConfig: {
        ...any.simpleObject(),
        ...'Public' === visibility && {access: 'public'},
        ...'Private' === visibility && {access: 'restricted'}
      }
    };
  }

  if (projectTypes.PACKAGE === type) {
    updatedContents = {
      ...packageContents,
      main: any.string(),
      publishConfig: {
        ...any.simpleObject(),
        ...'Public' === visibility && {access: 'public'},
        ...'Private' === visibility && {access: 'restricted'}
      }
    };
  }

  if (`simple-${projectTypes.PACKAGE}` === type) {
    updatedContents = {
      ...packageContents,
      publishConfig: {
        ...any.simpleObject(),
        ...'Public' === visibility && {access: 'public'},
        ...'Private' === visibility && {access: 'restricted'}
      }
    };
  }

  await fs.writeFile(pathToPackageFile, JSON.stringify(updatedContents));
}

Before(function () {
  this.execa = td.replace('execa');

  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({replace} = require('@form8ion/replace-travis-ci-with-github-actions'));

  stubbedFs({
    node_modules: stubbedNodeModules,
    'package.json': JSON.stringify({scripts: {}}),
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
  await updatePackageDetailsForProjectType(this.projectType, this.visibility);

  this.results = await replace({projectRoot: process.cwd(), vcs: this.vcs});
});
