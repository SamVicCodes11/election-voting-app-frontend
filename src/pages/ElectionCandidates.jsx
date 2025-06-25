import axios from "axios";
import React from "react";
import { IoMdTrash } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ElectionCandidates = ({ fullName, image, motto, _id: id }) => {
  const token = useSelector((state) => state.vote.currentVoter?.token);

  const isAdmin = useSelector((state) => state.vote.currentVoter?.isAdmin);

  const navigate = useNavigate();

  const deleteCandidate = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;

      const response = await axios.delete(`${baseURL}/candidates/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate(0);
    } catch (err) {
      const message =
        err.response?.data?.message || "Error fetching election candidates";
    }
  };

  return (
    <li className="electionDetails_candidate">
      <div className="election_candidate_img">
        <img src={image} alt={fullName} />
      </div>

      <div className="electionDetails_candidate_info">
        <h5>{fullName}</h5>

        <small>
          {motto?.length > 70 ? motto.substring(0, 70) + "..." : motto}
        </small>

        {isAdmin && (
          <button className="election_candidate_btn" onClick={deleteCandidate}>
            <IoMdTrash />
          </button>
        )}
      </div>
    </li>
  );
};

export default ElectionCandidates;
