
// Configuration du store Redux Toolkit
// Regroupe les reducers (ici `auth`) pour fournir le store à l'application
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/authSlice";
import toastReducer from "../feature/toastSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
  },
});
export default store;