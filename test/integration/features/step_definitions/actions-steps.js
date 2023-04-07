import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import {fileExists} from '@form8ion/core';

Then('the workflow is defined for GitHub Actions', async function () {
  const {badges, nextSteps} = this.results;
  const {owner, name: repoName} = this.vcs;

  assert.deepEqual(
    badges.status['github-actions-ci'],
    {
      text: 'Node CI Workflow Status',
      img: `https://img.shields.io/github/actions/workflow/status/${
        owner
      }/${repoName}/node-ci.yml.svg?branch=master&logo=github`,
      link: `https://github.com/${owner}/${repoName}/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster`
    }
  );
  assert.includeDeepMembers(
    nextSteps,
    [{summary: 'Enable building branches in GitHub Actions for the chosen dependency updater'}]
  );
  assert.isTrue(await fileExists(`${process.cwd()}/.github/workflows/node-ci.yml`));
});
