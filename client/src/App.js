import { UserAuthContextProvider } from "./components/context/UserAuthContext";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignIn from "./components/authentication/SignIn";
import SignUp from "./components/authentication/SignUp";
import ForgotPassword from "./components/authentication/ForgotPassword";
import AppointmentsPage from "./pages/AppointmentsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import TutorsPage from "./pages/TutorsPage";
import ProtectedAppointmentsRoute from "./components/utils/ProtectedAppointmentsRoute";

function App(){
    return (
        <UserAuthContextProvider>
            <div>
                <Header />

                {/* TODO: show a message in homepage saying user profile is not set and link to /profileSetup or appointment page for tutor
// which has availability picker */}

                <Routes>
                    <Route path="/" element={<HomePage />}></Route>
                    <Route path="/register" element={<SignUp />}></Route>
                    <Route path="/forgotPassword" element={<ForgotPassword />}></Route>
                    <Route path="/signin" element={<SignIn />}></Route>
                    <Route path="/appointments" element={
                        <ProtectedAppointmentsRoute>
                            <AppointmentsPage />
                        </ProtectedAppointmentsRoute>
                    }></Route>
                    <Route path="/profile" element = {
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }></Route>
                     <Route path="/tutors" element = {
                        <ProtectedRoute>
                            <TutorsPage />
                        </ProtectedRoute>
                    }></Route>
                </Routes>
            </div>
        </UserAuthContextProvider>
    )
}

export default App;