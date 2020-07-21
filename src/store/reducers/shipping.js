import {
  SET_SHIPPING_OPTIONS,
  CLEAR_SHIPPING_OPTIONS,
} from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  data: {},
};

const setShippingOptions = (state, action) => {
  return updateObject(state, {
    data: action.data,
  });
};

const clearShippingOptions = (state, action) => {
  return updateObject(state, {
    data: { deliveryMethod: "direct shipping" },
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SHIPPING_OPTIONS:
      return setShippingOptions(state, action);
    case CLEAR_SHIPPING_OPTIONS:
      return clearShippingOptions(state, action);
    default:
      return state;
  }
};

export default reducer;
