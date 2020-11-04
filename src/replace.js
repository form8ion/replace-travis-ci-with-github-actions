import removeTravis from './travis';

export default async function ({projectRoot}) {
  await removeTravis({projectRoot});
}
