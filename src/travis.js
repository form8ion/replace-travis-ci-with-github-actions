import {promises as fs} from 'fs';
import execa from '../thirdparty-wrappers/execa';

export default async function ({projectRoot}) {
  const pathToPackageFile = `${projectRoot}/package.json`;
  const packageContents = JSON.parse(await fs.readFile(pathToPackageFile, 'utf-8'));
  const {
    'lint:travis': lintTravis,
    'disabled:lint:travis': disabledLintTravis,
    ...remainingScripts
  } = packageContents.scripts;

  await Promise.all([
    fs.unlink(`${projectRoot}/.travis.yml`),
    fs.writeFile(pathToPackageFile, JSON.stringify({...packageContents, scripts: remainingScripts})),
    execa('npm', ['uninstall', 'travis-lint', '@travi/travis-lint'])
  ]);

  return {nextSteps: [{summary: 'Remove the Travis CI badge from the README'}]};
}
