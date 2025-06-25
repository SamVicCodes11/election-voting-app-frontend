import { useEffect, useState } from "react";
import CandidatesRating from "./CandidatesRating";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";

const Result = ({ _id: id, title, thumbnail }) => {
  const [totalVotes, setTotalVotes] = useState(0);
  const [electionCandidates, setElectionCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const token = useSelector((state) => state.vote.currentVoter?.token);

  const getCandidate = async () => {
    setIsLoading(true);
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;

      const response = await axios.get(
        `${baseURL}/elections/${id}/candidates`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const candidates = response.data.data;
      setElectionCandidates(candidates);

      const total = candidates.reduce(
        (sum, candidate) => sum + candidate.voterCount,
        0
      );
      setTotalVotes(total);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error fetching election candidates";
      setError(errorMessage);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getCandidate();
  }, [id]);

  if (isLoading) return <Loader />;

  return (
    <article className="result fade-in">
      <header className="result_header">
        <h4>{title}</h4>

        <div className="result_header_image">
          <img src={thumbnail} alt={title} />
        </div>
      </header>

      {error && <p className="form_error_message">{error}</p>}

      <ul className="result_lists">
        {electionCandidates.map((candidate) => (
          <CandidatesRating
            key={candidate._id}
            {...candidate}
            totalVotes={totalVotes}
          />
        ))}
      </ul>

      {electionCandidates.length === 0 && !error && (
        <p className="no_result">
          No candidates available for this election yet.
        </p>
      )}

      <Link to={`/elections/${id}/candidates`} className="btn primary full">
        Enter Election
      </Link>
    </article>
  );
};

export default Result;
