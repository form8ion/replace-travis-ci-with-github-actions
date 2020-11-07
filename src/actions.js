import {promises as fs} from 'fs';
import {scaffold} from '@form8ion/github-actions-node-ci';

function isPackage(publishConfig) {
  return publishConfig;
}

function isPublicPackage(publishConfig) {
  return isPackage(publishConfig) && 'public' === publishConfig.access;
}

function determineVisibility(publishConfig) {
  return isPublicPackage(publishConfig) ? 'Public' : 'Private';
}

export default async function ({projectRoot, vcs}) {
  const {scripts, publishConfig} = JSON.parse(await fs.readFile(`${projectRoot}/package.json`, 'utf-8'));

  return scaffold({
    projectRoot,
    vcs,
    tests: {...scripts['test:unit'] && {unit: true}},
    visibility: determineVisibility(publishConfig)
  });
}
