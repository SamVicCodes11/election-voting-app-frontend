import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
    password2: "",
  });

  const changeInputHandler = (e) => {
    setUserData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const registerVoter = async (e) => {
    e.preventDefault();
    setError(""); // reset error
    setLoading(true); // start loading

    if (userData.password !== userData.password2) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (userData.password.length < 6) {
      setError("Password should be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      await axios.post(`${baseURL}/voters/register`, userData);
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.message;
      setError(errorMessage);
    } finally {
      setLoading(false); // stop loading whether success or error
    }
  };

  return (
    <section className="register">
      <div className="container register_container">
        <h2>Sign Up</h2>

        <form onSubmit={registerVoter}>
          {error && <p className="form_error_message">{error}</p>}

          <input
            onChange={changeInputHandler}
            type="text"
            name="fullName"
            autoComplete="true"
            placeholder="Full Name"
            autoFocus
            required
          />
          <input
            onChange={changeInputHandler}
            type="email"
            name="email"
            autoComplete="true"
            placeholder="Email Address"
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
          <input
            onChange={changeInputHandler}
            type="password"
            name="password2"
            autoComplete="true"
            placeholder="Confirm Password"
            required
          />

          <p>
            Already have an account? <Link to="/">Login</Link>
          </p>

          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
