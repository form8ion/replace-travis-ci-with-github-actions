import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import {fileExists} from '@form8ion/core';

Then('the workflow is defined for GitHub Actions', async function () {
  assert.includeDeepMembers(
    this.results.nextSteps,
    [{summary: 'Enable building branches in GitHub Actions for the chosen dependency updater'}]
  );
  assert.isTrue(await fileExists(`${process.cwd()}/.github/workflows/node-ci.yml`));
});
