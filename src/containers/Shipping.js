import React from "react";
import {
  Segment,
  Form,
  Button,
  Divider,
  Header,
  Checkbox,
} from "semantic-ui-react";
import { countryListURL } from "../constants";
import axios from "axios";

class Shipping extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveryMethod: "direct shipping",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      country: "Austria",
      address: "",
      rememberDetails: true,
      countries: [],
    };

    this.nextStep = this.nextStep.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleRadioOnChange = this.handleRadioOnChange.bind(this);
    this.handleSelectOnChange = this.handleSelectOnChange.bind(this);
    this.handleCheckboxOnChange = this.handleCheckboxOnChange.bind(this);
  }

  componentWillMount() {
    if ("data" in this.props.shipping) {
      this.setState({
        deliveryMethod: this.props.shipping.data.deliveryMethod,
        firstName: this.props.shipping.data.firstName,
        lastName: this.props.shipping.data.lastName,
        phoneNumber: this.props.shipping.data.phoneNumber,
        email: this.props.shipping.data.email,
        country: this.props.shipping.data.country,
        address: this.props.shipping.data.address,
      });
    }
    // this.handleFetchCountries();
  }
  handleFetchCountries = () => {
    axios
      .get(countryListURL)
      .then((res) => {
        this.setState({ countries: this.handleFormatCountries(res.data) });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleFormatCountries = (countries) => {
    const keys = Object.keys(countries);
    return keys.map((k) => {
      return {
        key: k,
        text: countries[k],
        value: k,
        flag: k.toLowerCase(),
      };
    });
  };

  nextStep() {
    this.props.setShippingOptions(this.state);
    this.props.nextStep();
  }

  handleOnChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleRadioOnChange(e, obj) {
    this.setState({ deliveryMethod: obj.value });
  }

  handleSelectOnChange(e, obj) {
    this.setState({ country: obj.value });
  }

  handleCheckboxOnChange(e, obj) {
    this.setState({ rememberDetails: !this.state.rememberDetails });
  }

  render() {
    let countryOptions = [
      { key: "japan", value: "japan", flag: "jp", text: "Japan" },
      {
        key: "south korea",
        value: "south korea",
        flag: "kr",
        text: "South Korea",
      },
      { key: "taiwan", value: "taiwan", flag: "tw", text: "Taiwan" },
      { key: "uk", value: "uk", flag: "gb", text: "United Kingdom" },
      { key: "us", value: "us", flag: "us", text: "United States" },
    ];

    return (
      <React.Fragment>
        {this.props.billing.data.paymentMethod === "paypal" ? (
          <Header as="h3" attached="top">
            Shipping address will be provided over PayPal page
          </Header>
        ) : (
          <Segment attached>
            <Form>
              <Header as="h3" attached="top">
                Delivery options
              </Header>

              <Segment attached>
                <Form.Radio
                  name="deliveryMethod"
                  value="direct shipping"
                  label="Direct shipping"
                  checked={this.state.deliveryMethod === "direct shipping"}
                  onChange={this.handleRadioOnChange}
                />

                <Form.Radio
                  name="deliveryMethod"
                  value="drop shipping"
                  label="Drop shipping"
                  checked={this.state.deliveryMethod === "drop shipping"}
                  onChange={this.handleRadioOnChange}
                />

                <Form.Radio
                  name="deliveryMethod"
                  value="in-store pickup"
                  label="In-store pickup"
                  checked={this.state.deliveryMethod === "in-store pickup"}
                  onChange={this.handleRadioOnChange}
                />
              </Segment>

              <Header as="h3" attached="top">
                Details of recipient
              </Header>
              <Segment attached>
                <Form.Input
                  name="firstName"
                  value={this.state.firstName}
                  label="First Name"
                  placeholder="First Name"
                  onChange={this.handleOnChange}
                />

                <Form.Input
                  name="lastName"
                  value={this.state.lastName}
                  label="Last Name"
                  placeholder="Last Name"
                  onChange={this.handleOnChange}
                />

                <Form.Input
                  required
                  name="phoneNumber"
                  value={this.state.phoneNumber}
                  label="Phone Number"
                  placeholder="Phone Number"
                  onChange={this.handleOnChange}
                />

                <Form.Input
                  name="email"
                  value={this.state.email}
                  label="Email"
                  placeholder="Email"
                  onChange={this.handleOnChange}
                />

                <Form.Select
                  search
                  label="Country"
                  placeholder="Country"
                  options={this.state.countries}
                  defaultValue={this.state.country}
                  onChange={this.handleSelectOnChange}
                />

                <Form.Input
                  name="address"
                  value={this.state.address}
                  label="Address"
                  placeholder="Address"
                  onChange={this.handleOnChange}
                />

                <Checkbox
                  label="Remember my details"
                  defaultChecked={true}
                  onChange={this.handleCheckboxOnChange}
                />
              </Segment>
            </Form>
          </Segment>
        )}
        <Divider />
        <Button.Group floated="right">
          <Button primary onClick={(e) => this.props.previousStep()}>
            Previous step
          </Button>
          <Button.Or />
          <Button
            color="red"
            onClick={this.nextStep}
            disabled={
              this.state.firstName === "" ||
              this.state.lastName === "" ||
              this.state.phoneNumber === "" ||
              this.state.email === "" ||
              this.state.country === "" ||
              this.state.address === ""
            }
          >
            Next step
          </Button>
        </Button.Group>
      </React.Fragment>
    );
  }
}

export default Shipping;
