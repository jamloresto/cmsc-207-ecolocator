import { all, fork } from 'redux-saga/effects';
import { watchAuthSaga } from '@/modules/auth/store/auth.saga';
import { watchContactSaga } from '@/modules/contact/store/contact.saga';
import { watchLocationSuggestionsSaga } from '@/modules/location-suggestions/store/location-suggestions.saga';

export function* rootSaga() {
  yield all([
    fork(watchAuthSaga),
    fork(watchContactSaga),
    fork(watchLocationSuggestionsSaga),
  ]);
}
