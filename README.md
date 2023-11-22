# replace-travis-ci-with-github-actions

utility to remove Travis-CI configuration and enable GitHub Actions

<!--status-badges start -->

[![Node CI Workflow Status][github-actions-ci-badge]][github-actions-ci-link]
[![Codecov][coverage-badge]][coverage-link]
![SLSA Level 2][slsa-badge]

<!--status-badges end -->

## Table of Contents

* [Motivation](#motivation)
* [Usage](#usage)
  * [Installation](#installation)
  * [Example](#example)
    * [Import](#import)
    * [Execute](#execute)
* [Contributing](#contributing)
  * [Dependencies](#dependencies)
  * [Verification](#verification)

## Motivation

While Travis CI had a big impact on moving such services forward, I've had
[more](https://travis-ci.community/t/imported-config-results-in-out-of-order-build-stage/8381/8?u=travi)
and [more](https://github.com/travis-ci/travis.rb/issues/732) trouble using
them lately and gotten worse support when needed. They've even recently
[changed their pricing model](https://blog.travis-ci.com/2020-11-02-travis-ci-new-billing)
to be far less friendly to OSS projects.

## Usage

<!--consumer-badges start -->

[![MIT license][license-badge]][license-link]
[![npm][npm-badge]][npm-link]
[![Try on RunKit][runkit-badge]][runkit-link]
![node][node-badge]

<!--consumer-badges end -->

### Installation

```sh
$ npm install @form8ion/replace-travis-ci-with-github-actions --save-prod
```

### Example

#### Import

```javascript
import {replace} from '@form8ion/replace-travis-ci-with-github-actions';
```

#### Execute

```javascript
(async () => {
  await replace({
    projectRoot: process.cwd(),
    vcs: {owner: 'foo', name: 'bar'}
  });
})();
```

## Contributing

<!--contribution-badges start -->

[![PRs Welcome][PRs-badge]][PRs-link]
[![Conventional Commits][commit-convention-badge]][commit-convention-link]
[![Commitizen friendly][commitizen-badge]][commitizen-link]
[![semantic-release][semantic-release-badge]][semantic-release-link]
[![Renovate][renovate-badge]][renovate-link]

<!--contribution-badges end -->

### Dependencies

```sh
$ nvm install
$ npm install
```

### Verification

```sh
$ npm test
```

[PRs-link]: http://makeapullrequest.com

[PRs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg

[commit-convention-link]: https://conventionalcommits.org

[commit-convention-badge]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg

[commitizen-link]: http://commitizen.github.io/cz-cli/

[commitizen-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg

[semantic-release-link]: https://github.com/semantic-release/semantic-release

[semantic-release-badge]: https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release

[renovate-link]: https://renovatebot.com

[renovate-badge]: https://img.shields.io/badge/renovate-enabled-brightgreen.svg?logo=renovatebot

[github-actions-ci-link]: https://github.com/form8ion/replace-travis-ci-with-github-actions/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster

[github-actions-ci-badge]: https://img.shields.io/github/actions/workflow/status/form8ion/replace-travis-ci-with-github-actions/node-ci.yml.svg?branch=master&logo=github

[coverage-link]: https://codecov.io/github/form8ion/replace-travis-ci-with-github-actions

[coverage-badge]: https://img.shields.io/codecov/c/github/form8ion/replace-travis-ci-with-github-actions.svg

[license-link]: LICENSE

[license-badge]: https://img.shields.io/github/license/form8ion/replace-travis-ci-with-github-actions.svg

[npm-link]: https://www.npmjs.com/package/@form8ion/replace-travis-ci-with-github-actions

[npm-badge]: https://img.shields.io/npm/v/@form8ion/replace-travis-ci-with-github-actions.svg

[runkit-link]: https://npm.runkit.com/@form8ion/replace-travis-ci-with-github-actions

[runkit-badge]: https://badge.runkitcdn.com/@form8ion/replace-travis-ci-with-github-actions.svg

[node-badge]: https://img.shields.io/node/v/@form8ion/replace-travis-ci-with-github-actions?logo=node.js

[slsa-badge]: https://slsa.dev/images/gh-badge-level2.svg
