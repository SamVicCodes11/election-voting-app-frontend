import { useEffect, useState } from "react";
import Result from "./Result";
import { FaTiktok, FaXTwitter } from "react-icons/fa6";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaLinkedinIn } from "react-icons/fa";

const Results = () => {
  const token = useSelector((state) => state.vote.currentVoter?.token);

  const navigate = useNavigate();
  // ACCESS CONTROL

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token]);

  const [elections, setElections] = useState([]);
  const [error, setError] = useState("");

  const getElections = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;

      const response = await axios.get(`${baseURL}/elections`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setElections(response.data.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error fetching elections";
      setError(errorMessage);
    }
  };

  useEffect(() => {
    getElections();
  }, []);

  return (
    <>
      <section className="results">
        <h1 className="welcome">Welcome to the SamVic Voting Platform</h1>

        <h5 className="welcome-h5">
          Take part in the ongoing elections by casting your vote today.
        </h5>

        {error && <p className="form_error_message">{error}</p>}

        <div className="container results_container">
          {elections.map((election) => (
            <Result key={election._id} {...election} />
          ))}
        </div>
      </section>

      <div className="footer">
        <div className="footer_container container">
          <h4>Love the experience? 🚀 Let’s connect and grow together!</h4>

          <div className="contact-socials">
            <a
              href="https://x.com/SamVicCodes"
              target="_blank"
              rel="noreferrer noopener"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://www.tiktok.com/@samviccodes"
              target="_blank"
              rel="noreferrer noopener"
            >
              <FaTiktok />
            </a>
            <a
              href="http://www.linkedin.com/in/samviccodes"
              target="_blank"
              rel="noreferrer noopener"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Results;
