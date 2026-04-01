import { call, put, takeLatest } from 'redux-saga/effects';
import { submitContactMessage } from '@/modules/contact/api/contact.api';
import {
  submitContactFailure,
  submitContactRequest,
  submitContactSuccess,
} from '@/modules/contact/store/contact.slice';
import type {
  SubmitContactPayload,
  SubmitContactResponse,
} from '@/modules/contact/types/contact.types';

function* handleSubmitContact(action: {
  type: string;
  payload: SubmitContactPayload;
}) {
  try {
    const response: SubmitContactResponse = yield call(
      submitContactMessage,
      action.payload,
    );

    yield put(
      submitContactSuccess(response.message || 'Message sent successfully.'),
    );
  } catch (error) {
    yield put(
      submitContactFailure(
        error instanceof Error ? error.message : 'Failed to send message.',
      ),
    );
  }
}

export function* watchContactSaga() {
  yield takeLatest(submitContactRequest.type, handleSubmitContact);
}
