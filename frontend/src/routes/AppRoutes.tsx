import { BrowserRouter, Routes, Route } from "react-router-dom";
import GoogleSuccess from "../pages/GoogleSuccess";
import {Landing} from "../pages/Landing";
import {Login} from "../pages/Login";
import {Register} from "../pages/Register";
import {Dashboard} from "../pages/Dashboard";
import {BookingPage} from "../pages/BookingPage";
import GoogleCalendarSuccess from "../pages/GoogleCalendarSuccess";
import ProtectedRoute from "./ProtectedRoute";
import { About } from "../pages/About";
import { Contact } from "../pages/Contact";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings/:userSlug/:eventSlug"
          element={<BookingPage />}
        />

        <Route
          path="/google-success"
          element={<GoogleSuccess />}
        />

         <Route
          path="/google-calendar-success"
          element={<GoogleCalendarSuccess />}
        />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
    </BrowserRouter>
  );
}