import { useDispatch, useSelector } from "react-redux";
import { elections } from "./../Data";
import Election from "./Election";
import { UiActions } from "../components/store/ui-slice";
import UpdateElection from "../components/UpdateElection";
import ElectionAddModal from "../components/ElectionAddModal";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const Elections = () => {
  const token = useSelector((state) => state.vote.currentVoter?.token);
  const navigate = useNavigate();

  // ACCESS CONTROL

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token]);

  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scroll(0, 0);
    fetchElections();
  }, []);

  const electionModalShowing = useSelector(
    (state) => state.ui.electionModalShowing
  );

  const updateElectionModalShowing = useSelector(
    (state) => state.ui.updateElectionModalShowing
  );

  const dispatch = useDispatch();

  const electionModal = () => {
    dispatch(UiActions.openElectionModal());
  };

  const isAdmin = useSelector((state) => state.vote.currentVoter?.isAdmin);

  const fetchElections = async () => {
    setIsLoading(true);
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
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // if (isLoading) return ;

  return (
    <>
      <section className="elections">
        <div className="container election_container">
          <header className="election_header">
            <h2>ongoing elections</h2>

            {isAdmin && (
              <button onClick={electionModal} className="btn primary">
                Create New Election
              </button>
            )}
          </header>

          {isLoading ? (
            <Loader />
          ) : (
            <div className="elections_menu">
              {elections.map((election) => {
                return (
                  <Election
                    key={election._id}
                    {...election}
                    isLoading={isLoading}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
      {electionModalShowing && <ElectionAddModal />}

      {updateElectionModalShowing && <UpdateElection />}
    </>
  );
};

export default Elections;
