import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { voteActions } from "../components/store/vote-slice";
import { toast } from "react-toastify";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Remove from Redux
    dispatch(voteActions.changeCurrentVoter(null));

    // Remove from localStorage
    localStorage.removeItem("currentVoter");

    // Show toast
    toast.success("You’ve been logged out successfully.");

    // Navigate after small delay
    const timeout = setTimeout(() => {
      navigate("/"); 
    }, 2500);

    return () => clearTimeout(timeout);
  }, [dispatch, navigate]);

  return <section className="logged-out">
    <h1>👋 You’ve been logged out</h1>
    <h4>Redirecting you to login page...</h4>
  </section>;
};

export default Logout;
