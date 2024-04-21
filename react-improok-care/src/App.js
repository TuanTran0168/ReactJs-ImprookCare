import { BrowserRouter, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import cookie from "react-cookies"
import { createContext, useReducer } from "react";
import UserReducer from "./reducers/UserReducer";
import PrescriptionReducer from "./reducers/PrescriptionReducer";
import Login from "./components/Login/Login"
import Register from "./components/Register/Register"
import Home from "./components/Home/Home";
import Header from "./layout/Header/Header";
import Footer from "./layout/Footer/Footer";
import ForgetPassword from "./components/ForgetPassword/ForgetPassword"
import Collaboration from "./components/Collaboration/Collaboration"
import Personal from "./components/Personal/Personal"
import Profile from "./components/Profile/Profile";
import { ToastContainer } from "react-toastify";
import Admin from "./components/Admin/Admin";
import ChangePassword from "./components/ChangePassword/ChangePassword"
import PhoneVerification from "./components/PhoneVerification/PhoneVerification";
import Appointment from "./components/Appointment/Appointment";
import History from "./components/History/History";
import Doctor from "./components/Doctor/Doctor";
import Booking from "./components/Booking/Booking";
import BookingDoctor from "./components/Booking/BookingDoctor";
import ProfileDoctor from "./components/Doctor/ProfileDoctor";
import BookingDetail from "./components/Booking/BookingDetail";
import DoctorMessage from "./components/Doctor/DoctorMessage";
import Message from "./components/Message/Message"
import PaymentResult from "./components/Payment/PaymentResult";
import BookingManagement from "./components/Doctor/BookingManagement";
import Prescription from "./components/Doctor/Prescription";
import Schedule from "./components/Doctor/Schedule";
import CustomSchedule from "./components/Doctor/CustomSchedule";
import VideoCall from "./components/VideoCall/VideoCall";
import NewBooking from "./components/Doctor/NewBooking";
import AcceptBooking from "./components/Doctor/AcceptBooking";
import DeclineBooking from "./components/Doctor/DeclineBooking";
import DoctorInformation from "./components/Doctor/DoctorInformation";
import ZegoVideo from "./components/ZegoVideo/ZegoVideo";
import User from "./components/User/User";
import Search from "./components/Search/Search";
import ScrollToTop from "./utils/ScrollToTop";
import Revenue from "./components/Admin/Revenue";
import Collab from "./components/Admin/Collab";
import AddMedicine from "./components/Admin/AddMedicine";
import MedicineCategory from "./components/Admin/MedicineCategory";
import AllMedicine from "./components/Admin/AllMedicine";
import Overview from "./components/Admin/Overview";
import AllUser from "./components/Admin/AllUser";
import AddUser from "./components/Admin/AddUser";
import UpdateUser from "./components/Admin/UpdateUser";
import UpdateMedicine from "./components/Admin/UpdateMedicine";
import WebSocketReducer from "./reducers/WebSocketReducer";
import BookingResultReducer from "./reducers/BookingResultReducer";
import BookingResult from "./components/BookingResult/BookingResult";

export const UserContext = createContext();
export const BookingManagementContext = createContext();
export const MyPrescriptionContext = createContext();
export const WebSocketContext = createContext();
export const BookingResultContext = createContext();

const App = () => {
  const [user, dispatch] = useReducer(UserReducer, cookie.load("user") || null)
  const [booking, dispatchBooking] = useReducer(PrescriptionReducer, cookie.load("bookingInfo") || null)
  const [webSocket, dispatchWebSocket] = useReducer(WebSocketReducer, cookie.load("socket") || null)
  const [bookingResult, dispatchBookingResult] = useReducer(BookingResultReducer, cookie.load("bookingresult") || null)
  console.log("App main", cookie.load("socket"));
  // const [prescriptionCounter, prescriptionDispatch] = useReducer(MyPrescriptionCounterReducer, 0)

  return (
    <UserContext.Provider value={[user, dispatch]}>
      <WebSocketContext.Provider value={[webSocket, dispatchWebSocket]}>
        <BookingResultContext.Provider value={[bookingResult, dispatchBookingResult]}>
          <BookingManagementContext.Provider value={[booking, dispatchBooking]}>
            <BrowserRouter>
              <Header />
              <Routes>
                <Route exact path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/forgetpassword' element={<ForgetPassword />} />
                <Route path='/collaboration' element={<Collaboration />} />
                <Route path='/bookingresult' element={<BookingResult />} />
                <Route path='/changepassword' element={<ChangePassword />} />
                <Route path='/phoneverification' element={<PhoneVerification />} />
                <Route path='/booking' element={<Booking />} />
                <Route path='/doctor/:profileDoctorId' element={<BookingDoctor />} />
                <Route path='/booking/doctor/:profileDoctorId' element={<BookingDetail />} />
                <Route path='/paymentresult' element={<PaymentResult />} />
                <Route path='/search' element={<Search />} />
                <Route path='/zego' element={<ZegoVideo />} />
                <Route path='/user' element={<User />}>
                  <Route path='personal' element={<Personal />} />
                  <Route path='appointment' element={<Appointment />} />
                  <Route path='history' element={<History />} />
                  <Route path='profile' element={<Profile />} />
                  <Route path='message' element={<Message />} />
                </Route>
                <Route path='/doctor' element={<Doctor />} >
                  <Route path='doctorinformation' element={<DoctorInformation />} />
                  <Route path='schedule' element={<Schedule />} />
                  <Route path='customschedule' element={<CustomSchedule />} />
                  <Route path='bookingmanagement' element={<BookingManagement />} />
                  <Route path='profiledoctor' element={<ProfileDoctor />} />
                  <Route path='doctormessage' element={<DoctorMessage />} />
                  <Route path='videocall' element={<VideoCall />} />
                  <Route path='prescription' element={<Prescription />} />
                  {/* <Route path='zego' element={<ZegoVideo />} /> */}
                </Route>
                <Route path='/admin' element={<Admin />} >
                  <Route path='overview' element={<Overview />} />
                  <Route path='alluser' element={<AllUser />} />
                  <Route path='adduser' element={<AddUser />} />
                  <Route path='updateuser/:userId' element={<UpdateUser />} />
                  <Route path='allmedicine' element={<AllMedicine />} />
                  <Route path='updatemedicine/:medicineId' element={<UpdateMedicine />} />
                  <Route path='medicinecategory' element={<MedicineCategory />} />
                  <Route path='addmedicine' element={<AddMedicine />} />
                  <Route path='collab' element={<Collab />} />
                  <Route path='revenue' element={<Revenue />} />
                </Route>
              </Routes>
              <ScrollToTop />
              <Footer />
              <ToastContainer />
            </BrowserRouter>
          </BookingManagementContext.Provider>
        </BookingResultContext.Provider >
      </WebSocketContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
