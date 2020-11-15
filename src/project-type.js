import {projectTypes} from '@form8ion/javascript-core';

export default function ({private: isApplication, main, publishConfig, bin}) {
  if (isApplication) return projectTypes.APPLICATION;
  if (main || publishConfig) return projectTypes.PACKAGE;
  if (bin) return projectTypes.CLI;

  throw new Error('Unable to determine project type from `package.json` details');
}
