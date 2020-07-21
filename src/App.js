import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import BaseRouter from "./routes";
import * as actions from "./store/actions/auth";
import * as actionsFingerprint from "./store/actions/fingerprint";
import "semantic-ui-less/semantic.less";
import CustomLayout from "./containers/Layout";
import "./index.css";

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
    // this.props.fingerprint();
  }

  render() {
    return (
      <Router>
        <CustomLayout {...this.props}>
          <BaseRouter />
        </CustomLayout>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
    fingerprint: () => dispatch(actionsFingerprint.fingerprint()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
