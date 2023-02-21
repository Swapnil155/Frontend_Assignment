import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Stack,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { AiOutlineMail, AiFillLock } from "react-icons/ai";
import "./login.css";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import UserServices from "../../services/user.services";
import { Fragment, useState } from "react";

const formSchema = Yup.object().shape({
  email: Yup.string().email().required("Mail address is required"),
  password: Yup.string()
    .required("Password is required")
    .min(4, "Password length should be at least 4 characters")
    .max(12, "Password cannot exceed more than 12 characters"),
  rememberMeCB: Yup.bool(),
});

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(formSchema),
  });

  const [show, setShow] = useState(false);
  const [toastBg, setTostBg] = useState("");
  const [serverError, setServerError] = useState("");
  const [loader, setLoader] = useState(false);
  // const onSubmit = (values) => alert(JSON.stringify(values, null, 2));

  const onSubmit = async (values) => {
    // alert(JSON.stringify(values, null, 2));
    setLoader(true)

    try {
      await UserServices.login(
        values.email,
        values.password,
        values.rememberMeCB
      ).then((res) => {
        if (res.status === 200) {
          setShow(true);
          setTostBg(`bg-success`);
          setServerError(res.data.message);
          setTimeout(() => {
            navigate("/otp");
          }, 1000);
          // navigate('/otp')
        }
        if (
          res.status === 400 ||
          res.status === 401 ||
          res.status === 503 ||
          res.status === 403
        ) {
          setShow(true);
          setTostBg(`bg-danger`);
          setServerError(res.data.Error[0].message);
        }
        console.log(res);
      });
    } catch (error) {
      console.log(error.message);
    }
    setLoader(false)
  };

  return (
    <Container>
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

      <Row className="py-6 vh-100">
        <Col lg={7}>
          <Card
            style={{ width: "34rem", borderRadius: "50px" }}
            className="shadow border-0  mx-auto"
          >
            <Card.Body className="px-5">
              <Card.Title
                className="pt-3 text-primary"
                style={{ fontWeight: "800", fontSize: "2rem" }}
              >
                Login
              </Card.Title>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={3} className="col-md-5 p-3 loging">
                  <div className={errors.email ? "inValid" : "inputBox"}>
                    <input
                      className="inputFiled"
                      type="text"
                      {...register("email", {
                        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      })}
                      required="required"
                    />
                    <span>
                      <AiOutlineMail className="mb-1 me-2" /> Email
                    </span>
                    <strong className="mx-1 text-danger">
                      {errors.email?.message}
                    </strong>
                  </div>

                  <div className={errors.password ? "inValid" : "inputBox"}>
                    <input
                      type="password"
                      {...register("password")}
                      required="required"
                    />
                    <span>
                      <AiFillLock className="mb-1 me-2" /> Password
                    </span>

                    <strong className="mx-1 text-danger">
                      {errors.password?.message}
                    </strong>
                  </div>

                  <Form.Group className="mx-2" controlId="formBasicCheckbox">
                    <Form.Check
                      type="checkbox"
                      {...register("rememberMeCB")}
                      label="Remember me"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn-primary"
                    style={{ letterSpacing: "2px", fontWeight: "600" }}
                    disabled={loader}
                  >
                    {!loader ? (
                      `Sign In`
                    ) : (
                      <Fragment>
                        <Spinner
                          size="sm"
                          className="me-3"
                          animation="border"
                          variant="light"
                        />
                        {`Sign In`}
                      </Fragment>
                    )}
                  </Button>
                </Stack>
              </Form>
            </Card.Body>
          </Card>
          <div
            className="mt-3 text-muted text-center"
            style={{ fontWeight: "500" }}
          >
            Don't have an account yet? <Link to={"/register"}>Sign Up</Link>
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
export default Login;
