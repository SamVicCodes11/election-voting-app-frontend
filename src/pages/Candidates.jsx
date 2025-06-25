import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import Candidate from "./Candidate";
import ConfirmVote from "./ConfirmVote";
import Loader from "../components/Loader";

const Candidates = () => {
  const token = useSelector((state) => state.vote.currentVoter?.token);

  const navigate = useNavigate();

  // ACCESS CONTROL

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token]);

  const { id: electionId } = useParams();
  const [electionCandidates, setElectionCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [canVote, setCanVote] = useState(true);
  const [error, setError] = useState("");

  const voterId = useSelector((state) => state.vote.currentVoter?.id);

  const voteCandidateModalShowing = useSelector(
    (state) => state.ui.voteCandidateModalShowing
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    getCandidates();
    checkVoterStatus();
  }, [electionId]);

  const getCandidates = async () => {
    setIsLoading(true);
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;

      const response = await axios.get(
        `${baseURL}/elections/${electionId}/candidates`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setElectionCandidates(response.data.data);
    } catch (err) {
      const message =
        err.response?.data?.message || "Error fetching election candidates";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const checkVoterStatus = async () => {
    // Prevent call if required data is missing
    if (!voterId || !electionId || !token) {
      setError("Missing voter or election information.");
      setCanVote(false);
      return;
    }

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;

      const { data } = await axios.get(`${baseURL}/voters/${voterId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const votedElections = data?.votedElections ?? [];

      // Check if voter already voted in this election
      if (
        Array.isArray(votedElections) &&
        votedElections.includes(electionId)
      ) {
        setCanVote(false);
      } else {
        setCanVote(true);
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Error checking voter status";
      console.error("❌ Voter Status Error:", message);
      setError(message);
      setCanVote(false);
    }
  };

  return (
    <>
      <section className="candidates">
        {isLoading ? (
          <div className="loader-container">
            <Loader />
          </div>
        ) : !canVote ? (
          <div className="candidates_header">
            <h1>You've Already Voted</h1>
            <p>
              Thanks for participating! You’ve already voted in this election.
              Feel free to check out other elections or sign out.
            </p>
          </div>
        ) : (
          <>
            <div className="candidates_header">
              <h1>
                {electionCandidates.length > 0
                  ? "Ready to Vote? Choose Your Candidate!"
                  : "Oops! This Election Has No Candidates Yet"}
              </h1>
              <p>
                {electionCandidates.length > 0
                  ? "Make your vote count! You can only vote once in this election."
                  : "No candidates are available for this election at the moment. Please check again later."}
              </p>
            </div>

            {error && <p className="form_error_message">{error}</p>}

            <div className="container candidates_container">
              {electionCandidates.map((candidate) => (
                <Candidate key={candidate._id} {...candidate} />
              ))}
            </div>
          </>
        )}
      </section>

      {voteCandidateModalShowing && <ConfirmVote electionId={electionId} />}
    </>
  );
};

export default Candidates;
