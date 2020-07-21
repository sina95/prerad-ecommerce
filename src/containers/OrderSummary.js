import React from "react";
import {
  Container,
  Dimmer,
  Header,
  Icon,
  Image,
  Label,
  Loader,
  Table,
  Button,
  Message,
  Segment,
  Modal,
  Step,
} from "semantic-ui-react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { authAxios } from "../utils";
import {
  addToCartURL,
  orderSummaryURL,
  orderItemDeleteURL,
  orderItemUpdateQuantityURL,
  checkIfQuantityExistURL,
} from "../constants";
import {
  fetchCart,
  removeFromCart,
  emptyCart,
  subtractQuantity,
  addQuantity,
  updateQuantity,
} from "../store/actions/cart";
import { setShippingOptions } from "../store/actions/shipping";
import { setBillingOptions } from "../store/actions/billing";
import Paypal from "./Paypal";
import Cart from "./Cart";
import Shipping from "./Shipping";
import Billing from "./Billing";
import Confirmation from "./Confirmation";
import axios from "axios";
import toastr from "toastr";

class OrderSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      paymentModalOpen: false,
      quantityCheckState: [],
      quantityModalOpen: false,
    };

    this.nextStep = this.nextStep.bind(this);
    this.previousStep = this.previousStep.bind(this);
    this.submit = this.submit.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.showStep = this.showStep.bind(this);
    this.subtractQuantity = this.subtractQuantity.bind(this);
    this.addQuantity = this.addQuantity.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.paymentMethod = this.paymentMethod.bind(this);
    this.quantityCheck = this.quantityCheck.bind(this);
  }

  handlePaymantOpen = () => this.setState({ paymentModalOpen: true });

  handlePaymantClose = () => this.setState({ paymentModalOpen: false });

  handleQuantityOpen = () => this.setState({ quantityModalOpen: true });
  handleQuantityClose = () => this.setState({ quantityModalOpen: false });

  nextStep() {
    if (
      this.props.billing.data.paymentMethod === "paypal" &&
      this.state.step === 2
    )
      this.setState({ step: this.state.step + 2 });
    else this.setState({ step: this.state.step + 1 });
  }

  previousStep() {
    if (
      this.props.billing.data.paymentMethod === "paypal" &&
      this.state.step === 4
    )
      this.setState({ step: this.state.step - 2 });
    else this.setState({ step: this.state.step - 1 });
  }

  quantityCheck = () => {
    // e.stopPropagation();
    this.setState({ quantityCheckState: [] }, () => {
      authAxios()
        .post(checkIfQuantityExistURL, this.props.cart)
        .then((res) => {
          let quantityCheckState = [];
          res.data.map((item) => {
            let cartItem = this.props.cart.find((obj) => obj.id === item.id);
            let { quantity, name, id } = cartItem;
            if (quantity > item.current_quantity) {
              quantityCheckState = [
                ...quantityCheckState,
                {
                  id: id,
                  current_quantity: item.current_quantity,
                  message: `Item ${name} id: ${id} is available in quantity: ${item.current_quantity}.`,
                },
              ];
            }

            // console.log(this.props.cart.indexOf({ id: item.id }));
          });
          if (quantityCheckState.length > 0) {
            this.handleQuantityOpen();
            this.setState({ quantityCheckState });
          } else if (quantityCheckState.length === 0) {
            this.handlePaymantOpen();
          }
        });
    });
  };

  submit() {
    // if (!this.props.auth) {
    //   toastr.warning("You have to login first to make an order.");
    //   this.props.history.push("/login");
    // } else {
    //   this.props.placeOrder(
    //     this.props.cart,
    //     this.props.shipping.data,
    //     this.props.billing.data
    //   );
    //   this.props.history.push("/");
    // }
    this.quantityCheck();
  }
  paymentMethod() {
    switch (this.props.billing.data.paymentMethod) {
      case "paypal":
        return <Paypal cart={this.props.cart} shipping={this.props.shipping} />;
    }
  }

  handleRemoveItem(e, item) {
    e.stopPropagation();
    this.props.removeFromCart(item.id);
  }
  subtractQuantity(e, item) {
    e.stopPropagation();
    this.props.subtractQuantity(item.id);
  }
  addQuantity(e, item) {
    e.stopPropagation();
    this.props.addQuantity(item.id);
  }
  updateQuantity(e, item) {
    e.stopPropagation();
    this.props.updateQuantity(item.id, item.quantity);
  }

  showStep() {
    switch (this.state.step) {
      case 1:
        return (
          <Cart
            cart={this.props.cart}
            nextStep={this.nextStep}
            handleRemoveItem={this.handleRemoveItem}
            addQuantity={this.addQuantity}
            subtractQuantity={this.subtractQuantity}
            clearCart={this.props.emptyCart}
            updateQuantity={this.updateQuantity}
            quantityCheck={this.quantityCheck}
            quantityCheckState={this.state.quantityCheckState}
          />
        );
      case 2:
        return (
          <Billing
            billing={this.props.billing}
            nextStep={this.nextStep}
            previousStep={this.previousStep}
            setBillingOptions={this.props.setBillingOptions}
          />
        );

      case 3:
        return (
          <Shipping
            billing={this.props.billing}
            shipping={this.props.shipping}
            nextStep={this.nextStep}
            previousStep={this.previousStep}
            setShippingOptions={this.props.setShippingOptions}
          />
        );

      case 4:
        return (
          <Confirmation
            cart={this.props.cart}
            shipping={this.props.shipping}
            billing={this.props.billing}
            previousStep={this.previousStep}
            submit={this.submit}
          />
        );

      default:
        return;
    }
  }

  render() {
    return (
      <div>
        <Step.Group attached="top">
          <Step active={this.state.step === 1}>
            <Icon name="shopping cart" />
            <Step.Content>
              <Step.Title>Confirm items</Step.Title>
            </Step.Content>
          </Step>

          <Step active={this.state.step === 2}>
            <Icon name="payment" />
            <Step.Content>
              <Step.Title>Billing</Step.Title>
              <Step.Description>Enter billing information</Step.Description>
            </Step.Content>
          </Step>

          {this.props.billing.data.paymentMethod === "paypal" ? (
            ""
          ) : (
            <Step active={this.state.step === 3}>
              <Icon name="truck" />
              <Step.Content>
                <Step.Title>Shipping</Step.Title>
                <Step.Description>
                  Choose your shipping options
                </Step.Description>
              </Step.Content>
            </Step>
          )}

          <Step active={this.state.step === 4}>
            <Icon name="info circle" />
            <Step.Content>
              <Step.Title>Confirm Order</Step.Title>
              <Step.Description>Verify order details</Step.Description>
            </Step.Content>
          </Step>
        </Step.Group>

        {this.showStep()}
        <Modal
          open={this.state.paymentModalOpen}
          onClose={this.handlePaymantClose}
          basic
          size="small"
        >
          {/* <Dimmer active>
                      <Loader indeterminate inverted>
                        Preparing...
                      </Loader>
                    </Dimmer> */}
          <Modal.Content>{this.paymentMethod()}</Modal.Content>
        </Modal>
        <Modal
          open={this.state.quantityModalOpen}
          onClose={this.handleQuantityClose}
          closeIcon
        >
          <Header icon="archive" content="Quantity Notation" />
          <Modal.Content>
            {this.state.quantityCheckState.map((state) => (
              <p>{state.message}</p>
            ))}

            <p>Do you accept change?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" onClick={this.handleQuantityClose}>
              <Icon name="remove" /> No
            </Button>
            <Button
              color="green"
              onClick={(e) =>
                this.state.quantityCheckState.map((state) => {
                  this.updateQuantity(e, {
                    id: state.id,
                    quantity: state.current_quantity,
                  });
                  this.handleQuantityClose();
                })
              }
            >
              <Icon name="checkmark" /> Yes
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart.cart,
    shipping: state.shipping,
    billing: state.billing,
    auth: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeFromCart: (id) => dispatch(removeFromCart(id)),
    emptyCart: () => dispatch(emptyCart()),
    setShippingOptions: (data) => dispatch(setShippingOptions(data)),
    setBillingOptions: (data) => dispatch(setBillingOptions(data)),
    subtractQuantity: (id) => dispatch(subtractQuantity(id)),
    addQuantity: (id) => dispatch(addQuantity(id)),
    updateQuantity: (id, quantity) => dispatch(updateQuantity(id, quantity)),
    // fetchCart: () => dispatch(fetchCart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderSummary);
