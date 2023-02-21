import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Row, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Payment from "./payment";

const MakePayment = () => {
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [plan, setPlan] = useState("");
  const [price, setPrice] = useState("");
  const [currentPlan, setCurrentPlan] = useState("");

  const cookies = new Cookies();

  const user = cookies.get("user");
  console.log(user);

  useEffect(() => {
    if (cookies.get("user") === undefined) {
      navigate("/login");
    }
    if (user.plan === undefined) {
      
      setCurrentPlan('hii')
    } else {
      setCurrentPlan(user.plan.name)
    }
    
  });

  console.log(currentPlan);

  return (
    <section className="mt-3 text-block">
      
      <Payment
        show={modalShow}
        onHide={() => setModalShow(false)}
        plan={plan}
        price={price}
      />

      <Row>
        <Col sm={3}>
          {" "}
          <span className="text-muted h4" style={{ fontWeight: `700` }}>
            Make Payment
          </span>
        </Col>
        <Col lg={9}>
          <hr style={{ borderTop: "0.2rem solid" }} />
        </Col>
      </Row>

      <Stack direction="horizontal" gap={3}>
        <Card
          style={{ width: "15rem" }}
          className="border-0 shadow mt-3 px-3 py-4 text-center"
        >
          <Stack gap={3}>
            <h2>Plan A</h2>
            <h4>$999</h4>
            {/* ser && user.plan !== null && user.plan.name === "Plan-A"  */}
            {user && currentPlan === "Plan-A" ? (

              <Badge className="p-2 mt-5" bg="success">
                Current Plan
              </Badge>
            ) : (
              <Button
                className="text-center mt-5"
                onClick={() =>
                  setModalShow(true) || setPlan("Plan-A") || setPrice("999")
                }
              >
                {" "}
                Select
              </Button>
            )}
          </Stack>
        </Card>

        <Card
          style={{ width: "15rem" }}
          className="border-0 shadow mt-3 px-3 py-4 text-center"
        >
          <Stack gap={3}>
            <h2>Plan B</h2>
            <h4>$1999</h4>
            {/* <Badge bg="success" className="mt-5">
              <h5>Current Plan</h5>
            </Badge> */}

            {user && currentPlan === "Plan-B" ? (
              <Badge className="p-2 mt-5" bg="success">
                Current Plan
              </Badge>
            ) : (
              <Button
                className="text-center mt-5"
                onClick={() =>
                  setModalShow(true) || setPlan("Plan-B") || setPrice("1999")
                }
              >
                {" "}
                Select
              </Button>
            )}
          </Stack>
        </Card>

        <Card
          style={{ width: "15rem" }}
          className="border-0 shadow mt-3 px-3 py-4 text-center"
        >
          <Stack gap={3}>
            <h2>Plan C</h2>
            <h4>$2999</h4>
            {user && currentPlan === "Plan-C" ? (
              <Badge className="p-2 mt-5" bg="success">
                Current Plan
              </Badge>
            ) : (
              <Button
                className="text-center mt-5"
                onClick={() =>
                  setModalShow(true) || setPlan("Plan-C") || setPrice("2999")
                }
              >
                {" "}
                Select
              </Button>
            )}
          </Stack>
        </Card>
      </Stack>
    </section>
  );
};

export default MakePayment;
