import { useDispatch } from "react-redux";
import { UiActions } from "../components/store/ui-slice";
import { voteActions } from "../components/store/vote-slice";

const Candidate = ({ _id: id, fullName, image, motto }) => {
  const dispatch = useDispatch();

  // close confirm vote

  const openVoteCandidateModal = () => {
    dispatch(UiActions.openVoteCandidateModal());
    dispatch(voteActions.changeSelectedVoteCandidate(id));
  };


  return (
    <article className="candidate">
      <div className="candidate_image">
        <img src={image} alt={fullName} />
      </div>

      <h4>
        {fullName?.length > 20 ? fullName.substring(0, 20) + "..." : fullName}{" "}
      </h4>

      <small>
        {motto?.length > 25 ? motto.substring(0, 25) + "..." : motto}
      </small>

      <button
        onClick={openVoteCandidateModal}
        className="btn primary"
        aria-label={`Vote for ${fullName}`}
      >
        Vote
      </button>
    </article>
  );
};

export default Candidate;
