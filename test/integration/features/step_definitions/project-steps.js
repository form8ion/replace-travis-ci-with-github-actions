import {Then} from '@cucumber/cucumber';
import {promises as fs} from 'fs';
import {assert} from 'chai';
import {safeLoad} from 'js-yaml';

Then('pushes to the mainline branch will be built', async function () {
  const ciWorkflow = safeLoad(await fs.readFile(`${process.cwd()}/.github/workflows/node-ci.yml`, 'utf-8'));

  assert.deepEqual(ciWorkflow.on.push.branches, ['master']);
});
