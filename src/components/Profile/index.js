import { useEffect, useState } from "react"
import { Button, Card, Col, Container, Row } from "react-bootstrap"
import ChangePassword from "./components/ChangePassword"
import DeleteAccount from "./components/DeleteAccount"
import MakePayment from "./components/MakePayment"
import ProfileDetails from "./components/ProfileDetails"
import './Profie.css'
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const Profile = () => {
    const [tab, setTab] = useState('tab-1')
    const navigate = useNavigate();

    const cookies = new Cookies();

    const user = cookies.get("user");
    // console.log(user);

    useEffect(() => {
        if (cookies.get("user") === undefined) navigate("/login");
    });

    const onClickHandler = (e) =>{
        cookies.remove('user')
        navigate('/login')
    }
    return (
        <Container className="py-5">

            <div className="d-flex justify-content-between">
                <span className="text-muted h2" style={{ fontWeight: `700` }}>
                    Welcome Swapnil Bendal
                </span>
                <Button onClick={onClickHandler} variant="dark"
                    style={{ letterSpacing: "2px", fontWeight: "600" }}
                >
                    Logout
                </Button>
            </div>


            <Row className="my-5">
                <Col md={9}>
                    <Card style={{ width: 'auto' }} className=" border-0 shadow">
                        <div className="tab-container text-muted">
                            <div onClick={() => setTab('tab-1')} className={tab === 'tab-1' ? "tab-title active" : "tab-title"}>Profile Details</div>
                            <div onClick={() => setTab('tab-2')} className={tab === 'tab-2' ? "tab-title active" : "tab-title"}>Change Password</div>
                            <div onClick={() => setTab('tab-3')} className={tab === 'tab-3' ? "tab-title active" : "tab-title"}>Delete Account</div>
                            <div onClick={() => setTab('tab-4')} className={tab === 'tab-4' ? "tab-title active" : "tab-title"}>Make Payment</div>
                        </div>
                    </Card>

                    {tab === 'tab-1' ? <ProfileDetails /> : ''}
                    {tab === 'tab-2' ? <ChangePassword /> : ''}
                    {tab === 'tab-3' ? <DeleteAccount /> : ''}
                    {/* {tab === 'tab-4' ? <Elements stripe={loadStripe('pk_test_51MZrheSDSUOhX3MpsPyM1G4z4IJq5LIjpL8SYBg2FpEB9nXoQLzJh7fELcaQffdZqlbdUqMK56nnmKWen9mfhiWM00Gt1RnFeu')}><MakePayment /></Elements> : ''} */}
                    {tab === 'tab-4' ? <MakePayment /> : ''}
                </Col>
                <Col md={3}>
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

export default Profile