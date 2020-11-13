import deepmerge from 'deepmerge';
import {info} from '@travi/cli-messages';
import removeTravis from './travis';
import enableActions from './actions';

export default async function ({projectRoot, vcs}) {
  info('Replacing Travis CI with GitHub Actions');

  return deepmerge.all(await Promise.all([
    removeTravis({projectRoot}),
    enableActions({projectRoot, vcs})
  ]));
}
