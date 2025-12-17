
// Configuration du store Redux Toolkit
// Regroupe les reducers (ici `auth`) pour fournir le store à l'application
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
export default store;