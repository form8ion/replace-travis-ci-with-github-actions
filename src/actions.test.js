import {promises as fs} from 'node:fs';
import * as actionsScaffolder from '@form8ion/github-actions-node-ci';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import enable from './actions.js';

vi.mock('node:fs');
vi.mock('@form8ion/github-actions-node-ci');

describe('GitHub Actions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should enable the workflow', async () => {
    const projectRoot = any.string();
    const vcs = any.simpleObject();
    const actionsResults = any.simpleObject();
    const packageDetails = {scripts: {}};
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf-8')
      .mockResolvedValue(JSON.stringify(packageDetails));
    when(actionsScaffolder.scaffold)
      .calledWith({projectRoot, vcs, tests: {}, visibility: 'Private'})
      .mockResolvedValue(actionsResults);

    expect(await enable({projectRoot, vcs})).toEqual(actionsResults);
  });

  it('should set unit-tests to `true` if the script exists', async () => {
    const projectRoot = any.string();
    const vcs = any.simpleObject();
    const actionsResults = any.simpleObject();
    const packageDetails = {scripts: {'test:unit': any.string()}};
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf-8')
      .mockResolvedValue(JSON.stringify(packageDetails));
    when(actionsScaffolder.scaffold)
      .calledWith({projectRoot, vcs, tests: {unit: true}, visibility: 'Private'})
      .mockResolvedValue(actionsResults);

    expect(await enable({projectRoot, vcs})).toEqual(actionsResults);
  });

  it('should set integration-tests to `true` if the script exists', async () => {
    const projectRoot = any.string();
    const vcs = any.simpleObject();
    const actionsResults = any.simpleObject();
    const packageDetails = {scripts: {'test:integration': any.string()}};
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf-8')
      .mockResolvedValue(JSON.stringify(packageDetails));
    when(actionsScaffolder.scaffold)
      .calledWith({projectRoot, vcs, tests: {integration: true}, visibility: 'Private'})
      .mockResolvedValue(actionsResults);

    expect(await enable({projectRoot, vcs})).toEqual(actionsResults);
  });

  it('should pass `Public` for `visibility` if the project is a public package', async () => {
    const projectRoot = any.string();
    const vcs = any.simpleObject();
    const actionsResults = any.simpleObject();
    const packageDetails = {scripts: {}, publishConfig: {access: 'public'}};
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf-8')
      .mockResolvedValue(JSON.stringify(packageDetails));
    when(actionsScaffolder.scaffold)
      .calledWith({projectRoot, vcs, tests: {}, visibility: 'Public'})
      .mockResolvedValue(actionsResults);

    expect(await enable({projectRoot, vcs})).toEqual(actionsResults);
  });

  it('should pass `Private` for `visibility` if the package is not public', async () => {
    const projectRoot = any.string();
    const vcs = any.simpleObject();
    const actionsResults = any.simpleObject();
    const packageDetails = {scripts: {}, publishConfig: {}};
    when(fs.readFile)
      .calledWith(`${projectRoot}/package.json`, 'utf-8')
      .mockResolvedValue(JSON.stringify(packageDetails));
    when(actionsScaffolder.scaffold)
      .calledWith({projectRoot, vcs, tests: {}, visibility: 'Private'})
      .mockResolvedValue(actionsResults);

    expect(await enable({projectRoot, vcs})).toEqual(actionsResults);
  });
});
