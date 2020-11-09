import {projectTypes} from '@form8ion/javascript-core';
import {assert} from 'chai';
import any from '@travi/any';
import determine from './project-type';

suite('project-type', () => {
  test('that an error is thrown when the type cannot be determined', () => {
    assert.throws(() => determine({}), 'Unable to determine project type from `package.json` details');
  });

  test('that the type is determined to be an application when `private` is true', () => {
    assert.equal(determine({private: true}), projectTypes.APPLICATION);
  });

  test('that the type is determined to be a package when `main` is defined', () => {
    assert.equal(determine({main: any.string()}), projectTypes.PACKAGE);
  });

  test('that the type is determined to be a CLI when `bin` is defined', () => {
    assert.equal(determine({bin: any.simpleObject()}), projectTypes.CLI);
  });
});
