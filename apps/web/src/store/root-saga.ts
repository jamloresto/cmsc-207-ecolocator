import { all, fork } from 'redux-saga/effects';
import { watchAuthSaga } from '@/modules/auth/store/auth.saga';

export function* rootSaga() {
  yield all([fork(watchAuthSaga)]);
}
