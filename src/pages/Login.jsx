import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { voteActions } from "../components/store/vote-slice";
import { toast } from "react-toastify";

const Login = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const changeInputHandler = (e) => {
    setUserData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const loginVoter = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Start loading

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;

      const response = await axios.post(`${baseURL}/voters/login`, userData);

      const newVoter = response.data.voter;

      localStorage.setItem("currentVoter", JSON.stringify(newVoter));
      dispatch(voteActions.changeCurrentVoter(newVoter));

      toast.success("Login successful!");

      setTimeout(() => {
        navigate("/results", { replace: true });
      }, 100);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Login failed. Please try again.";
      console.error("Login error:", message);
      setError(message);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <section className="register">
      <div className="container register_container">
        <h2>LOG IN</h2>

        <form onSubmit={loginVoter}>
          {error && <p className="form_error_message">{error}</p>}

          <input
            onChange={changeInputHandler}
            type="email"
            name="email"
            autoComplete="true"
            placeholder="Email Address"
            autoFocus
            required
          />

          <input
            onChange={changeInputHandler}
            type="password"
            name="password"
            autoComplete="true"
            placeholder="Password"
            required
          />

          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>

          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner_one"></span> Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
