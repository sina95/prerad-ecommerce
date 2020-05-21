import React from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from "semantic-ui-react";
import { NavLink, Redirect } from "react-router-dom";
import axios from "axios";
import { localhost, passwordResetConfirmURL } from "../constants";

class PasswordResetConfirmForm extends React.Component {
  constructor(props) {
    super(props);
    this.toggleContent = this.toggleContent.bind(this);
  }

  state = {
    password1: "",
    password2: "",
    loading: false,
    message: "",
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      match: { params },
    } = this.props;
    const { password1, password2 } = this.state;
    if (password1 === password2) {
      this.toggleContent();
      axios
        .post(passwordResetConfirmURL, {
          new_password1: password1,
          new_password2: password2,
          uid: params.uID,
          token: params.token,
        })
        .then((res) => {
          // console.log(res);
          this.toggleContent();
          this.setState({ message: "Password changed!" });
        })
        .catch((err) => {
          console.log(err.response);
          // this.setState({ message: err });
          this.toggleContent();
        });
    } else this.setState({ message: "Password must be same in both field!" });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  toggleContent() {
    this.setState({
      loading: !this.state.loading,
    });
  }

  render() {
    const { password1, password2, message, loading } = this.state;
    // if (message === "Password changed!") {
    //   return <Redirect to="/login" />;
    // }
    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            Password Reset
          </Header>
          {message && message === "Password changed!" ? (
            <Message info>
              Password changed! Please login with new password&nbsp;
              <NavLink to="/login">LOGIN</NavLink>
            </Message>
          ) : (
            <Message info>{message}</Message>
          )}

          <React.Fragment>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  onChange={this.handleChange}
                  value={password1}
                  name="password1"
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                />
                <Form.Input
                  onChange={this.handleChange}
                  value={password2}
                  name="password2"
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Repeat password"
                  type="password"
                />

                <Button
                  color="teal"
                  fluid
                  size="large"
                  loading={loading}
                  disabled={loading}
                >
                  Reset password
                </Button>
              </Segment>
            </Form>
          </React.Fragment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default PasswordResetConfirmForm;
