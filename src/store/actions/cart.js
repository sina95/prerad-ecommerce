import {
  CART_START,
  CART_SUCCESS,
  CART_FAIL,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  ADD_QUANTITY,
  SUB_QUANTITY,
  EMPTY_CART,
  UPDATE_QUANTITY,
  CHECK_QUANTITY,
} from "./actionTypes";
import { authAxios } from "../../utils";
import { orderSummaryURL, checkIfQuantityExistURL } from "../../constants";

export const cartStart = () => {
  return {
    type: CART_START,
  };
};

export const cartSuccess = (data) => {
  return {
    type: CART_SUCCESS,
    data,
  };
};

export const cartFail = (error) => {
  return {
    type: CART_FAIL,
    error: error,
  };
};

export const fetchCart = () => {
  return (dispatch) => {
    dispatch(cartStart());
    authAxios()
      .get(orderSummaryURL)
      .then((res) => {
        dispatch(cartSuccess(res.data));
      })
      .catch((err) => {
        dispatch(cartFail(err));
      });
  };
};

export const addToCart = (item) => {
  return {
    type: ADD_TO_CART,
    item,
  };
};
export const removeFromCart = (id) => {
  return {
    type: REMOVE_FROM_CART,
    id,
  };
};
export const subtractQuantity = (id) => {
  return {
    type: SUB_QUANTITY,
    id,
  };
};
export const addQuantity = (id) => {
  return {
    type: ADD_QUANTITY,
    id,
  };
};
export const emptyCart = () => {
  return {
    type: EMPTY_CART,
  };
};

export const updateQuantity = (id, quantity) => {
  return {
    type: UPDATE_QUANTITY,
    id,
    quantity,
  };
};

export const checkQuantity = () => {
  return {
    type: CHECK_QUANTITY,
  };
};
