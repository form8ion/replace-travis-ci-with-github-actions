import * as actionsScaffolder from '@form8ion/github-actions-node-ci';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import enable from './actions';

suite('GitHub Actions', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(actionsScaffolder, 'scaffold');
  });

  teardown(() => sandbox.restore());

  test('that the workflow is enabled', async () => {
    const projectRoot = any.string();
    const vcs = any.simpleObject();
    const actionsResults = any.simpleObject();
    actionsScaffolder.scaffold.withArgs({projectRoot, vcs}).resolves(actionsResults);

    assert.equal(await enable({projectRoot, vcs}), actionsResults);
  });
});
