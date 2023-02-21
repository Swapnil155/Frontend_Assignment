import { Elements, useElements, useStripe } from '@stripe/react-stripe-js/dist/react-stripe';
import { loadStripe } from '@stripe/stripe-js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ForPayment from './components/GreetingPages/ForPayment';
import ForRegister from './components/GreetingPages/ForRegister';
import Login from './components/Login';
import OtpVerified from './components/OtpVerified';
import Payment from './components/Payment';
import CheckoutForm from './components/Payment/CheckoutForm';
import Demo from './components/Payment/Demo';
import Profile from './components/Profile';
import ProfileStepOne from './components/ProfileStepOne';
import ProfileStepTwo from './components/ProfileStepTwo';
import Register from './components/Register';
function App() {
  return (
    <Router>

      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/otp' element={<OtpVerified />} />
        <Route path='/profile-Step-one' element={<ProfileStepOne />} />
        <Route path='/profile-Step-Two' element={<ProfileStepTwo />} />
        <Route path='/' element={<Profile />} />
        <Route path='/ThankYou-For-Register' element={<ForRegister />} />
        <Route path='/ThankYou-For-Payment' element={<ForPayment />} />

        {/* <Route path='/payment' element={<Payment />} /> */}
        {/* <Route path='/payment/chatGPT' element={<CheckoutForm />} /> */}
        {/* <Route path='/payment/demo' element={<Demo />} /> */}

      </Routes>

    </Router>

  );
}

export default App;
