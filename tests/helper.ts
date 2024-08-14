import flushPromises from 'flush-promises';
import { flushSync } from 'react-dom';

export async function flushAll() {
  await flushPromises();
  flushSync(() => {});
  await flushPromises();
}
