import {promises as fs} from 'fs';
import removeBadgePlugin from 'remark-remove-travis-ci-badge';
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import * as execa from '../thirdparty-wrappers/execa';
import * as remark from '../thirdparty-wrappers/remark';
import remove from './travis';

suite('travis-ci', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'readFile');
    sandbox.stub(fs, 'writeFile');
    sandbox.stub(fs, 'unlink');
    sandbox.stub(execa, 'default');
    sandbox.stub(remark, 'default');
  });

  teardown(() => sandbox.restore());

  test('that config for travis-ci is removed', async () => {
    const projectRoot = any.string();
    const updatedFileContents = any.string();
    const existingReadmeContents = any.string();
    const packageContentsWithoutTravisLint = {...any.simpleObject(), scripts: any.simpleObject()};
    const use = sinon.stub();
    const process = sinon.stub();
    fs.readFile
      .withArgs(`${projectRoot}/README.md`, 'utf-8')
      .resolves(existingReadmeContents);
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
    remark.default.returns({use});
    use.withArgs(removeBadgePlugin).returns({process});
    process.withArgs(existingReadmeContents).resolves(updatedFileContents);

    assert.deepEqual(await remove({projectRoot}), {});
    assert.calledWith(fs.unlink, `${projectRoot}/.travis.yml`);
    assert.calledWith(fs.writeFile, `${projectRoot}/package.json`, JSON.stringify(packageContentsWithoutTravisLint));
    assert.calledWith(execa.default, 'npm', ['uninstall', 'travis-lint', '@travi/travis-lint']);
    assert.calledWith(fs.writeFile, `${projectRoot}/README.md`, updatedFileContents);
  });
});
