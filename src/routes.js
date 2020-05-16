import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
// import HomepageLayout from "./containers/Home";
import ProductList from "./containers/ProductList";
import ProductDetail from "./containers/ProductDetail";
import OrderSummary from "./containers/OrderSummary";
// import Checkout from "./containers/Checkout";
import Profile from "./containers/Profile";
import ProductListFilterResult from "./containers/ProductListFilterResult";
import Paypal from "./containers/Paypal";
import { localhost } from "./constants";

const BaseRouter = () => (
  <Hoc>
    <Route exact path="/" component={ProductList} />
    <Route path="/products/:productID" component={ProductDetail} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="/order-summary" component={OrderSummary} />
    {/* <Route path="/checkout" component={Checkout} /> */}
    <Route path="/profile" component={Profile} />
    {/* <Route path path="/home" component={HomepageLayout} /> */}
    <Route path="/part-filter" component={ProductListFilterResult} />
    <Route path="/paypal" component={Paypal} />
  </Hoc>
);

export default BaseRouter;
