import {
  SET_BILLING_OPTIONS,
  CLEAR_BILLING_OPTIONS,
} from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  data: {},
};

const setBillingOptions = (state, action) => {
  return updateObject(state, {
    data: action.data,
  });
};

const clearBillingOptions = (state, action) => {
  return updateObject(state, {
    data: {},
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BILLING_OPTIONS:
      return setBillingOptions(state, action);
    case CLEAR_BILLING_OPTIONS:
      return clearBillingOptions(state, action);
    default:
      return state;
  }
};

export default reducer;
