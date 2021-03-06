import {promises as fs} from 'fs';
import * as actionsScaffolder from '@form8ion/github-actions-node-ci';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import * as projectTypeResolver from './project-type';
import enable from './actions';

suite('GitHub Actions', () => {
  let sandbox;
  const projectType = any.word();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(fs, 'readFile');
    sandbox.stub(actionsScaffolder, 'scaffold');
    sandbox.stub(projectTypeResolver, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the workflow is enabled', async () => {
    const projectRoot = any.string();
    const vcs = any.simpleObject();
    const actionsResults = any.simpleObject();
    const packageDetails = {scripts: {}};
    fs.readFile.withArgs(`${projectRoot}/package.json`, 'utf-8').resolves(JSON.stringify(packageDetails));
    projectTypeResolver.default.withArgs(packageDetails).returns(projectType);
    actionsScaffolder.scaffold
      .withArgs({projectRoot, vcs, tests: {}, visibility: 'Private', projectType})
      .resolves(actionsResults);

    assert.equal(await enable({projectRoot, vcs}), actionsResults);
  });

  test('that unit-tests is set to `true` if the script exists', async () => {
    const projectRoot = any.string();
    const vcs = any.simpleObject();
    const actionsResults = any.simpleObject();
    const packageDetails = {scripts: {'test:unit': any.string()}};
    fs.readFile.withArgs(`${projectRoot}/package.json`, 'utf-8').resolves(JSON.stringify(packageDetails));
    projectTypeResolver.default.withArgs(packageDetails).returns(projectType);
    actionsScaffolder.scaffold
      .withArgs({projectRoot, vcs, tests: {unit: true}, visibility: 'Private', projectType})
      .resolves(actionsResults);

    assert.equal(await enable({projectRoot, vcs}), actionsResults);
  });

  test('that integration-tests is set to `true` if the script exists', async () => {
    const projectRoot = any.string();
    const vcs = any.simpleObject();
    const actionsResults = any.simpleObject();
    const packageDetails = {scripts: {'test:integration': any.string()}};
    fs.readFile.withArgs(`${projectRoot}/package.json`, 'utf-8').resolves(JSON.stringify(packageDetails));
    projectTypeResolver.default.withArgs(packageDetails).returns(projectType);
    actionsScaffolder.scaffold
      .withArgs({projectRoot, vcs, tests: {integration: true}, visibility: 'Private', projectType})
      .resolves(actionsResults);

    assert.equal(await enable({projectRoot, vcs}), actionsResults);
  });

  test('that `visibility` is passed as `Public` if the project is a public package', async () => {
    const projectRoot = any.string();
    const vcs = any.simpleObject();
    const actionsResults = any.simpleObject();
    const packageDetails = {scripts: {}, publishConfig: {access: 'public'}};
    fs.readFile.withArgs(`${projectRoot}/package.json`, 'utf-8').resolves(JSON.stringify(packageDetails));
    projectTypeResolver.default.withArgs(packageDetails).returns(projectType);
    actionsScaffolder.scaffold
      .withArgs({projectRoot, vcs, tests: {}, visibility: 'Public', projectType})
      .resolves(actionsResults);

    assert.equal(await enable({projectRoot, vcs}), actionsResults);
  });

  test('that `visibility` is passed as `Private` if the package is not public', async () => {
    const projectRoot = any.string();
    const vcs = any.simpleObject();
    const actionsResults = any.simpleObject();
    const packageDetails = {scripts: {}, publishConfig: {}};
    fs.readFile.withArgs(`${projectRoot}/package.json`, 'utf-8').resolves(JSON.stringify(packageDetails));
    projectTypeResolver.default.withArgs(packageDetails).returns(projectType);
    actionsScaffolder.scaffold
      .withArgs({projectRoot, vcs, tests: {}, visibility: 'Private', projectType})
      .resolves(actionsResults);

    assert.equal(await enable({projectRoot, vcs}), actionsResults);
  });
});
