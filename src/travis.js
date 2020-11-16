import {promises as fs} from 'fs';
import {info} from '@travi/cli-messages';
import removeBadgePlugin from 'remark-remove-travis-ci-badge';
import execa from '../thirdparty-wrappers/execa';
import remark from '../thirdparty-wrappers/remark';

export default async function ({projectRoot}) {
  info('Removing Travis CI configuration', {level: 'secondary'});

  const pathToReadme = `${projectRoot}/README.md`;
  const pathToPackageFile = `${projectRoot}/package.json`;

  const [packageContents, readmeContents] = await Promise.all([
    fs.readFile(pathToPackageFile, 'utf-8'),
    fs.readFile(pathToReadme, 'utf-8')
  ]);

  const packageData = JSON.parse(packageContents);
  const {
    'lint:travis': lintTravis,
    'disabled:lint:travis': disabledLintTravis,
    ...remainingScripts
  } = packageData.scripts;

  await Promise.all([
    remark()
      .use(removeBadgePlugin)
      .process(readmeContents)
      .then(file => fs.writeFile(pathToReadme, `${file}`)),
    fs.unlink(`${projectRoot}/.travis.yml`),
    fs.writeFile(pathToPackageFile, JSON.stringify({...packageData, scripts: remainingScripts})),
    execa('npm', ['uninstall', 'travis-lint', '@travi/travis-lint'])
  ]);

  return {};
}
