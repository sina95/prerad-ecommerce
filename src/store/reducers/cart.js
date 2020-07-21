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
} from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  shoppingCart: null,
  error: null,
  loading: false,
  cart: [],
};

const cartStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
};

const cartSuccess = (state, action) => {
  return updateObject(state, {
    shoppingCart: action.data,
    error: null,
    loading: false,
  });
};

const cartFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const addToCart = (state, action) => {
  const checkCartIdExist = (obj) => obj.id === action.item.id;
  return updateObject(
    state,
    state.cart.some(checkCartIdExist)
      ? null
      : {
          cart: [...state.cart, { ...action.item, quantity: 1 }],
        }
  );
};
const removeFromCart = (state, action) => {
  return updateObject(state, {
    cart: state.cart.filter((item) => item.id !== action.id),
  });
};
const addQuantity = (state, action) => {
  return updateObject(state, {
    cart: state.cart.map((obj) => {
      if (obj.id === action.id) return { ...obj, quantity: obj.quantity + 1 };
      return obj;
    }),
  });
};
const subQuantity = (state, action) => {
  return updateObject(state, {
    cart: state.cart.map((obj) => {
      if (obj.id === action.id && obj.quantity > 1)
        return { ...obj, quantity: obj.quantity - 1 };
      return obj;
    }),
  });
};
const emptyCart = (state, action) => {
  return updateObject(state, { cart: [] });
};
const updateQuantity = (state, action) => {
  return updateObject(state, {
    cart: state.cart.map((obj) => {
      if (obj.id === action.id) return { ...obj, quantity: action.quantity };
      return obj;
    }),
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_START:
      return cartStart(state, action);
    case CART_SUCCESS:
      return cartSuccess(state, action);
    case CART_FAIL:
      return cartFail(state, action);
    case ADD_TO_CART:
      return addToCart(state, action);
    case REMOVE_FROM_CART:
      return removeFromCart(state, action);
    case ADD_QUANTITY:
      return addQuantity(state, action);
    case SUB_QUANTITY:
      return subQuantity(state, action);
    case EMPTY_CART:
      return emptyCart(state, action);
    case UPDATE_QUANTITY:
      return updateQuantity(state, action);
    default:
      return state;
  }
};

export default reducer;
