import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, FormText, Row, Spinner, Stack, Toast, ToastContainer } from "react-bootstrap"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Fragment, useEffect, useState } from "react";
import * as Yup from "yup";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import UserServices from "../../services/user.services";


async function getDuration(file) {
    const url = URL.createObjectURL(file);

    return new Promise((resolve) => {
        const audio = document.createElement("audio");
        audio.muted = true;
        const source = document.createElement("source");
        source.src = url; //--> blob URL
        audio.preload = "metadata";
        audio.appendChild(source);
        audio.onloadedmetadata = function () {
            resolve(audio.duration)
        };
    });
}
const duration_checking = async (values) => {
    try {
        let file = values;
        const duration = await getDuration(file);
        return duration
    } catch (error) {
        return false
    }
}

const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/tiff"];

const formSchema = Yup.object().shape({
    profileImage: Yup.mixed()
        .test("required", "You need to provide a file", (file) => {
            // return file && file.size <-- u can use this if you don't want to allow empty files to be uploaded;
            if (file) return true;
            return false;
        })
        .test("fileSize", "The file is too large", async (file) => {
            //if u want to allow only certain file sizes
            try {
                return file && await file[0].size <= 2000000;
            } catch (error) {
                return false
            }
        })
        .test("file_formate", 'Image file has unsupported format.', (file) => {
            try {
                return file && SUPPORTED_FORMATS.includes(file[0].type)
            } catch (error) {
                return false
            }

        })
    ,
    userVideo: Yup.mixed()
        .test("required", "You need to provide a file", (file) => {
            // return file && file.size <-- u can use this if you don't want to allow empty files to be uploaded;
            if (file) return true;
            return false;
        })
        .test("video-type", "file Must be MP4 only", async (file) => {
            try {
                if (file) return await file[0].type === 'video/mp4'
            } catch (error) {
                return false
            }
        })
        .test("duration-check", 'file duration 30 sec', async (file) => {
            if (file) return await duration_checking(file[0]) <= 30
            return false
            // return file && await duration_checking(file[0]) <= 30
        }),
    gender: Yup.string()
        .min(1, "Should be select")
        .required("User must select any one")
        .nullable(),

})
const ProfileStepOne = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onTouched",
        resolver: yupResolver(formSchema),
    });
    const cookies = new Cookies();
    const navigate = useNavigate()

    const user = cookies.get("user");


    useEffect(() => {
        if (cookies.get("user") === undefined) navigate("/login");
    });

    const [show, setShow] = useState(false);
    const [toastBg, setTostBg] = useState("");
    const [serverError, setServerError] = useState("");
    const [loader, setLoader] = useState(false);

    // console.log(videoDuration)

    const onSubmit = async (values) => {
        if (user) {

            setLoader(true)
            const userDetails_id = user.userDetails._id
            console.log(`user Details Id: ${userDetails_id}`)

            try {
                await UserServices.userMediaGenderUpload(
                    userDetails_id,
                    values.profileImage,
                    values.userVideo,
                    values.gender
                ).then((res) => {
                    if (res.status === 200) {
                        setShow(true);
                        setTostBg(`bg-success`);
                        setServerError(res.data.message);
                        console.log(res)
                        setTimeout(() => {
                            navigate("/profile-Step-Two");
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

                // console.log(userMedia)
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
                                Complete profile step-1
                            </Card.Title>


                            <Form
                                onSubmit={handleSubmit(onSubmit)}
                                encType="multipart/form-data"
                            >
                                <Stack gap={3}>
                                    <FormGroup className="mb-3" controlId="formBasiProfile">
                                        <FormLabel><strong> Profile Image </strong></FormLabel>
                                        <Form.Control
                                            type="file"
                                            name="profile"
                                            {...register('profileImage')}
                                            accept="image/*"
                                            required
                                        />

                                        <FormText className="text-danger">
                                            {errors.profileImage?.message}
                                        </FormText>
                                    </FormGroup>

                                    <FormGroup className="mb-3" controlId="formBasiVideo">
                                        <FormLabel><strong>Profile Video</strong> </FormLabel>
                                        <FormControl
                                            type="file"
                                            name="video"
                                            accept="video/*"
                                            {...register('userVideo')}
                                            required
                                        />

                                        <FormText className="text-danger">
                                            {errors.userVideo?.message}
                                        </FormText>
                                    </FormGroup>

                                    <FormGroup className="mb-3" controlId="formBasiVideo">
                                        <FormLabel className="me-3"><strong>Gender</strong> </FormLabel>
                                        <Form.Check
                                            inline
                                            type="radio"
                                            label="Male"
                                            name="group1"
                                            id="inline-radio-male"
                                            value={`male`}
                                            {...register('gender')}
                                            required
                                        />
                                        <Form.Check
                                            inline
                                            type="radio"
                                            label="Female"
                                            name="group1"
                                            value={`female`}
                                            id="inline-radio-female"
                                            {...register('gender')}
                                            required
                                        />

                                        <FormText className="text-danger">
                                            {errors.gender?.message}
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

export default ProfileStepOne