import {
  Button,
  Card,
  Col,
  Form,
  FormGroup,
  FormLabel,
  FormText,
  Row,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import Cookies from "universal-cookie";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import UserServices from "../../../services/user.services";

const formSchema = Yup.object().shape({
  currentPWD: Yup.string()
    .required("this field must be requird")
    .min(4, "Password length should be at least 4 characters")
    .max(12, "Password cannot exceed more than 12 characters"),
  newPWD: Yup.string()
    .required("this field must be required")
    .min(4, "Password length should be at least 4 characters")
    .max(12, "Password cannot exceed more than 12 characters"),
  confirmNewPWD: Yup.string()
    .required("this field must required")
    .min(4, "Password length should be at least 4 characters")
    .max(12, "Password cannot exceed more than 12 characters")
    .oneOf([Yup.ref("newPWD")], "Password do not match"),
});

const ChangePassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched", resolver: yupResolver(formSchema) });

  const cookies = new Cookies();

  const user = cookies.get("user");
  // console.log(user);

  useEffect(() => {
    if (cookies.get("user") === undefined) navigate("/login");
  });

  const [show, setShow] = useState(false);
  const [toastBg, setToastBg] = useState("");
  const [serverError, setServerError] = useState("");
  const [loader, setLoader] = useState(false);

  const onSubmit = async (values) => {
    setShow(true);
    setToastBg(`bg-success`);
    setServerError(`Password updated successfully`);
    setLoader(false);

    if (user) {
      const user_id = user._id;
      console.log(`user Details Id: ${user_id}`);

      try {
        await UserServices.userUpdatePassword(
          user_id,
          values.currentPWD,
          values.newPWD
        ).then((res) => {
          if (res.status === 200) {
            setShow(true);
            setToastBg(`bg-success`);
            setServerError(res.data.message);
            console.log(res);
            // setTimeout(() => {
            //     navigate("/profile-Step-Two");
            // }, 1000);
            // navigate('/otp')
          }
          if (
            res.status === 400 ||
            res.status === 401 ||
            res.status === 503 ||
            res.status === 403
          ) {
            setShow(true);
            setToastBg(`bg-danger`);
            setServerError(res.data.Error[0].message);
          }
        });
      } catch (error) {
        console.log(error.message);
      }
      setLoader(true);
    }
  };
  return (
    <section className="mt-3 text-block">
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
      <Row>
        <Col sm={3}>
          {" "}
          <span className="text-muted h4" style={{ fontWeight: `700` }}>
            Change Password
          </span>
        </Col>
        <Col lg={9}>
          <hr style={{ borderTop: "0.2rem solid" }} />
        </Col>
      </Row>
      <Card
        style={{ width: "30rem" }}
        className="border-0 shadow mt-3 px-3 py-4"
      >
        <Form className="p-3" onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col sm={12}>
              <FormGroup className="mb-3" controlId="formBasiCurrentPassword">
                <FormLabel>
                  <strong> Current Password </strong>
                </FormLabel>
                <Form.Control
                  type="password"
                  name="currentPWD"
                  {...register("currentPWD")}
                  required
                />
                <FormText className="text-danger">
                  {errors.currentPWD?.message}
                </FormText>
              </FormGroup>
            </Col>

            <Col sm={12}>
              <FormGroup className="mb-3" controlId="formBasiNewPassowrd">
                <FormLabel>
                  <strong> New Password </strong>
                </FormLabel>
                <Form.Control
                  type="password"
                  name="newPWD"
                  {...register("newPWD")}
                  required
                />
                <FormText className="text-danger">
                  {errors.newPWD?.message}
                </FormText>
              </FormGroup>
            </Col>
            <Col sm={12}>
              <FormGroup className="mb-3" controlId="formBasiCNewPassword">
                <FormLabel>
                  <strong>Confirm New Password</strong>{" "}
                </FormLabel>
                <Form.Control
                  type="password"
                  name="confirmNewPWD"
                  {...register("confirmNewPWD")}
                  required
                />
                <FormText className="text-danger">
                  {errors.confirmNewPWD?.message}
                </FormText>
              </FormGroup>
            </Col>
          </Row>
          <FormGroup className="text-center mt-3">
            <Button
              type="submit"
              variant="primary"
              style={{ letterSpacing: "2px", fontWeight: "600" }}
              disabled={loader}
            >
              {!loader ? (
                `Proceed`
              ) : (
                <Fragment>
                  <Spinner
                    size="sm"
                    className="me-3"
                    animation="border"
                    variant="light"
                  />
                  {`Proceed`}
                </Fragment>
              )}
            </Button>
          </FormGroup>
        </Form>
      </Card>
    </section>
  );
};
export default ChangePassword;
