import {afterEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import * as travisRemover from './travis.js';
import * as actionsEnabler from './actions.js';
import replace from './replace.js';

vi.mock('./travis');
vi.mock('./actions');

describe('replace', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should repalce travis-ci with github actions', async () => {
    const projectRoot = any.string();
    const vcs = any.simpleObject();
    const travisResults = any.simpleObject();
    const actionsResults = any.simpleObject();
    when(travisRemover.default).calledWith({projectRoot}).mockResolvedValue(travisResults);
    when(actionsEnabler.default).calledWith({projectRoot, vcs}).mockResolvedValue(actionsResults);

    expect(await replace({projectRoot, vcs})).toEqual({...travisResults, ...actionsResults});
  });
});
