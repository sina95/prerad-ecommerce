import React, { useState, useEffect, useCallback } from "react";
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

export const quantityCheck = (cart) => {
  // e.stopPropagation();
  // e.preventDefault();
  let quantityCheckState = [];
  authAxios()
    .post(checkIfQuantityExistURL, cart)
    .then((res) => {
      res.data.map((item) => {
        let cartItem = cart.find((obj) => obj.id === item.id);
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
      return "Test";
    });
};

const Cart = (props) => {
  const [checkQuantityModal, setCheckQuantityModal] = useState(false);
  const [quantityCheckState, setQuantityCheckState] = useState([]);
  let totalPrice = 0;
  const onClick = useCallback(() => {
    let { cart } = props;

    setQuantityCheckState(
      ["Ajmo"],
      authAxios()
        .post(checkIfQuantityExistURL, cart)
        .then((res) => {
          res.data.map((item) => {
            let cartItem = cart.find((obj) => obj.id === item.id);
            let { quantity, name, id } = cartItem;
            if (quantity > item.current_quantity) {
              console.log(quantity);
              setQuantityCheckState(
                (quantityCheckState) => [
                  ...quantityCheckState,
                  {
                    id: id,
                    current_quantity: item.current_quantity,
                    message: `Item ${name} id: ${id} is available in quantity: ${item.current_quantity}.`,
                  },
                ],
                console.log(quantityCheckState)
              );
            }
          });
        })
      // .then(() => console.log(quantityCheckState))
    );
    // .then(() => setQuantityCheckState(quantityCheckState));
  });

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
            defaultValue={element.quantity}
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
      open={props.quantityCheckState.length > 0 && checkQuantityModal}
      onClose={() => setCheckQuantityModal(false)}
      closeIcon
    >
      <Header icon="archive" content="Quantity Notation" />
      <Modal.Content>
        {props.quantityCheckState.map((state) => (
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
            props.quantityCheckState.map((state) => {
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
          onClick={(e) => {
            // setCheckQuantityModal(true);
            // props.quantityCheck(e);
            // props.quantityCheckModal(e);
            // if (checkQuantityModal === true) {
            //   props.nextStep();
            // }
            // let test = quantityCheck(props.cart);
            {
              onClick();
            }
          }}
        >
          Next step
        </Button>
      </Button.Group>
    </div>
  );
};

export default Cart;
