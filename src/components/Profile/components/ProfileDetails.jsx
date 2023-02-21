import { Fragment, useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { differenceInYears } from "date-fns";
import UserServices from "../../../services/user.services";
import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const formSchema = Yup.object().shape({
  fullname: Yup.string()
    .required("Full name is requird")
    .min(4, "Full name lenght should be at least 4 characters"),
  email: Yup.string().email().required("Mail address is required"),
  dob: Yup.string()
    .required("Date of birth")
    .nullable()
    .test("dob", "Should be greater then 18", function (value) {
      return differenceInYears(new Date(), new Date(value)) >= 18;
    }),
  location: Yup.string()
    .required("Location Must be required")
    .min(2, "Location lenght should be at least 2 characters"),
});

const ProfileDetails = () => {
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
  const [toastBg, setToastBg] = useState("");
  const [serverError, setServerError] = useState("");
  const [loader, setLoader] = useState(false);

  const cookies = new Cookies();

  const user = cookies.get("user");
  // console.log(user);

  useEffect(() => {
    if (cookies.get("user") === undefined) navigate("/login");
  });

  const onSubmit = async (values) => {
    console.log(JSON.stringify(values));
    setShow(true);
    setToastBg("bg-success");
    setServerError(`Profile Updated Successfully`);

    console.log(user);
    if (user) {
      const user_id = user._id;
      console.log(`user Details Id: ${user_id}`);
      setLoader(true);

      try {
        await UserServices.userUpdateProfileDetails(
          user_id,
          values.email,
          values.fullname,
          values.dob,
          values.location
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
      setLoader(false);
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
          <span className="h4" style={{ fontWeight: `700` }}>
            Personal Details
          </span>
        </Col>
        <Col lg={9}>
          <hr style={{ borderTop: "0.2rem solid" }} />
        </Col>
      </Row>
      <Card className="border-0 shadow mt-3 px-3 py-4">
        <Form className="p-3" onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col sm={6}>
              <FormGroup className="mb-3" controlId="formBasiProfile">
                <FormLabel>
                  <strong> Full Name</strong>
                </FormLabel>
                <Form.Control
                  type="text"
                  name="fullname"
                  {...register("fullname")}
                  defaultValue={user ? user.userDetails.fullname : ""}
                  required
                />
                <FormText className={"text-danger"}>
                  {errors.fullname?.message}
                </FormText>
              </FormGroup>
            </Col>

            <Col sm={6}>
              <FormGroup className="mb-3" controlId="formBasiProfile">
                <FormLabel>
                  <strong> Mail Address</strong>
                </FormLabel>
                <Form.Control
                  type="email"
                  name="email"
                  {...register("email")}
                  defaultValue={user ? user.email : ""}
                  required
                />
                <FormText className={"text-danger"}>
                  {errors.email?.message}
                </FormText>
              </FormGroup>
            </Col>
            <Col sm={6}>
              <FormGroup className="mb-3" controlId="formBasiProfile">
                <FormLabel>
                  <strong> Date of Birth</strong>
                </FormLabel>
                <Form.Control
                  type="date"
                  name="dob"
                  {...register("dob")}
                  defaultValue={user ? user.userDetails.DOB : ""}
                  required
                />
                <FormText className={"text-danger"}>
                  {errors.dob?.message}
                </FormText>
              </FormGroup>
            </Col>

            <Col sm={6}>
              <FormGroup className="mb-3" controlId="formBasiProfile">
                <FormLabel>
                  <strong> Location</strong>
                </FormLabel>
                <Form.Control
                  type="text"
                  name="email"
                  {...register("location")}
                  defaultValue={user ? user.userDetails.location : ""}
                  required
                />
                {/* <Select options={options} /> */}
                <FormText className={"text-danger"}>
                  {errors.location?.message}
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
                `Upadate`
              ) : (
                <Fragment>
                  <Spinner
                    size="sm"
                    className="me-3"
                    animation="border"
                    variant="light"
                  />
                  {`Update`}
                </Fragment>
              )}
            </Button>
          </FormGroup>
        </Form>
      </Card>
    </section>
  );
};
export default ProfileDetails;
