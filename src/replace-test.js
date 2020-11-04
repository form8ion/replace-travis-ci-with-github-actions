import replace from './replace';

suite('replace', () => {
  test('that travis is replaced by github-actions', async () => {
    await replace();
  });
});
