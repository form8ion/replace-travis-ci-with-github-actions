import {promises as fs} from 'fs';
import {fileExists} from '@form8ion/core';
import {Given, Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import td from 'testdouble';

Given('the travis config lint script is enabled', async function () {
  await fs.writeFile(
    `${process.cwd()}/package.json`,
    JSON.stringify({scripts: {'lint:travis': 'travis-lint'}, devDependencies: []})
  );
});

Given('the travis config lint script is disabled', async function () {
  await fs.writeFile(
    `${process.cwd()}/package.json`,
    JSON.stringify({scripts: {'disabled:lint:travis': 'travis-lint'}, devDependencies: []})
  );
});

Given('there is a travis status badge in the README', async function () {
  await fs.writeFile(
    `${process.cwd()}/README.md`,
    `# project-name

<!--status-badges start -->

[![Build Status][ci-badge]][ci-link]

<!--status-badges end -->

[ci-link]: https://travis-ci.com/foo/bar

[ci-badge]: https://img.shields.io/travis/com/foo/bar.svg?branch=master
`
  );
});

Then('the travis config is removed', async function () {
  const pkg = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8'));

  assert.isUndefined(pkg.scripts['disabled:lint:travis']);
  assert.isUndefined(pkg.scripts['lint:travis']);
  assert.isFalse(await fileExists(`${process.cwd()}/.travis.yml`));
  td.verify(this.execa('npm', ['uninstall', 'travis-lint', '@travi/travis-lint']));
});

Then('the travis status badge is removed', async function () {
  assert.notInclude(await fs.readFile(`${process.cwd()}/README.md`, 'utf-8'), 'https://travis-ci.com');
});
