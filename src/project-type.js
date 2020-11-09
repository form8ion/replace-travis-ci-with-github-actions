import {projectTypes} from '@form8ion/javascript-core';

export default function ({private: isApplication, main, bin}) {
  if (isApplication) return projectTypes.APPLICATION;
  if (main) return projectTypes.PACKAGE;
  if (bin) return projectTypes.CLI;

  throw new Error('Unable to determine project type from `package.json` details');
}
