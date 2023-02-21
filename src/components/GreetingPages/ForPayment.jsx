import { Fragment } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ForPayment = () => { 
    const navigate = useNavigate()
    const forPayment = (e) => {
        navigate('/')
    }
  return (
    <Fragment>
      <Container className="py-6 text-center">
        <div className="display-4 mt-5">Thank you for the payment</div>
        <div className="display-4">Please Check Your Email for the Payment Recipt</div>
        <Button
          className="px-5 mt-3"
          style={{ letterSpacing: "2px", fontWeight: "600" }}
          onClick= {forPayment}
        >
          Click Here
        </Button>
      </Container>
    </Fragment>
  );
};

export default ForPayment;
