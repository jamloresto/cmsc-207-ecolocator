import { call, put, takeLatest } from 'redux-saga/effects';
import { adminLogin } from '@/modules/auth/api/auth.api';
import type {
  AdminLoginPayload,
  AdminLoginResponse,
} from '@/modules/auth/types/auth.types';
import {
  loginFailure,
  loginRequest,
  loginSuccess,
} from '@/modules/auth/store/auth.slice';

function* handleLogin(action: { type: string; payload: AdminLoginPayload }) {
  try {
    const response: AdminLoginResponse = yield call(adminLogin, action.payload);

    yield put(loginSuccess(response.user));
  } catch (error) {
    yield put(
      loginFailure(
        error instanceof Error
          ? error.message
          : 'Unable to sign in. Please try again.',
      ),
    );
  }
}

export function* watchAuthSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
}
