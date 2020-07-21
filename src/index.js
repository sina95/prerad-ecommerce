import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { loadState, saveState } from "./store/utility";
import throttle from "lodash/throttle";

import authReducer from "./store/reducers/auth";
import cartReducer from "./store/reducers/cart";
import shippingReducer from "./store/reducers/shipping";
import billingReducer from "./store/reducers/billing";

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  shipping: shippingReducer,
  billing: billingReducer,
});

const persistedState = loadState();
const store = createStore(
  rootReducer,
  persistedState,
  composeEnhances(applyMiddleware(thunk))
);
// const store = createStore(authReducer, persistedState);

store.subscribe(
  throttle(() => {
    saveState({
      auth: store.getState().auth,
      cart: store.getState().cart,
      shipping: store.getState().shipping,
      billing: store.getState().billing,
    });
  }, 1000)
);
const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
registerServiceWorker();
