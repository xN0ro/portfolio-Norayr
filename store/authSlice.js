import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// register thunk - sends data to the api and stores token
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) return rejectWithValue(json);
      if (json.token) localStorage.setItem('token', json.token);
      return json;
    } catch (err) {
      return rejectWithValue({ error: 'Network error. Please try again.' });
    }
  }
);

// login thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) return rejectWithValue(json);
      if (json.token) localStorage.setItem('token', json.token);
      return json;
    } catch (err) {
      return rejectWithValue({ error: 'Network error. Please try again.' });
    }
  }
);

// check if theres already a valid token saved
export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (!res.ok) return rejectWithValue(json);
      return json;
    } catch (err) {
      return rejectWithValue({ error: 'Network error' });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('token');
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    authChecked: false,
    error: null,
    fieldErrors: null,
    successMessage: null,
  },
  reducers: {
    clearAuthErrors(state) {
      state.error = null;
      state.fieldErrors = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // register cases
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.fieldErrors = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.successMessage = action.payload.message;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      if (action.payload?.errors) {
        state.fieldErrors = action.payload.errors;
      } else {
        state.error = action.payload?.error || 'Registration failed.';
      }
    });

    // login cases
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.fieldErrors = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.successMessage = action.payload.message;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      if (action.payload?.errors) {
        state.fieldErrors = action.payload.errors;
      } else {
        state.error = action.payload?.error || 'Login failed.';
      }
    });

    // check auth on page load
    builder.addCase(checkAuth.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.authChecked = true;
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.authChecked = true;
    });

    // logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.successMessage = null;
    });
  },
});

export const { clearAuthErrors, clearSuccessMessage } = authSlice.actions;
export default authSlice.reducer;
