import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, FormText, Row, Spinner, Stack, Toast, ToastContainer } from "react-bootstrap"
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Fragment, useEffect, useState } from "react"
import Cookies from "universal-cookie";
import UserServices from "../../services/user.services"
import { useNavigate } from "react-router-dom"

function isValidUrl(string) {
    console.log(string)
    try {
        new URL(string);
        return true;
    } catch (err) {
        return false;
    }
}

const formSchema = Yup.object().shape({
    Bio: Yup.string()
        .min(4, "Bio should be at least 4 characters")
        .max(2000, "Total charter less then 200"),
    linkedln: Yup.string()
        .min(4, "Linkedln url should be at least 4 characters")
        .max(200, "Linkedln url shouldn't more then 200 characters")
        .test("linkedln", "Should be Linkedln origin link", function (value) {
            console.log(isValidUrl(value))
            if (isValidUrl(value)) {
                // console.log(value)
                // return new URL(value).hostname === 'www.linkedin.com'
                return new URL(value)
            };
        }),
    facebook: Yup.string()
        .min(4, "facebook url should be at least 4 characters")
        .max(200, "facebook url shouldn't more then 200 characters")
        .test("facebook", "Should be Facebook origin link", function (value) {
            if (isValidUrl(value)) {
                // return new URL(value).hostname === 'www.facebook.com'
                return new URL(value)
            };
        }),
})

const makeLinkedlnURL = (value) => {
    const parts = value.split("/");
    var last_value = parts.filter(Boolean).slice(-2)
    // https://www.linkedin.com/in/swapnil-bendal/
    let Linkedln_url = `https://www.linkedin.com/${last_value[0]}/${last_value[1]}/`

    console.log(Linkedln_url);
    return Linkedln_url

}

const makeFacebookURL = (value) => {
    const parts = value.split("?");
    var last_value = parts.filter(Boolean).slice(-1)[0]
    // https://www.facebook.com/profile.php?id=100012556984462
    let Facebook_URL = `https://www.facebook.com/profile.php?${last_value}`

    console.log(Facebook_URL);
    return Facebook_URL
}

const ProfileStepTwo = () => {

    const { register, handleSubmit, formState: { errors }, } = useForm({
        mode: "onTouched",
        resolver: yupResolver(formSchema)
    })

    const cookies = new Cookies();
    const navigate = useNavigate()

    const user = cookies.get("user");
    // console.log(user)

    useEffect(() => {
        if (cookies.get("user") === undefined) navigate("/login");
    });

    const [show, setShow] = useState(false);
    const [toastBg, setTostBg] = useState("");
    const [serverError, setServerError] = useState("");
    const [loader, setLoader] = useState(false);

    // const userDetails_id = user.userDetails._id
    // console.log(`user Details Id: ${userDetails_id}`)


    const onSubmitHandler = async (values) => {
        console.log(JSON.stringify(values, null, 3))
        console.log(user)
        const linkedinURL = makeLinkedlnURL(values.linkedln)
        const facebookURL = makeFacebookURL(values.facebook)
        console.log(facebookURL, linkedinURL)


        if (user) {
            const userDetails_id = user.userDetails._id
            console.log(`user Details Id: ${userDetails_id}`)
            setLoader(true)

            try {
                await UserServices.userBioOrLinks(
                    userDetails_id,
                    values.Bio,
                    linkedinURL,
                    facebookURL
                ).then((res) => {
                    if (res.status === 200) {
                        setShow(true);
                        setTostBg(`bg-success`);
                        setServerError(res.data.message);
                        console.log(res)
                        setTimeout(() => {
                            navigate("/");
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
                })
            } catch (error) {
                console.log(error.message)
            }
            setLoader(false)
        }
    }


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
                        style={{ width: "40rem", borderRadius: "50px" }}
                        className="shadow border-0  mx-auto"
                    >
                        <Card.Body className="px-5">


                            <Card.Title className="pt-3 text-primary mb-3" style={{ fontWeight: "700", fontSize: "2rem" }}>
                                Complete profile step-2
                            </Card.Title>


                            <Form onSubmit={handleSubmit(onSubmitHandler)}>
                                <Stack gap={4}>
                                    <FormGroup controlId="formBasiProfile">
                                        <FormLabel><strong> Bio </strong></FormLabel>
                                        <Form.Control
                                            as={`textarea`}
                                            rows={3}
                                            name="bio"
                                            {...register("Bio")}
                                            required
                                        />

                                        <FormText className={"text-danger"}>
                                            {errors.Bio?.message}
                                        </FormText>
                                    </FormGroup>

                                    <FormGroup controlId="formBasiLinkedln">
                                        <FormLabel><strong> Linkedln url</strong></FormLabel>
                                        <FormControl
                                            type="text"
                                            placeholder="www.linkedln.com/"
                                            name="linkedln"
                                            {...register("linkedln", {
                                            })}
                                            required
                                        />

                                        <FormText className={"text-danger"}>
                                            {errors.linkedln?.message}
                                        </FormText>
                                    </FormGroup>

                                    <FormGroup className="mb-3" controlId="formBasiFacebook">
                                        <FormLabel><strong>Facebook url</strong></FormLabel>
                                        <FormControl
                                            placeholder="www.facebook.com/"
                                            type="text"
                                            name="facebook"
                                            {...register("facebook")}
                                            required
                                        />
                                        <FormText className={"text-danger"}>
                                            {errors.facebook?.message}
                                        </FormText>
                                    </FormGroup>

                                </Stack>
                                <FormGroup className="text-center">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        style={{ letterSpacing: "2px", fontWeight: "600" }}
                                        disabled={loader}
                                    >
                                        {!loader ? (
                                            `Submit`
                                        ) : (
                                            <Fragment>
                                                <Spinner
                                                    size="sm"
                                                    className="me-3"
                                                    animation="border"
                                                    variant="light"
                                                />
                                                {`Submit`}
                                            </Fragment>
                                        )}
                                    </Button>
                                </FormGroup>
                            </Form>
                        </Card.Body>
                    </Card>
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
    )
}

export default ProfileStepTwo