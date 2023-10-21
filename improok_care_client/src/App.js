import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Home from "./components/Home";
import Login from "./components/Login"
import Register from "./components/Register";
import { createContext } from "react";
import { useReducer } from "react";
import MyUserReducer from "./reducers/MyUserReducer";
import cookie from "react-cookies"
import Admin from "./components/Admin/Admin";
import Doctor from "./components/Doctor/Doctor";
import Profile from "./components/Profile"
import Booking from "./components/Booking"
import PhoneVerification from "./components/PhoneVerification"
import PersonalPage from "./components/PersonalPage"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import CollabDoctor from "./components/CollabDoctor";
import MedicalRecord from "./components/MedicalRecord";
import ProfileDoctor from "./components/Doctor/ProfileDoctor";
import Schedule from "./components/Doctor/Schedule";
import ProfileDoctorDetail from "./components/ProfileDoctorDetail";
import BookingDetail from "./components/BookingDetail";
import ChangePassword from "./components/ChangePassword"
import ForgetPassword from "./components/ForgetPassword"
import BookingManagement from "./components/Doctor/BookingManagement";
import Appointment from "./components/Appointment";
import Prescription from "./components/Doctor/Prescription";
import MyPrescriptionReducer from "./reducers/MyPrescriptionReducer";
import MyPrescriptionCounterReducer from "./reducers/MyPrescriptionCounterReducer";
import GoogleMapAPI from "./utils/GoogleMapAPI";
import PaymentResult from "./components/PaymentResult";
import ChatRoom from "./utils/ChatRoom";
import Message from "./components/Message";
import DoctorMessage from "./components/Doctor/DoctorMessage";
// import { BookingManagementContext } from "./components/Doctor/BookingManagement";

export const MyUserContext = createContext();
export const BookingManagementContext = createContext();

export const MyPrescriptionContext = createContext();

const App = () => {

  const [user, dispatch] = useReducer(MyUserReducer, cookie.load("user") || null)
  const [booking, dispatchBooking] = useReducer(MyPrescriptionReducer, cookie.load("bookingInfo") || null)
  const [prescriptionCounter, prescriptionDispatch] = useReducer(MyPrescriptionCounterReducer, 0)

  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <BookingManagementContext.Provider value={[booking, dispatchBooking]}>
        <MyPrescriptionContext.Provider value={[prescriptionCounter, prescriptionDispatch]}>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/admin' element={<Admin />} />
              <Route path='/doctor' element={<Doctor />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/phoneverification' element={<PhoneVerification />} />
              <Route path='/personalpage' element={<PersonalPage />} />
              <Route path='/collabdoctor' element={<CollabDoctor />} />
              <Route path='/medicalrecord' element={<MedicalRecord />} />
              <Route path='/booking' element={<Booking />} />
              <Route path='/profiledoctor' element={<ProfileDoctor />} />
              <Route path='/schedule' element={<Schedule />} />
              <Route path='/doctor/:profileDoctorId' element={<ProfileDoctorDetail />} />
              <Route path='/booking/doctor/:profileDoctorId' element={<BookingDetail />} />
              <Route path='/changepassword' element={<ChangePassword />} />
              <Route path='/forgetpassword' element={<ForgetPassword />} />
              <Route path='/bookingmanagement' element={<BookingManagement />} />
              <Route path='/appointment' element={<Appointment />} />
              <Route path='/prescription' element={<Prescription />} />
              <Route path='/GoogleMapAPI' element={<GoogleMapAPI />} />
              <Route path='/paymentResult' element={<PaymentResult />} />
              <Route path='/chatroomDemo' element={<ChatRoom />} />
              <Route path='/message' element={<Message />} />
              <Route path='/doctormessage' element={<DoctorMessage />} />
            </Routes>
            <Footer />
            <ToastContainer />
          </BrowserRouter>
        </MyPrescriptionContext.Provider>
      </BookingManagementContext.Provider>
    </MyUserContext.Provider>
  );
}

export default App;

