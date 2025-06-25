import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  voteCandidateModalShowing: false,
  electionModalShowing: false,
  updateElectionModalShowing: false,
  addCandidateModalShowing: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openVoteCandidateModal(state) {
      state.voteCandidateModalShowing = true;
    },
    closeVoteCandidateModal(state) {
      state.voteCandidateModalShowing = false;
    },
    openAddCandidateModal(state) {
      state.addCandidateModalShowing = true;
    },
    closeAddCandidateModal(state) {
      state.addCandidateModalShowing = false;
    },
    openElectionModal(state) {
      state.electionModalShowing = true;
    },
    closeElectionModal(state) {
      state.electionModalShowing = false;
    },
    openUpdateElectionModal(state) {
      state.updateElectionModalShowing = true; 
    },
    closeUpdateElectionModal(state) {
      state.updateElectionModalShowing = false;
    },
  },
});

export const UiActions = uiSlice.actions;
export default uiSlice;
