// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {replace} from './lib/index.cjs';

// remark-usage-ignore-next
stubbedFs();

// #### Execute

(async () => {
  await replace({
    projectRoot: process.cwd(),
    vcs: {owner: 'foo', name: 'bar'}
  });
})();
