import { Fragment } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ForRegister = () => {
    const navigate = useNavigate()
  return (
    <Fragment>
      <Container className="py-6 text-center">
        <div className="display-4 mt-5">Thank you</div>
        <div className="display-4">Please Check Your Email for OTP</div>
        <Button 
          className="px-5 mt-3"
          style={{ letterSpacing: "2px", fontWeight: "600" }}
          onClick= {()=>navigate('/login')}
        >
          Proceed
        </Button>
      </Container>
    </Fragment>
  );
};

export default ForRegister;
