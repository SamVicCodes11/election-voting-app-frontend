import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Congrats from "./pages/Congrats";
import ElectionDetails from "./pages/ElectionDetails";
import Elections from "./pages/Elections";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Logout from "./pages/Logout";
import Results from "./pages/Results";
import Candidates from "./pages/Candidates";
import { useEffect } from "react";
import { voteActions } from "./components/store/vote-slice";
import { useDispatch } from "react-redux";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const storedVoter = JSON.parse(localStorage.getItem("currentVoter"));
  //   if (storedVoter) {
  //     dispatch(voteActions.changeCurrentVoter(storedVoter));
  //   }
  // }, []);

  return (
    <Router>
      <Navbar />
        <ToastContainer position="top-center" autoClose={3000} />
      <Routes>

        <Route path="*" element={<ErrorPage />} />
        <Route index path="/results" element={<Results />} />
        <Route path="/elections" element={<Elections />} />
        <Route path="congrats" element={<Congrats />} />
        <Route path="/elections/:id" element={<ElectionDetails />} />
        <Route path="/elections/:id/candidates" element={<Candidates />} />
        <Route path="/" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
