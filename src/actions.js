import {scaffold} from '@form8ion/github-actions-node-ci';

export default function ({projectRoot, vcs}) {
  return scaffold({projectRoot, vcs});
}
