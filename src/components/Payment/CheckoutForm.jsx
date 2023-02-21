import React, { Fragment, useState } from "react";
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";
import { Container } from "react-bootstrap";
import UserServices from "../../services/user.services";

const stripePromise = loadStripe(
  process.env.REACT_APP_KEY
);

const Makepayment = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const customerId = "cus_NM0CofUAdgZOFT";

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    // await stripe

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      // Send the payment method ID to your server for further processing
      try {
        await UserServices.makePaymentUser(
          paymentMethod.id,
          "swapnilbendal155@gmail"
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

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <Fragment>
      <Container>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Card details</label>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
          {error && <div>{error}</div>}
          <button type="submit" disabled={!stripe}>
            {loading ? "Loading..." : "Pay"}
          </button>
        </form>
      </Container>
    </Fragment>
  );
};

const CheckoutForm = () => {
  return (
    <Elements stripe={stripePromise}>
      <Makepayment />
    </Elements>
  );
};

export default CheckoutForm;
