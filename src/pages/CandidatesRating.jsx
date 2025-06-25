const CandidatesRating = ({ fullName, image, voterCount, totalVotes }) => {
  return (
    <li className="result_candidate">
      <div className="result_candidate_image">
        <img src={image} alt={fullName} />
      </div>

      <div className="result_candidate_info">
        <div>
          <h5>{fullName}</h5>

          <small>{`${voterCount} ${voterCount == 1 ? "vote" : "votes"}`}</small>
        </div>

        <div className="result_candidate_rating">
          <div className="result_candidate_rating_loader">
            <span
              style={{
                width: `${voterCount > 0 ? (voterCount / totalVotes) * 100 : 0}%`,
              }}
            ></span>
          </div>

          <small>
            {voterCount > 0 ? ((voterCount / totalVotes) * 100).toFixed(2) : 0}%
          </small>
        </div>
      </div>
    </li>
  );
};

export default CandidatesRating;
