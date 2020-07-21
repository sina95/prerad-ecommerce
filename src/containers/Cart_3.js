import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Table,
  Button,
  Message,
  Divider,
  Icon,
  Input,
  Label,
  Segment,
  Modal,
  Header,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import _ from "lodash";
import AutosizeInput from "react-input-autosize";
import { checkIfQuantityExistURL } from "../constants";
import { authAxios } from "../utils";

const Cart = (props) => {
  const [checkQuantityModal, setCheckQuantityModal] = useState(false);
  const [quantityCheckState, setQuantityCheckState] = useState([]);
  const [trigger, setTrigger] = useState(0);
  const [nextStep, setNextStep] = useState(0);
  let totalPrice = 0;

  // function quantityCheck() {}

  // useEffect(() => {
  //   return console.log("Test");
  // }, [quantityCheckState]);

  useEffect(() => {
    let { cart } = props;
    // console.log(cart);
    // const testiranje = [...quantityCheckState];
    // testiranje.testiranje = true;

    authAxios()
      .post(checkIfQuantityExistURL, cart)
      .then((res) => {
        let quantityMessage = [];
        const nextStepCounter = nextStep + 1;
        res.data.map((item) => {
          let cartItem = cart.find((obj) => obj.id === item.id);
          let { quantity, name, id } = cartItem;
          if (quantity > item.current_quantity) {
            // console.log(quantity);
            quantityMessage = [
              ...quantityMessage,
              {
                id: id,
                current_quantity: item.current_quantity,
                message: `Item ${name} id: ${id} is available in quantity: ${item.current_quantity}.`,
              },
            ];
            // console.log(test);
          }
        });
        setQuantityCheckState(quantityMessage);
        if (trigger > 0) setCheckQuantityModal(true);
        setNextStep(nextStep + 1);
        if (quantityMessage.length === 0 && nextStepCounter > 1) {
          props.nextStep();
        }

        // console.log(quantityCheckState);
      });
    return setQuantityCheckState([]);
  }, [trigger]);

  const checkQuantity = () => {
    let { cart } = props;
    // console.log(cart);
    // const testiranje = [...quantityCheckState];
    // testiranje.testiranje = true;

    authAxios()
      .post(checkIfQuantityExistURL, cart)
      .then((res) => {
        let test = [];

        res.data.map((item) => {
          let cartItem = cart.find((obj) => obj.id === item.id);
          let { quantity, name, id } = cartItem;
          if (quantity > item.current_quantity) {
            // console.log(quantity);
            test = [
              ...test,
              {
                id: id,
                current_quantity: item.current_quantity,
                message: `Item ${name} id: ${id} is available in quantity: ${item.current_quantity}.`,
              },
            ];
            // console.log(test);
          }
        });
        setQuantityCheckState(test);
        // console.log(quantityCheckState);
      });
    // .then(console.log(test));
    // setQuantityCheckState(testiranje);
    // console.log(quantityCheckState);
    // console.log(quantityCheckState);

    // setCheckQuantityModal(true);
    // if (quantityCheckState) {
    //   props.nextStep();
    // }
  };

  let items = _.map(props.cart, (element, index) => {
    totalPrice += element.price * element.quantity;
    return (
      <Table.Row key={index}>
        <Table.Cell>{index + 1}</Table.Cell>
        <Table.Cell>{element.name}</Table.Cell>
        <Table.Cell>
          <Icon
            circular
            name="minus"
            style={{ float: "left", cursor: "pointer" }}
            onClick={(e) => props.subtractQuantity(e, element)}
          />

          <AutosizeInput
            name="quantity"
            type="number"
            value={element.quantity}
            // defaultValue={element.quantity}
            onChange={(e) => {
              const item = { id: element.id, quantity: Number(e.target.value) };
              props.updateQuantity(e, item);
            }}
          />

          <Icon
            circular
            name="plus"
            style={{ float: "right", cursor: "pointer" }}
            onClick={(e) => props.addQuantity(e, element)}
          />
        </Table.Cell>
        <Table.Cell>{element.price}</Table.Cell>
        <Table.Cell>{(element.price * element.quantity).toFixed(2)}</Table.Cell>
        <Table.Cell>
          <Button
            circular
            icon="trash"
            onClick={(e) => props.handleRemoveItem(e, element)}
          />
        </Table.Cell>
      </Table.Row>
    );
  });

  const itemList = (
    <Table striped padded attached celled textAlign="center">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>SN</Table.HeaderCell>
          <Table.HeaderCell>Product name</Table.HeaderCell>
          <Table.HeaderCell>Quantity</Table.HeaderCell>
          <Table.HeaderCell>Unit Price</Table.HeaderCell>
          <Table.HeaderCell>Subtotal</Table.HeaderCell>
          <Table.HeaderCell></Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>{items}</Table.Body>

      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="6">
            <Button floated="right" onClick={(e) => props.clearCart()}>
              Clear all
            </Button>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );

  const cartEmptyMessage = (
    <Message info>
      <Message.Header>Your shopping-cart is empty.</Message.Header>

      <p>There is no item in your shopping-cart, go add some item now.</p>
    </Message>
  );

  const quantityCheckModal = (
    <Modal
      open={quantityCheckState.length > 0 && checkQuantityModal}
      onClose={() => setCheckQuantityModal(false)}
      closeIcon
    >
      <Header icon="archive" content="Quantity Notation" />
      <Modal.Content>
        {quantityCheckState.map((state) => (
          <p>{state.message}</p>
        ))}

        <p>Do you accept change?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={() => setCheckQuantityModal(false)}>
          <Icon name="remove" /> No
        </Button>
        <Button
          color="green"
          onClick={(e) =>
            quantityCheckState.map((state) => {
              props.updateQuantity(e, {
                id: state.id,
                quantity: state.current_quantity,
              });
              setCheckQuantityModal(false);
            })
          }
        >
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );

  return (
    <div>
      {items.length > 0 ? itemList : cartEmptyMessage}

      <Divider />
      {quantityCheckModal}

      <Button
        content="Total"
        icon="euro"
        label={{
          basic: true,
          pointing: "left",
          content: totalPrice.toFixed(2),
        }}
      />

      <Button.Group floated="right">
        <Button primary as={Link} to="/">
          Continue shopping
        </Button>
        <Button.Or />
        <Button
          color="red"
          disabled={items.length <= 0}
          onClick={() => setTrigger(trigger + 1)}
        >
          Next step
        </Button>
      </Button.Group>
    </div>
  );
};

export default Cart;
