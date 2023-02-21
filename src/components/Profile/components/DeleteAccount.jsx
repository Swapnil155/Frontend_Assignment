import {
  Button,
  Card,
  Col,
  Form,
  FormGroup,
  FormText,
  Row,
  Spinner,
  Stack,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import Cookies from "universal-cookie";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import UserServices from "../../../services/user.services";

const formSchema = Yup.object().shape({
  reason: Yup.string()
    .min(1, "Reason should be select")
    .required("User must select any one reason")
    .nullable(),
});

const DeleteAccount = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(formSchema),
  });

  const user = cookies.get("user");
  // console.log(user)

  useEffect(() => {
    if (cookies.get("user") === undefined) navigate("/login");
  });

  const [show, setShow] = useState(false);
  const [toastBg, setToastBg] = useState("");
  const [serverError, setServerError] = useState("");
  const [loader, setLoader] = useState(false);

  const onSubmit = async (values) => {
    // alert(JSON.stringify(values));
    console.log(JSON.stringify(values));
    setShow(true);
    setToastBg(`bg-success`);
    setServerError(`Delete Account`);

    console.log(user);
    if (user) {
      const user_id = user._id;
      console.log(`user Details Id: ${user_id}`);
      setLoader(true);

      try {
        await UserServices.userDeleteAccount(user_id, values.reason).then(
          (res) => {
            if (res.status === 200) {
              setShow(true);
              setToastBg(`bg-success`);
              setServerError(res.data.message);
              console.log(res);
              // setTimeout(() => {
              //     navigate("/profile-Step-Two");
              // }, 1000);
              navigate("/otp");
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
          }
        );
      } catch (error) {
        console.log(error.message);
      }
      setLoader(false);
    }
  };
  return (
    <>
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

      <section className="mt-3 text-block">
        <Row>
          <Col sm={3}>
            {" "}
            <span className="text-muted h4" style={{ fontWeight: `700` }}>
              Delete Account
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
            <Stack gap={4}>
              <Form.Check
                type={"radio"}
                {...register("reason")}
                value={`Reason-1`}
                id={`Reason-1`}
                label={`Reason-1`}
              />

              <Form.Check
                // disabled
                type={"radio"}
                label={`Reason-2 `}
                value={`Reason-2`}
                {...register("reason")}
                id={`Reason-2`}
              />
              <Form.Check
                type={"radio"}
                id={`Reason-3`}
                value={`Reason-3`}
                {...register("reason")}
                label={`Reason-3`}
              />

              <Form.Check
                // disabled
                type={"radio"}
                label={`Reason-4 `}
                value={`Reason-4`}
                {...register("reason")}
                id={`Reason-4`}
              />

              <FormText className="text-danger">
                {errors.reason?.message}
              </FormText>

              <FormGroup className="text-center">
                <Button
                  type="submit"
                  variant="danger"
                  style={{ letterSpacing: "2px", fontWeight: "600" }}
                  disabled={loader}
                >
                  {!loader ? (
                    `Delete Account`
                  ) : (
                    <Fragment>
                      <Spinner
                        size="sm"
                        className="me-3"
                        animation="border"
                        variant="light"
                      />
                      {`Delete Account`}
                    </Fragment>
                  )}
                </Button>
              </FormGroup>
            </Stack>
          </Form>
        </Card>
      </section>
    </>
  );
};
export default DeleteAccount;
