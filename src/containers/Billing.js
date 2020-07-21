import React from "react";
import {
  Segment,
  Form,
  Button,
  Divider,
  Header,
  Icon,
  Grid,
} from "semantic-ui-react";

class Billing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentMethod: "debit card",
    };

    this.nextStep = this.nextStep.bind(this);
    this.handleRadioOnChange = this.handleRadioOnChange.bind(this);
  }

  componentWillMount() {
    if ("data" in this.props.billing) {
      this.setState({ paymentMethod: this.props.billing.data.paymentMethod });
    }
  }

  nextStep() {
    this.props.setBillingOptions(this.state);
    this.props.nextStep();
  }

  handleRadioOnChange(e, obj) {
    this.setState({ paymentMethod: obj.value });
  }

  render() {
    return (
      <div>
        <Segment attached>
          <Form>
            <Header as="h3" attached="top">
              Payment options
            </Header>
            <Segment attached>
              <Grid>
                <Grid.Column
                  verticalAlign="middle"
                  stretched
                  width="1"
                  textAlign="right"
                >
                  <Form.Radio
                    name="paymentMethod"
                    value="paypal"
                    // label="PayPal"
                    checked={this.state.paymentMethod === "paypal"}
                    onChange={this.handleRadioOnChange}
                  ></Form.Radio>
                </Grid.Column>
                <Grid.Column width="2" textAlign="left">
                  <Icon className="base64paypal" size="huge" />
                </Grid.Column>
              </Grid>
              {/* <Form.Radio
                name="paymentMethod"
                value="debit card"
                label="Debit card"
                checked={this.state.paymentMethod === "debit card"}
                onChange={this.handleRadioOnChange}
              />

              <Form.Radio
                name="paymentMethod"
                value="credit card"
                label="Credit card"
                checked={this.state.paymentMethod === "credit card"}
                onChange={this.handleRadioOnChange}
              />

              <Form.Radio
                name="paymentMethod"
                value="cash on delivery"
                label="Cash on delivery"
                checked={this.state.paymentMethod === "cash on delivery"}
                onChange={this.handleRadioOnChange}
              /> */}
            </Segment>
          </Form>
        </Segment>

        <Divider />

        <Button.Group floated="right">
          <Button primary onClick={(e) => this.props.previousStep()}>
            Previous step
          </Button>
          <Button.Or />
          <Button color="red" onClick={this.nextStep}>
            Next step
          </Button>
        </Button.Group>
      </div>
    );
  }
}

export default Billing;
