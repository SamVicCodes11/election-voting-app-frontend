import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UiActions } from "../components/store/ui-slice";
import { voteActions } from "../components/store/vote-slice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

const ConfirmVote = ({ electionId }) => {
  const token = useSelector((state) => state.vote.currentVoter?.token);

  const navigate = useNavigate();

  // ACCESS CONTROL

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token]);

  const [modalCandidate, setModalCandidate] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const selectedVoteCandidate = useSelector(
    (state) => state?.vote?.selectedVoteCandidate
  );

  const currentVoter = useSelector((state) => state.vote.currentVoter);

  const closeVoteCandidateModal = () => {
    dispatch(UiActions.closeVoteCandidateModal());
  };

  const fetchCandidate = async () => {
    setIsLoading(true); // ✅ Start loader
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.get(
        `${baseURL}/candidates/${selectedVoteCandidate}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setModalCandidate(response.data);
    } catch (err) {
      const message =
        err.response?.data?.message || "Error fetching candidate info";
      setError(message);
    } finally {
      setIsLoading(false); //
    }
  };

  useEffect(() => {
    fetchCandidate();
  }, []);

  const confirmVote = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;

      const response = await axios.patch(
        `${baseURL}/candidates/${selectedVoteCandidate}`,
        { selectedElection: electionId }, // Make sure the key matches the backend
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const voteResult = response.data;

      // Optional: Check response structure
      if (voteResult?.success && voteResult.votedElections) {
        dispatch(
          voteActions.changeCurrentVoter({
            ...currentVoter,
            votedElections: voteResult.votedElections,
          })
        );
        navigate("/congrats");
      } else {
        console.error("Unexpected vote response format:", voteResult);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to confirm vote.";
      console.error("Error confirming vote:", message);
      alert(message); // Optional: Notify the user visually
    } finally {
      closeVoteCandidateModal(); // Always close modal
    }
  };

  // if (isLoading) return <Loader />;

  return (
    <section className="confirm_vote modal">
      {/* {isLoading ? (
        <Loader />
      ) : ( */}
      <div className="modal_content confirm_vote_content">
        <h5>PLEASE CONFIRM YOUR VOTE</h5>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="confirm_vote_img">
            <img src={modalCandidate.image} alt={modalCandidate.fullName} />
          </div>
        )}
        <h1>
          {modalCandidate.fullName?.length > 17
            ? modalCandidate.fullName.substring(0, 17) + "..."
            : modalCandidate.fullName}
        </h1>

        <p>
          {modalCandidate.motto?.length > 17
            ? modalCandidate.motto.substring(0, 17) + "..."
            : modalCandidate.motto}
        </p>

        <div className="confirm_vote_cta">
          <button onClick={closeVoteCandidateModal} className="btn btn_cancel">
            Cancel
          </button>
          <button className="btn primary" onClick={confirmVote}>
            Confirm
          </button>
        </div>
      </div>
      {/* // )} */}
    </section>
  );
};

export default ConfirmVote;
