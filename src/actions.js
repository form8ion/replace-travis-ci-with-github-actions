import {promises as fs} from 'fs';
import {scaffold} from '@form8ion/github-actions-node-ci';
import determineProjectType from './project-type';

function isPublicPackage(publishConfig) {
  return publishConfig && 'public' === publishConfig.access;
}

function determineVisibility(publishConfig) {
  return isPublicPackage(publishConfig) ? 'Public' : 'Private';
}

export default async function ({projectRoot, vcs}) {
  const packageDetails = JSON.parse(await fs.readFile(`${projectRoot}/package.json`, 'utf-8'));
  const {scripts, publishConfig} = packageDetails;

  return scaffold({
    projectRoot,
    vcs,
    tests: {...scripts['test:unit'] && {unit: true}},
    visibility: determineVisibility(publishConfig),
    projectType: determineProjectType(packageDetails)
  });
}
