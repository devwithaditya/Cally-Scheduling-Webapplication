import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function GoogleCalendarSuccess() {
  const { loadUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function finish() {
      await loadUser();
      navigate("/dashboard");
    }

    finish();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Connecting Google Calendar...</p>
    </div>
  );
}