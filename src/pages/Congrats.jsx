import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Congrats = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/results");
    }, 8000);
  });

  return (
    <section className="congrats">
      <div className="container congrats_container">
        <h2>Thank You for Voting!</h2>

        <p>
          Your vote has been successfully recorded and added to your candidate’s
          total. You’ll be redirected shortly to view the updated results.
        </p>

        <Link to="/results" className="btn primary">
          See Results
        </Link>
      </div>
    </section>
  );
};

export default Congrats;
