import {promises as fs} from 'fs';
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import * as execa from '../thirdparty-wrappers/execa';
import remove from './travis';

suite('travis-ci', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'readFile');
    sandbox.stub(fs, 'writeFile');
    sandbox.stub(fs, 'unlink');
    sandbox.stub(execa, 'default');
  });

  teardown(() => sandbox.restore());

  test('that config for travis-ci is removed', async () => {
    const projectRoot = any.string();
    const packageContentsWithoutTravisLint = {...any.simpleObject(), scripts: any.simpleObject()};
    fs.readFile
      .withArgs(`${projectRoot}/package.json`, 'utf-8')
      .resolves(JSON.stringify({
        ...packageContentsWithoutTravisLint,
        scripts: {
          ...packageContentsWithoutTravisLint.scripts,
          'lint:travis': any.string(),
          'disabled:lint:travis': any.string()
        }
      }));

    assert.deepEqual(
      await remove({projectRoot}),
      {nextSteps: [{summary: 'Remove the Travis CI badge from the README'}]}
    );
    assert.calledWith(fs.unlink, `${projectRoot}/.travis.yml`);
    assert.calledWith(fs.writeFile, `${projectRoot}/package.json`, JSON.stringify(packageContentsWithoutTravisLint));
    assert.calledWith(execa.default, 'npm uninstall travis-lint @travi/travis-lint');
  });
});
