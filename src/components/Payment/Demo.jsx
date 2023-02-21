import React, { Fragment, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
} from "@stripe/react-stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Container, Stack } from "react-bootstrap";
import UserServices from "../../services/user.services";

const stripePromise = loadStripe(process.env.REACT_APP_KEY);

const CheckoutForm = () => {
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [product, setProduct] = useState({
    name: "Example Product",
    price: 1000,
  }); // product details

  const submitHandler = async (event) => {
    event.preventDefault();

    console.log(elements.getElement(CardNumberElement));
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement),
    });

    console.log(paymentMethod);

    if (error) {
      setError(error.message);
    } else {
      // Send the payment method ID to your server for further processing
      try {
        await UserServices.makePaymentUser(
          paymentMethod.id,
          "swapnilbendal@gmail.com"
        ).then(async (res) => {
          console.log(res);
          const client_secret = res.data.client_secret;
          const confirmPayment = await stripe.confirmCardPayment(client_secret);
          console.log(confirmPayment);
        });
      } catch (error) {
        console.log(error.response);
      }
      console.log(paymentMethod.id);
    }
  };

  return (
    <Fragment>
      <Container className="py-6">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
          <Stack gap={3}>
            <div>
              <CardNumberElement />
            </div>
            <div>
              <CardExpiryElement />
            </div>
            <div>
              <CardCvcElement />
            </div>

            <input
              type="submit"
              value={`Pay - ₹${100}`}
              className="paymentFormBtn"
            />
          </Stack>
        </form>
      </Container>
    </Fragment>
  );
};

const Demo = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Demo;
