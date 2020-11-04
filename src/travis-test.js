import {promises as fs} from 'fs';
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import remove from './travis';

suite('travis-ci', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'readFile');
    sandbox.stub(fs, 'writeFile');
    sandbox.stub(fs, 'unlink');
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

    await remove({projectRoot});

    assert.calledWith(fs.unlink, `${projectRoot}/.travis.yml`);
    assert.calledWith(fs.writeFile, `${projectRoot}/package.json`, JSON.stringify(packageContentsWithoutTravisLint));
  });
});
