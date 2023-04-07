import {promises as fs} from 'node:fs';
import removeBadgePlugin from 'remark-remove-travis-ci-badge';

import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import * as execa from '../thirdparty-wrappers/execa.js';
import * as remark from '../thirdparty-wrappers/remark.js';
import remove from './travis.js';

vi.mock('node:fs');
vi.mock('../thirdparty-wrappers/execa.js');
vi.mock('../thirdparty-wrappers/remark.js');

describe('travis-ci', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should remove config for travis-ci', async () => {
    const projectRoot = any.string();
    const updatedFileContents = any.string();
    const existingReadmeContents = any.string();
    const packageContentsWithoutTravisLint = {...any.simpleObject(), scripts: any.simpleObject()};
    const use = vi.fn();
    const process = vi.fn();
    when(fs.readFile).calledWith(`${projectRoot}/README.md`, 'utf-8').mockResolvedValue(existingReadmeContents);
    when(fs.readFile).calledWith(`${projectRoot}/package.json`, 'utf-8').mockResolvedValue(JSON.stringify({
      ...packageContentsWithoutTravisLint,
      scripts: {
        ...packageContentsWithoutTravisLint.scripts,
        'lint:travis': any.string(),
        'disabled:lint:travis': any.string()
      }
    }));
    remark.default.mockReturnValue({use});
    when(use).calledWith(removeBadgePlugin).mockReturnValue({process});
    when(process).calledWith(existingReadmeContents).mockResolvedValue(updatedFileContents);

    expect(await remove({projectRoot})).toEqual({});
    expect(fs.unlink).toHaveBeenCalledWith(`${projectRoot}/.travis.yml`);
    expect(fs.writeFile).toHaveBeenCalledWith(
      `${projectRoot}/package.json`,
      JSON.stringify(packageContentsWithoutTravisLint)
    );
    expect(execa.default).toHaveBeenCalledWith('npm', ['uninstall', 'travis-lint', '@travi/travis-lint']);
    expect(fs.writeFile).toHaveBeenCalledWith(`${projectRoot}/README.md`, updatedFileContents);
  });
});
