import deepmerge from 'deepmerge';
import removeTravis from './travis';
import enableActions from './actions';

export default async function ({projectRoot, vcs}) {
  return deepmerge.all(await Promise.all([
    removeTravis({projectRoot}),
    enableActions({projectRoot, vcs})
  ]));
}
