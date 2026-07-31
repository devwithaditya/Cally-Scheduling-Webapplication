import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    async function handleGoogleLogin() {
      const token = params.get("token");

      if (!token) {
        navigate("/login");
        return;
      }

      await login(token);

      navigate("/dashboard");
    }

    handleGoogleLogin();
  }, []);

  return <h2>Signing you in...</h2>;
}