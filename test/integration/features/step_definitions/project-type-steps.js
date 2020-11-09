import {Given, Then} from '@cucumber/cucumber';
import {projectTypes} from '@form8ion/javascript-core';
import {promises as fs} from 'fs';
import {assert} from 'chai';
import {safeLoad} from 'js-yaml';

Given('the project is an application', async function () {
  this.projectType = projectTypes.APPLICATION;
});

Given('the project is a cli', async function () {
  this.projectType = projectTypes.CLI;
});

Given('the project is a package', async function () {
  this.projectType = projectTypes.PACKAGE;
});

Then('pushes to prerelease branches will be built', async function () {
  const ciWorkflow = safeLoad(await fs.readFile(`${process.cwd()}/.github/workflows/node-ci.yml`, 'utf-8'));

  assert.deepEqual(ciWorkflow.on.push.branches, ['master', 'alpha', 'beta']);
});

Then('pushes to prerelease branches will not be built', async function () {
  const ciWorkflow = safeLoad(await fs.readFile(`${process.cwd()}/.github/workflows/node-ci.yml`, 'utf-8'));

  assert.deepEqual(ciWorkflow.on.push.branches, ['master']);
});
