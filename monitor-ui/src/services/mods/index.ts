import * as errors from './errors';
import * as monitor from './monitor';
import * as test from './test';
import * as user from './user';

(window as any).API = {
  errors,
  monitor,
  test,
  user,
};
