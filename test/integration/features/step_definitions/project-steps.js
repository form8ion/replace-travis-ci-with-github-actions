import {promises as fs} from 'node:fs';
import {load} from 'js-yaml';

import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';

Then('pushes to the mainline branch will be built', async function () {
  const ciWorkflow = load(await fs.readFile(`${process.cwd()}/.github/workflows/node-ci.yml`, 'utf-8'));

  assert.deepEqual(ciWorkflow.on.push.branches, ['master']);
});
