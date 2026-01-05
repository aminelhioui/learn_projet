import { createAsyncThunk , createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Normalise les erreurs renvoyées par axios pour les retourner au format attendu
const normalizeAxiosErrors = (error) => {
    // Les erreurs réseau/CORS peuvent ne pas avoir `error.response`
    if (error?.response?.data?.errors) return error.response.data.errors;
    if (error?.response?.data?.error) return error.response.data.error;
    return [{ message: error?.message || 'Network error' }];
};

// ---------------- Actions asynchrones (thunks) ----------------
// Register : envoie un FormData pour créer un utilisateur
export const Register = createAsyncThunk ("auth-register", async (newUser, thunkAPI) => {
    try {
        const result = await api.post("/auth/register", newUser);
        return {msg:result.data.message};
    } catch (error) {
        return thunkAPI.rejectWithValue(normalizeAxiosErrors(error));
    }
});

// Login : envoie les identifiants et récupère l'utilisateur (le backend met le cookie httpOnly)
export const Login = createAsyncThunk ("auth-login", async (credentials, thunkAPI) => {
    try {
        const result = await api.post("/auth/login", credentials);
        const foundUser = result.data.user;
        return {user: foundUser, msg:result.data.message};
    } catch (error) {
        return thunkAPI.rejectWithValue(normalizeAxiosErrors(error));
    }   
});

// Logout : demande au backend de supprimer le cookie
export const Logout = createAsyncThunk ("auth-logout", async (_, thunkAPI) => {
    try {   
        await api.post("/auth/logout");
    } catch (error) {
        return thunkAPI.rejectWithValue(normalizeAxiosErrors(error));
    }
});

// Current : récupère l'utilisateur courant via le cookie (utilisé au démarrage pour initialiser l'état)
export const Current = createAsyncThunk ("auth-current", async (_, thunkAPI) => {
    try {   
        const result = await api.get("/auth/current");
        return result.data.user;
    } catch (error) {
        return thunkAPI.rejectWithValue(normalizeAxiosErrors(error));
    }
});

// ----------------------- Slice -------------------------------
const authSlice = createSlice( {
    name: "auth",
    initialState: {
        user: null, 
        errors: null,
        msg: null,
        loading: false,
        success: null,
        initializing: true,
    },
    reducers: {
        // Réinitialise les erreurs stockées
        clearErrors: (state) => {
            state.errors = null;    
        },
        // Réinitialise le message de succès
        clearSuccess: (state) => {
            state.success = null;    
        },
    },
    extraReducers:(build) => {
        // Register
        build.addCase(Register.pending, (state) => {
            state.loading = true;
            state.errors = null;
            state.msg = null;
            state.success = null;
        });
        build.addCase(Register.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.msg;
        });
        build.addCase(Register.rejected, (state, action) => {
            state.loading = false;
            state.errors = action.payload;
        });

        // Login
        build.addCase(Login.pending, (state) => {
            state.loading = true;
            state.errors = null;
            state.success = null;
        });
        build.addCase(Login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.success = action.payload.msg;
        });
        build.addCase(Login.rejected, (state, action) => {
            state.loading = false;
            state.errors = action.payload;
        });

        // Logout : on supprime l'utilisateur côté client
        build.addCase(Logout.fulfilled, (state) => {
            state.user = null;
        });

        // Current : initialisation de l'utilisateur courant
        build.addCase(Current.pending, (state) => {
            state.initializing = true;
        });
        build.addCase(Current.fulfilled, (state, action) => {
            state.initializing = false;
            state.user = action.payload;
        });
        build.addCase(Current.rejected, (state) => {
            state.initializing = false;
            state.user = null;
        });
   },
});

export const {clearErrors, clearSuccess} = authSlice.actions;
export default authSlice.reducer;