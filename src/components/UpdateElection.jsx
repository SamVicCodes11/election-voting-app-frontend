import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UiActions } from "./store/ui-slice";

const UpdateElection = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const idOfElectionToUpdate = useSelector(
    (state) => state.vote.idOfElectionToUpdate
  );

  const token = useSelector((state) => state.vote.currentVoter?.token);

  const closeModal = () => {
    dispatch(UiActions.closeUpdateElectionModal());
  };

  const fetchElection = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;

      const response = await axios.get(
        `${baseURL}/elections/${idOfElectionToUpdate}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const election = response.data.data;
      setTitle(election.title);
      setDescription(election.description);
    } catch (err) {
      const message =
        err.response?.data?.message || "Error fetching election data";
      setError(message);
    }
  };

  const updateElection = async (e) => {
    e.preventDefault();

    try {
      const electionData = new FormData();
      electionData.set("title", title);
      electionData.set("description", description);
      if (thumbnail) {
        electionData.set("thumbnail", thumbnail);
      }

      const baseURL = import.meta.env.VITE_API_BASE_URL;

      await axios.patch(
        `${baseURL}/elections/${idOfElectionToUpdate}`,
        electionData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      closeModal();
      navigate(0);
    } catch (err) {
      console.error("❌ Error updating election:", err);
      setError("Failed to update election. Please try again.");
    }
  };

  useEffect(() => {
    fetchElection();
  }, []);

  return (
    <section className="modal">
      <div className="modal_content">
        <header className="modal_header">
          <h2>EDIT ELECTION</h2>
          <button onClick={closeModal} className="modal_close">
            <IoCloseSharp />
          </button>
        </header>

        <form onSubmit={updateElection}>
          {error && <p className="form_error_message">{error}</p>}

          <div>
            <h6>ELECTION TITLE:</h6>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              name="title"
              required
            />
          </div>

          <div>
            <h6>ELECTION DESCRIPTION:</h6>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              name="description"
              required
            />
          </div>

          <div>
            <h6>ELECTION THUMBNAIL:</h6>
            <input
              onChange={(e) => setThumbnail(e.target.files[0])}
              accept="image/png, image/jpeg, image/jpg, image/webp, image/avif"
              type="file"
              name="thumbnail"
            />
          </div>

          <button type="submit" className="btn primary">
            Update
          </button>
        </form>
      </div>
    </section>
  );
};

export default UpdateElection;
