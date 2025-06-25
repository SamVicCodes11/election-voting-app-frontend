import React, { useEffect, useState } from "react";
import { candidates, elections, voters } from "../Data";
import { useNavigate, useParams } from "react-router-dom";
import ElectionCandidates from "./ElectionCandidates";
import { IoAddOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import AddCandidateModal from "../components/AddCandidateModal";
import { UiActions } from "../components/store/ui-slice";
import axios from "axios";
import { voteActions } from "../components/store/vote-slice";
import Loader from "../components/Loader";

const ElectionDetails = () => {
  const token = useSelector((state) => state.vote.currentVoter?.token);

  const navigate = useNavigate();

  // ACCESS CONTROL

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token]);

  const [election, setElection] = useState([]);
  const [candidate, setCandidate] = useState([]);
  const [voters, setVoters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scroll(0, 0);
    fetchElection();
    fetchCandidate();
    fetchVoters();
  }, []);

  const { id } = useParams();

  // const currentElection = elections.find((election) => election.id == id);

  // const electionCandidate = candidates.filter(
  //   (candidate) => candidate.election == id
  // );

  const Dispatch = useDispatch();

  const openCandidateModal = () => {
    Dispatch(UiActions.openAddCandidateModal());
    Dispatch(voteActions.changeAddCandidateElectionId(id));
  };

  const addCandidateModalShowing = useSelector(
    (state) => state.ui.addCandidateModalShowing
  );

  const isAdmin = useSelector((state) => state.vote.currentVoter?.isAdmin);

  const fetchElection = async () => {
    setIsLoading(true);
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;

      const response = await axios.get(`${baseURL}/elections/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setElection(response.data.data);
    } catch (err) {
      const message =
        err.response?.data?.message || "Error fetching election candidates";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCandidate = async () => {
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

      setCandidate(response.data.data);
    } catch (err) {
      const message =
        err.response?.data?.message || "Error fetching election candidates";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVoters = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;

      const response = await axios.get(`${baseURL}/elections/${id}/voters`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVoters(response.data.voters);
    } catch (err) {
      const message =
        err.response?.data?.message || "Error fetching election candidates";
      setError(message);
    }
  };

  const deleteElection = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;

      await axios.delete(`${baseURL}/elections/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/elections");
    } catch (err) {
      const message = err.response?.data?.message || "Error deleting election";
      console.error(message);
    }
  };


  return (
    <>
      <section className="election_details">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="container election_details_container">
            <h2>{election.title}</h2>

            <p>{election.description}</p>

            <div className="election_details_img">
              <img src={election.thumbnail} alt={election.title} />
            </div>

            <menu className="electionDetails_candidates">
              {candidate.map((candidate) => {
                return (
                  <ElectionCandidates key={candidate._id} {...candidate} />
                );
              })}
              {isAdmin && (
                <button
                  className="addCandidate_btn"
                  onClick={openCandidateModal}
                >
                  <IoAddOutline />
                </button>
              )}
            </menu>

            <menu className="voters">
              <h2>VOTERS</h2>

              <table className="voters_table">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Time</th>
                  </tr>
                </thead>

                <tbody>
                  {voters.map((voter) => (
                    <tr key={voter._id}>
                      <td>
                        <h5>{voter.fullName}</h5>
                      </td>
                      <td>{voter.email}</td>
                      <td>{new Date(voter.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </menu>
            {isAdmin && (
              <button
                onClick={deleteElection}
                className="btn danger delete_election"
              >
                Delete Election
              </button>
            )}
          </div>
        )}
      </section>

      {addCandidateModalShowing && <AddCandidateModal />}
    </>
  );
};

export default ElectionDetails;
