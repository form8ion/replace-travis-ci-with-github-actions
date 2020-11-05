import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';
import * as travisRemover from './travis';
import * as actionsEnabler from './actions';
import replace from './replace';

suite('replace', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(travisRemover, 'default');
    sandbox.stub(actionsEnabler, 'default');
  });

  teardown(() => sandbox.restore());

  test('that travis is replaced by github-actions', async () => {
    const projectRoot = any.string();
    const vcs = any.simpleObject();
    const travisResults = any.simpleObject();
    const actionsResults = any.simpleObject();
    travisRemover.default.withArgs({projectRoot}).resolves(travisResults);
    actionsEnabler.default.withArgs({projectRoot, vcs}).resolves(actionsResults);

    assert.deepEqual(await replace({projectRoot, vcs}), {...travisResults, ...actionsResults});
  });
});
