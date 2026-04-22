import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// helper to get auth headers for api calls
function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/projects', { headers: getAuthHeaders() });
      const json = await res.json();
      if (!res.ok) return rejectWithValue(json);
      return json;
    } catch (err) {
      return rejectWithValue({ error: 'Failed to fetch projects.' });
    }
  }
);

export const fetchProjectBySlug = createAsyncThunk(
  'projects/fetchBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/projects/${slug}`, { headers: getAuthHeaders() });
      const json = await res.json();
      if (!res.ok) return rejectWithValue(json);
      return json;
    } catch (err) {
      return rejectWithValue({ error: 'Failed to fetch project.' });
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentProject(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProjects.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload.projects;
    });
    builder.addCase(fetchProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.error || 'Failed to load projects.';
    });

    builder.addCase(fetchProjectBySlug.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProjectBySlug.fulfilled, (state, action) => {
      state.loading = false;
      state.current = action.payload.project;
    });
    builder.addCase(fetchProjectBySlug.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.error || 'Failed to load project.';
    });
  },
});

export const { clearCurrentProject } = projectsSlice.actions;
export default projectsSlice.reducer;
