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
import { localhost } from "../constants";

class PasswordResetForm extends React.Component {
  constructor(props) {
    super(props);
    this.toggleContent = this.toggleContent.bind(this);
  }

  state = {
    email: "",
    loading: false,
    message: "",
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { email } = this.state;
    const expression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (expression.test(email) === true) {
      this.toggleContent();
      axios
        .post(`${localhost}/dj-rest-auth/password/reset/`, {
          email: email,
        })
        .then((res) => {
          this.toggleContent();
          this.setState({ message: "Verification mail is sent" });
        })
        .catch((err) => {
          this.setState({ message: err });
          this.toggleContent();
        });
    } else this.setState({ message: "Please enter valid email address!" });
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
    const { email, message, loading } = this.state;
    // if (token) {
    //   return <Redirect to="/" />;
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
          {message && <Message info>{message}</Message>}

          <React.Fragment>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  onChange={this.handleChange}
                  value={email}
                  name="email"
                  fluid
                  icon="mail"
                  iconPosition="left"
                  placeholder="E-Mail Addresse"
                />

                <Button
                  color="teal"
                  fluid
                  size="large"
                  loading={loading}
                  disabled={loading}
                >
                  Send email reset
                </Button>
              </Segment>
            </Form>
            <Message>
              Kennen Sie die Kontoinformationen?{" "}
              <NavLink to="/login">Login</NavLink>
            </Message>
          </React.Fragment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default PasswordResetForm;
