import React, { useState, useRef, useEffect } from "react";
import { Segment, Loader, Header, Divider, Icon } from "semantic-ui-react";

const Paypal = (props) => {
  const [paidFor, setPaidFor] = useState(false);
  const [loaded, setLoaded] = useState(false);

  let paypalRef = useRef();
  const product = {
    price: props.data.total,
    description: "Motorbike parts",
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?currency=EUR&client-id=AfdxQn9btaKl1117LhjUvzc0-patFlDrlnXxNiW0y2w6zZ2lE39jIcpSoIKwB8weUkYHyGS-ua8dIAAV";
    script.addEventListener("load", () => setLoaded(true));
    document.body.appendChild(script);

    if (loaded) {
      setTimeout(() => {
        window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    description: product.description,
                    amount: {
                      currency_code: "EUR",
                      value: product.price,
                    },
                  },
                ],
              });
            },
            onApprove: async (data, actions) => {
              const order = await actions.order.capture();

              setPaidFor(true);
              console.log(order);
            },
          })
          .render(paypalRef);
      });
    }
  });
  return (
    <React.Fragment>
      {paidFor ? (
        <Segment>
          <Header>
            Thank you for order. <Icon name="motorcycle" />
          </Header>
        </Segment>
      ) : (
        <Segment textAlign="center">
          <Header>
            {product.description} for €{props.orderTotal}
          </Header>
          <Header>Choose your paymant method:</Header>
          <Divider />
          {!loaded && (
            <Loader indeterminate inverted>
              Preparing...
            </Loader>
          )}
          <div ref={(v) => (paypalRef = v)} />
        </Segment>
      )}
    </React.Fragment>
  );
};

export default Paypal;
