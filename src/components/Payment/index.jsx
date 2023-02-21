import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  ElementsConsumer,
  PaymentElement,
  useStripe,
} from "@stripe/react-stripe-js/dist/react-stripe";
// import {useStripe} from '@stripe/react-stripe-js'
import { loadStripe } from "@stripe/stripe-js";
import {
  Button,
  Card,
  Container,
  Form,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import axios from "axios";

const CheckOut = () => {
  // const stripe = useStripe()

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  };
  return (
    <Container className="py-6">
      <Card className="border-0 shadow px-3 py-3" style={{ width: "20rem" }}>
        <Form onSubmit={onSubmitHandler}>
          <FormGroup className="mb-3" controlId="formBasicNumber">
            <FormLabel>Card Number</FormLabel>
            <CardNumberElement />
          </FormGroup>
          <FormGroup className="mb-3" controlId="formBasicExpriy">
            <FormLabel>Expiry Number</FormLabel>
            <CardExpiryElement />
          </FormGroup>
          <FormGroup className="mb-3" controlId="formBasicCVC">
            <FormLabel>CVC</FormLabel>
            <CardCvcElement />
          </FormGroup>
          <Button variant="primary" type="submit">
            Make Payment
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

const Payment = () => (
  <ElementsConsumer stripe={loadStripe(process.env.REACT_APP_KEY)}>
    <CheckOut />
  </ElementsConsumer>
);

export default Payment;
