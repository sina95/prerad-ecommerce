import {
  FINGERPRINT_START,
  FINGERPRINT_SUCCESS,
  FINGERPRINT_FAIL,
} from "../actions/actionTypes";
import { updateObject } from "../utility";
import {
  fingerprintStart,
  fingerprintSuccess,
  fingerprintFail,
} from "../actions/fingerprint";

const initialState = {
  error: null,
  fingerprint: null,
};

const fingerprintStart = (state, action) => {
  return updateObject(state, {
    error: null,
  });
};

const fingerprintSuccess = (state, action) => {
  return updateObject(state, {
    fingerprint: action.payload,
    error: null,
  });
};

const fingerprintFail = (state, action) => {
  return updateObject(state, {
    error: action.payload,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FINGERPRINT_START:
      return fingerprintStart(state, action);
    case FINGERPRINT_SUCCESS:
      return fingerprintSuccess(state, action);
    case FINGERPRINT_FAIL:
      return fingerprintFail(state, action);
    default:
      return state;
  }
};

export default reducer;
