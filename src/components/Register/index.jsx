import {
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
  Spinner,
  Stack,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { differenceInYears } from "date-fns";
import {
  AiOutlineUserAdd,
  AiOutlineMail,
  AiOutlineCalendar,
  AiFillLock,
} from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import * as Yup from "yup";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { Fragment, useState } from "react";
import UserServices from "../../services/user.services";

const formSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(4, "Password length should be at least 4 characters")
    .max(12, "Password cannot exceed more than 12 characters"),
  cpassword: Yup.string()
    .required("Confirm Password is required")
    .min(4, "Password length should be at least 4 characters")
    .max(12, "Password cannot exceed more than 12 characters")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
  dob: Yup.string()
    .required("Date of birth")
    .test("dob", "Should be greater than 18", function (value) {
      return differenceInYears(new Date(), new Date(value)) >= 18;
    }),
  location: Yup.string().required("Location is required"),
  fullname: Yup.string()
    .required("Full name is requird")
    .min(4, "Full name lenght should be at least 4 characters"),
  email: Yup.string().email().required("Mail address is required"),
});
const data = [
  "India",
  "Iran",
  "UAE",
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
];

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(formSchema),
  });

  const [inputLocation, setInputLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(false);
  const [toastBg, setToastBg] = useState("");
  const [serverError, setServerError] = useState("");
  const [loader, setLoader] = useState(false);

  function handleInput(event) {
    setInputLocation(event.target.value);

    if(event.target.value.length === 0){
      setSuggestions([]);
    }

    setSuggestions(
      data.filter((city) =>
        city.toLowerCase().startsWith(event.target.value.toLowerCase())
      )
    );
  }
  

  function handleSelection(event) {
    setInputLocation(event.target.innerText);
    setSuggestions([]);
  }

  const onSubmit = async (values) => {
    setLoader(true);
    console.log(JSON.stringify(values, null, 2));
    console.log(inputLocation);

    try {
      await UserServices.regiterUser(
        values.fullname,
        values.email,
        values.dob,
        inputLocation,
        values.password
      ).then((res) => {
        if (res.status === 200) {
          setShow(true);
          setToastBg(`bg-success`);
          setServerError(res.data.message);
          setTimeout(() => {
            navigate("/ThankYou-For-Register");
          }, 1000);
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
        console.log(res);
      });
    } catch (error) {
      console.log(error.message);
    }
    setLoader(false);
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
                Register
              </Card.Title>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={7} className="col-md-5 p-3 regi">
                  <div className={errors.fullname ? "inValid" : "inputBox"}>
                    <input
                      type="text"
                      placeholder="Enter fullname"
                      {...register("fullname")}
                      required="required"
                    />
                    <span>
                      <AiOutlineUserAdd className="mb-1 me-2" /> Full name
                    </span>

                    <strong className="mx-1 text-danger">
                      {errors.fullname?.message}
                    </strong>
                  </div>

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

                  {/* <!-- onfocus="(this.type='date')" onfocusout="(this.type='text')" -->  */}
                  <div className={errors.dob ? "inValid" : "inputBox"}>
                    <input
                      type="text"
                      {...register("dob")}
                      onFocus={(e) => (e.currentTarget.type = "date")}
                      onBlur={(e) => (e.currentTarget.type = "text")}
                      required="required"
                    />
                    <span>
                      <AiOutlineCalendar className="mb-1 me-2" /> Date of Birth
                    </span>
                    <strong className="mx-1 text-danger">
                      {errors.dob?.message}
                    </strong>
                  </div>

                  <div
                    className={errors.location ? "inValid" : "inputBox open"}
                  >
                    <input
                      type="text"
                      value={inputLocation}
                      onInput={handleInput}
                      
                      {...register("location")}
                      required="required"
                    />
                    <span>
                      <CiLocationOn className="mb-1 me-2" /> Location
                    </span>
                    <ListGroup className="shadow border-0">
                      {suggestions.map((suggestion) => (
                        <ListGroup.Item
                          key={suggestion}
                          onClick={handleSelection}
                        >
                          {suggestion}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                    <strong className="mx-1 text-danger">
                      {errors.location?.message}
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

                  <div className={errors.cpassword ? "inValid" : "inputBox"}>
                    <input
                      type="password"
                      {...register("cpassword")}
                      required="required"
                    />
                    <span>
                      <AiFillLock className="mb-1 me-2" /> Confirm Password
                    </span>
                    <strong className="mx-1 text-danger">
                      {errors.cpassword?.message}
                    </strong>
                  </div>

                  <Button
                    type="submit"
                    className="btn-primary"
                    style={{ letterSpacing: "2px", fontWeight: "600" }}
                    disabled={loader}
                  >
                    {!loader ? (
                      `Register`
                    ) : (
                      <Fragment>
                        <Spinner
                          size="sm"
                          className="me-3"
                          animation="border"
                          variant="light"
                        />
                        {`Register`}
                      </Fragment>
                    )}
                  </Button>
                </Stack>
              </form>
            </Card.Body>
          </Card>
          <div
            className="mt-3 text-muted text-center"
            style={{ fontWeight: "500" }}
          >
            Do you already have an account? <Link to={"/login"}>Sign In</Link>
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

export default Register;
