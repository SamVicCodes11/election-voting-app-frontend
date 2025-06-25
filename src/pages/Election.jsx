import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { UiActions } from "../components/store/ui-slice";
import { voteActions } from "../components/store/vote-slice";

const Election = ({ _id: id, title, thumbnail,  description }) => {

  const dispatch = useDispatch();

  const updateElectionModalShowing = () => {
    dispatch(UiActions.openUpdateElectionModal());
    dispatch(voteActions.changeIdOfElectionToUpdate(id));
  };

  const isAdmin = useSelector((state) => state.vote.currentVoter?.isAdmin);


  return (
    <article className="election fade-in">
      <div className="election_img">
        <img src={thumbnail} alt={title} />
      </div>

      <div className="election_info">
        <h4>{title}</h4>

        <p>
          {description}{" "}
          {description?.length > 255
            ? description.substring(0, 255) + "..."
            : description}
        </p>

        <div className="election_cta">
          <Link className="btn sm" to={`/elections/${id}`}>
            View
          </Link>

          {isAdmin && (
            <button
              onClick={updateElectionModalShowing}
              className="btn sm primary"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default Election;
