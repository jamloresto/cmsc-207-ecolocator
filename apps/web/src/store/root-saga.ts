import { all, fork } from 'redux-saga/effects';
import { watchAuthSaga } from '@/modules/auth/store/auth.saga';
import { watchContactSaga } from '@/modules/contact/store/contact.saga';

export function* rootSaga() {
  yield all([fork(watchAuthSaga), fork(watchContactSaga)]);
}
