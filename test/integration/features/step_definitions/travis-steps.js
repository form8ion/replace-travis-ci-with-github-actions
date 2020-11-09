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

Then('the travis config is removed', async function () {
  const pkg = JSON.parse(await fs.readFile(`${process.cwd()}/package.json`, 'utf-8'));

  assert.isUndefined(pkg.scripts['disabled:lint:travis']);
  assert.isUndefined(pkg.scripts['lint:travis']);
  assert.isFalse(await fileExists(`${process.cwd()}/.travis.yml`));
  assert.includeDeepMembers(this.results.nextSteps, [{summary: 'Remove the Travis CI badge from the README'}]);
  td.verify(this.execa('npm uninstall travis-lint @travi/travis-lint'));
});
