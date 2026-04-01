import { call, put, takeLatest } from 'redux-saga/effects';
import { submitLocationSuggestion } from '@/modules/location-suggestions/api/location-suggestions.api';
import {
  submitLocationSuggestionFailure,
  submitLocationSuggestionRequest,
  submitLocationSuggestionSuccess,
} from '@/modules/location-suggestions/store/location-suggestions.slice';
import type {
  SubmitLocationSuggestionPayload,
  SubmitLocationSuggestionResponse,
} from '@/modules/location-suggestions/types/location-suggestions.types';
import { ApiError } from '@/lib/api-client';

function* handleSubmitLocationSuggestion(action: {
  type: string;
  payload: SubmitLocationSuggestionPayload;
}) {
  try {
    const response: SubmitLocationSuggestionResponse = yield call(
      submitLocationSuggestion,
      action.payload,
    );

    yield put(
      submitLocationSuggestionSuccess(
        response.message || 'Location suggestion submitted successfully.',
      ),
    );
  } catch (error) {
    yield put(
      submitLocationSuggestionFailure(
        error instanceof ApiError
          ? error.message
          : 'Failed to submit location suggestion.',
      ),
    );
  }
}

export function* watchLocationSuggestionsSaga() {
  yield takeLatest(
    submitLocationSuggestionRequest.type,
    handleSubmitLocationSuggestion,
  );
}
