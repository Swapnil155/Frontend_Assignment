import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Fragment, useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  FormLabel,
  FormText,
  Modal,
  Row,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import UserServices from "../../../services/user.services";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};
const stripePromise = loadStripe(process.env.REACT_APP_KEY);

const MyVerticallyCenteredModal = (props) => {
  const navigate = useNavigate();
  const elements = useElements();
  const stripe = useStripe();
  const [product, setProduct] = useState({
    plan: "",
    price: "",
    email: "",
  });
  const [loader, setLoader] = useState(false);
  const [show, setShow] = useState(false);
  const [toastBg, setToastBg] = useState("");
  const [serverError, setServerError] = useState("");

  const cookies = new Cookies();

  const user = cookies.get("user");
  // console.log(user)

  useEffect(() => {
    if (cookies.get("user") === undefined) navigate("/login");

    setProduct({
      ...product,
      plan: props.plan,
      price: props.price,
    });
  }, [props]);

  const [cardError, setCardError] = useState("");

  const onChangeHadler = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(product);
    setLoader(true);
    // console.log(elements.getElement(CardNumberElement));

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement),
    });

    if (error) {
      console.log(error);
      setCardError({ code: error.code, message: error.message });
      setLoader(false);
      // console.log(cardError)
    } else {
      setCardError("");
      console.log(paymentMethod);

      if (user) {
        const user_id = user._id;
        // console.log(`user Details Id: ${user_id}`);

        try {
          await UserServices.makePaymentUser(paymentMethod.id, product, user_id)
            .then(async (res) => {
              // console.log(res);

              if (res.status === 200) {
                const client_secret = res.data.client_secret;
                const { paymentIntent } = await stripe.confirmCardPayment(
                  client_secret
                );

                console.log(`confirmPayment :`, paymentIntent);

                if (paymentIntent.status === "succeeded") {
                  // console.log(res.data.paymentId._id)
                  const id_paymment = res.data.paymentId._id;
                  await UserServices.UpdatePaymentStatus(
                    id_paymment,
                    user_id
                  ).then((res) => {
                    console.log(res);

                    setShow(true);
                    setToastBg(`bg-success`);
                    setServerError(res.data.message);
                    //
                  });
                  setTimeout(() => {
                    navigate("/ThankYou-For-Payment");
                    // window.location.reload(false)
                  }, 1000);
                  // navigate("/login");
                }
              }

              if (
                res.status === 400 ||
                res.status === 401 ||
                res.status === 503 ||
                res.status === 403
              ) {
                setShow(true);
                setToastBg(`bg-danger`);
                setServerError(res.data.Error[0].error);
              }

              // console.log(confirmPayment.paymentIntent.status);

              // console.log(client_secret);
              setLoader(false);
            })
            .catch((err) => {
              console.log(err);
              setLoader(false);
            });
        } catch (error) {
          setLoader(false);
          console.log(error);

          setShow(true);
          setToastBg(`bg-danger`);
          // setServerError(res.data.Error[0].message);
          // setServerError(`Error`);
        }
      }
    }
  };

  return (
    <Fragment>
      <ToastContainer className="pb-5" position="bottom-center">
        <Toast
          className={toastBg}
          onClose={() => setShow(false)}
          show={show}
          delay={4000}
          autohide
        >
          <div
            className="py-3 text-white text-center"
            style={{ fontSize: "1rem" }}
          >
            {serverError}
          </div>
        </Toast>
      </ToastContainer>

      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Make Payment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => submitHandler(e)} className="py-3 mx-3">
            <Row>
              <Col sm={6}>
                <FormGroup className="mb-3" controlId="formBasiProfile">
                  <FormLabel> Plan</FormLabel>
                  <Form.Control
                    type="text"
                    defaultValue={props.plan}
                    name="plan"
                    disabled
                    required
                  />
                </FormGroup>
              </Col>

              <Col sm={6}>
                <FormGroup className="mb-3" controlId="formBasiProfile">
                  <FormLabel> prices</FormLabel>
                  <Form.Control
                    type="text"
                    defaultValue={props.price}
                    name="prices"
                    disabled
                    required
                  />
                </FormGroup>
              </Col>

              <Col sm={12}>
                <FormGroup className="mb-3" controlId="formBasiProfile">
                  <FormLabel> Email</FormLabel>
                  <Form.Control
                    type="email"
                    onChange={onChangeHadler}
                    name="email"
                    required
                  />
                </FormGroup>
              </Col>

              <Col sm={4}>
                <FormLabel> Card Number</FormLabel>
                <div className="border rounded p-2 w-auto">
                  <CardNumberElement options={CARD_ELEMENT_OPTIONS} />{" "}
                </div>
                <FormText className="text-danger">
                  {cardError && cardError.code === "incomplete_number"
                    ? cardError.message
                    : ""}
                </FormText>
              </Col>

              <Col sm={4}>
                <FormGroup className="mb-3" controlId="formBasiProfile">
                  <FormLabel> Expiry</FormLabel>
                  <div className="border rounded p-2 w-auto">
                    <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />{" "}
                  </div>
                  <FormText className="text-danger">
                    {cardError && cardError.code === "incomplete_expiry"
                      ? cardError.message
                      : ""}
                  </FormText>
                </FormGroup>
              </Col>

              <Col sm={4}>
                <FormGroup className="mb-3" controlId="formBasiProfile">
                  <FormLabel> CVV</FormLabel>
                  <div className="border rounded p-2 w-auto">
                    <CardCvcElement options={CARD_ELEMENT_OPTIONS} />{" "}
                  </div>
                  <FormText className="text-danger">
                    {cardError && cardError.code === "incomplete_cvc"
                      ? cardError.message
                      : ""}
                  </FormText>
                </FormGroup>
              </Col>
            </Row>

            <FormGroup className="text-center mt-3">
              <Button variant="primary" type="submit" disabled={loader}>
                {!loader ? (
                  `Buy $ ${props.price}`
                ) : (
                  <Fragment>
                    <Spinner
                      size="sm"
                      className="me-3"
                      animation="border"
                      variant="light"
                    />
                    {`Buy $ ${props.price}`}
                  </Fragment>
                )}
              </Button>
            </FormGroup>
          </Form>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

const Payment = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <MyVerticallyCenteredModal
        show={props.show}
        onHide={props.onHide}
        plan={props.plan}
        price={props.price}
      />
    </Elements>
  );
};

export default Payment;
