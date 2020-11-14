import {promises as fs} from 'fs';
import {safeLoad} from 'js-yaml';
import any from '@travi/any';
import {assert} from 'chai';
import {Given, Then} from '@cucumber/cucumber';

Given('the project is unit tested', async function () {
  await fs.writeFile(
    `${process.cwd()}/package.json`,
    JSON.stringify({scripts: {'test:unit': any.string()}})
  );
});

Given('the project is not tested', async function () {
  await fs.writeFile(`${process.cwd()}/package.json`, JSON.stringify({scripts: {}}));
});

Given('the project is public', async function () {
  const pathToPackageFile = `${process.cwd()}/package.json`;
  const packageContents = JSON.parse(await fs.readFile(pathToPackageFile, 'utf-8'));

  await fs.writeFile(
    pathToPackageFile,
    JSON.stringify({...packageContents, publishConfig: {access: 'public'}})
  );
});

Given('the project is private', async function () {
  const pathToPackageFile = `${process.cwd()}/package.json`;
  const packageContents = JSON.parse(await fs.readFile(pathToPackageFile, 'utf-8'));

  await fs.writeFile(
    pathToPackageFile,
    JSON.stringify({...packageContents, publishConfig: {access: 'restricted'}})
  );
});

Then('coverage will be reported', async function () {
  const ciWorkflow = safeLoad(await fs.readFile(`${process.cwd()}/.github/workflows/node-ci.yml`, 'utf-8'));

  assert.deepInclude(
    ciWorkflow.jobs.verify.steps,
    {name: 'Upload coverage data to Codecov', run: 'npm run coverage:report'}
  );
});

Then('coverage will not be reported', async function () {
  const ciWorkflow = safeLoad(await fs.readFile(`${process.cwd()}/.github/workflows/node-ci.yml`, 'utf-8'));

  assert.notDeepInclude(
    ciWorkflow.jobs.verify.steps,
    {name: 'Upload coverage data to Codecov', run: 'npm run coverage:report'}
  );
});
