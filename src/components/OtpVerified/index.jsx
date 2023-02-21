import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import "./Otp.css";
import Cookies from "universal-cookie";
import { MdVerifiedUser } from "react-icons/md";
import OTPInput from "react-otp-input";
import React, { Fragment, useEffect, useState } from "react";
import UserServices from "../../services/user.services";
import { useNavigate } from "react-router-dom";
const OtpVerified = () => {
  const navigate = useNavigate();
  const [OTP, setOTP] = useState("");
  const [show, setShow] = useState(false);
  const [toastBg, setTostBg] = useState("");
  const [serverError, setServerError] = useState("");
  const [loader, setLoader] = useState(false);
  const cookies = new Cookies();

  const user = cookies.get("user");
  // console.log(user);

  useEffect(() => {
    if (cookies.get("user") === undefined) navigate("/login");
  });

  function handleChange(OTP) {
    setOTP(OTP);
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // alert(OTP.length === 4);
    // setShow(true);
    // setTostBg(`bg-success`);
    // console.log(OTP);
    const userEmail = user.email;

    if (OTP.length === 4) {
      setLoader(true)
      try {
        await UserServices.otpAuthentication(userEmail, OTP).then((res) => {
          if (res.status === 200) {
            setShow(true);
            setTostBg(`bg-success`);
            setServerError(res.data.message);
            setTimeout(() => {
              navigate("/profile-Step-one");
            }, 1000);
          }

          if (res.status === 400 || res.status === 401 || res.status === 503) {
            setShow(true);
            setTostBg(`bg-danger`);
            setServerError(res.data.Error[0].message);
          }
          console.log(res);
        });
      } catch (error) {}
      setLoader(false)
    }
  };

  const resendOnClicked = async (e) => {
    
    const userId = user._id;
    const userEmail = user.email;

    if (userId && userEmail) {
      console.log(userId, userEmail);

      try {
        await UserServices.resendOTP(userEmail, userId).then((res) => {
          if (res.status === 200) {
            setShow(true);
            setTostBg(`bg-info`);
            setServerError(res.data.message);
            setTimeout(() => {
              navigate("/otp");
            }, 1000);
            // navigate('/otp')
          }
          if (res.status === 503 || res.status === 403) {
            setShow(true);
            setTostBg(`bg-danger`);
            setServerError(res.data.Error[0].message);
          }
          console.log(res);
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  // console.log(OTP);
  return (
    <Container className="py-5 vh-100">
      {/* for current status messgae */}
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

      <span className="text-muted h2" style={{ fontWeight: `700` }}>
        Welcome {user ? user.userDetails.fullname : ""}
      </span>

      {/* For Server Error show */}
      {/* <div className="mt-2 mx-auto text-center" style={{width : "20rem"}}>
        <Alert variant="danger">This is a alert—check it out!</Alert>
      </div> */}

      <Row className="py-5 mt-5">
        <Col lg={7}>
          <Card
            style={{ width: "35rem", borderRadius: "50px" }}
            className="shadow border-0  mx-auto py-5"
          >
            <Card.Body className="px-5 mx-auto">
              <Card.Title
                className="pt-3 text-primary mx-auto"
                style={{ fontWeight: "800", fontSize: "2.5rem" }}
              >
                <MdVerifiedUser className="mb-2 me-3" /> Please enter OTP
              </Card.Title>
              <form onSubmit={onSubmitHandler}>
                <div>
                  <OTPInput
                    onChange={handleChange}
                    value={OTP}
                    inputStyle="inputStyle"
                    numInputs={4}
                    containerStyle="input-field mx-auto"
                    separator={<span></span>}
                  />
                </div>
                {OTP.length === 4 ? (
                  <Button
                    type="submit"
                    // disabled
                    style={{
                      width: "400px",
                      letterSpacing: "2px",
                      fontWeight: "600",
                      fontSize: "1.5rem",
                    }}
                    disabled={loader}
                  >
                    {!loader ? (
                      `Verifed`
                    ) : (
                      <Fragment>
                        <Spinner
                          size="sm"
                          className="me-3"
                          animation="border"
                          variant="light"
                        />
                        {`Verifed`}
                      </Fragment>
                    )}
                  </Button>
                ) : (
                  <Button
                    disabled
                    style={{
                      width: "400px",
                      letterSpacing: "2px",
                      fontWeight: "600",
                      fontSize: "1.5rem",
                    }}
                  >
                    Verifed
                  </Button>
                )}
              </form>
            </Card.Body>
          </Card>
          <div
            className="mt-3 text-muted text-center"
            style={{ fontWeight: "500" }}
          >
            Didn't receive OTP?{" "}
            <span
              type="button"
              onClick={resendOnClicked}
              className="text-primary"
            >
              Resend OTP
            </span>
          </div>
        </Col>
        <Col md={4}>
          <h2>Instruction for candidate</h2>
          <p>1. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          <p>2. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          <p>3. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          <p>4. Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default OtpVerified;
