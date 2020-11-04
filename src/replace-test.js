import any from '@travi/any';
import sinon from 'sinon';
import {assert} from 'chai';
import * as travisRemover from './travis';
import replace from './replace';

suite('replace', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(travisRemover, 'default');
  });

  teardown(() => sandbox.restore());

  test('that travis is replaced by github-actions', async () => {
    const projectRoot = any.string();
    const travisResults = any.simpleObject();
    travisRemover.default.withArgs({projectRoot}).resolves(travisResults);

    assert.deepEqual(await replace({projectRoot}), travisResults);
  });
});
