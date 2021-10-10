import { createSlice } from "@reduxjs/toolkit";
export const navSlice = createSlice({
  name: "navSlice",
  initialState: {
    origin: null,
    destination: null,
    travelTimeInformation: null,
    loginInfo: null,
    savedPlaces: [],
  },
  reducers: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setTravelTimeInformation: (state, action) => {
      state.travelTimeInformation = action.payload;
    },
    setLoginInfo: (state, action) => {
      state.loginInfo = action.payload;
    },
    setSavedPlaces: (state, action) => {
      state.savedPlaces = [...action.payload.places];
    },
  },
});

// actions
export const {
  setOrigin,
  setDestination,
  setTravelTimeInformation,
  setLoginInfo,
  setSavedPlaces,
} = navSlice.actions;

// selectors
export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.destination;
export const selectTravelTimeInformation = (state) =>
  state.nav.travelTimeInformation;
export const selectLoginInfo = (state) => state.nav.loginInfo;
export const selectSavedPlaces = (state) => state.nav.savedPlaces;

// reducer
export default navSlice.reducer;
