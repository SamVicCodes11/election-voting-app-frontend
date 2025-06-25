import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UiActions } from "./store/ui-slice";

const AddCandidateModal = () => {
  const [fullName, setFullName] = useState("");
  const [motto, setMotto] = useState("");
  const [image, setImage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeModal = () => {
    dispatch(UiActions.closeAddCandidateModal());
  };

  const token = useSelector((state) => state.vote.currentVoter?.token);
  const electionId = useSelector((state) => state.vote.addCandidateElectionId);

  const addCandidate = async (e) => {
    e.preventDefault();

    if (!fullName || !motto || !image) {
      return alert("Please fill all fields and upload an image.");
    }

    try {
      const candidateData = new FormData();
      candidateData.set("fullName", fullName);
      candidateData.set("motto", motto);
      candidateData.set("image", image);
      candidateData.set("currentElection", electionId);

      const baseURL = import.meta.env.VITE_API_BASE_URL;

      await axios.post(`${baseURL}/candidates`, candidateData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      navigate(0);
    } catch (err) {
      console.error("❌ Error adding candidate:", err);
      alert("Failed to add candidate. Please try again.");
    }
  };

  return (
    <section className="modal">
      <div className="modal_content">
        <header className="modal_header">
          <h2>ADD CANDIDATE</h2>
          <button onClick={closeModal} className="modal_close">
            <IoCloseSharp />
          </button>
        </header>

        <form onSubmit={addCandidate}>
          <div>
            <h6>CANDIDATE NAME:</h6>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              name="fullName"
              required
            />
          </div>

          <div>
            <h6>CANDIDATE MOTTO:</h6>
            <input
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              type="text"
              name="motto"
              required
            />
          </div>

          <div>
            <h6>CANDIDATE IMAGE:</h6>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/png, image/jpeg, image/jpg, image/webp, image/avif"
              type="file"
              name="image"
              required
            />
          </div>

          <button type="submit" className="btn primary">
            Add Candidate
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddCandidateModal;
