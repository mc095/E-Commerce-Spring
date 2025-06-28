import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useCheckoutGuard(requiredKey, fallback = "/cart") {
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem(requiredKey);
    if (!data) {
      alert("Invalid access — please follow the proper checkout flow.");
      navigate(fallback);
    }
  }, [navigate, requiredKey, fallback]);
}
