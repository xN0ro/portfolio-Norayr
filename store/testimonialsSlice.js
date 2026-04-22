import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

export const fetchTestimonials = createAsyncThunk(
  'testimonials/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/testimonials', { headers: getAuthHeaders() });
      const json = await res.json();
      if (!res.ok) return rejectWithValue(json);
      return json;
    } catch (err) {
      return rejectWithValue({ error: 'Failed to fetch testimonials.' });
    }
  }
);

export const fetchTestimonialById = createAsyncThunk(
  'testimonials/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, { headers: getAuthHeaders() });
      const json = await res.json();
      if (!res.ok) return rejectWithValue(json);
      return json;
    } catch (err) {
      return rejectWithValue({ error: 'Failed to fetch testimonial.' });
    }
  }
);

export const createTestimonial = createAsyncThunk(
  'testimonials/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) return rejectWithValue(json);
      return json;
    } catch (err) {
      return rejectWithValue({ error: 'Failed to create testimonial.' });
    }
  }
);

export const updateTestimonial = createAsyncThunk(
  'testimonials/update',
  async ({ id, message }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message }),
      });
      const json = await res.json();
      if (!res.ok) return rejectWithValue(json);
      return json;
    } catch (err) {
      return rejectWithValue({ error: 'Failed to update testimonial.' });
    }
  }
);

export const deleteTestimonial = createAsyncThunk(
  'testimonials/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (!res.ok) return rejectWithValue(json);
      return { id };
    } catch (err) {
      return rejectWithValue({ error: 'Failed to delete testimonial.' });
    }
  }
);

const testimonialsSlice = createSlice({
  name: 'testimonials',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
    fieldErrors: null,
    successMessage: null,
  },
  reducers: {
    clearTestimonialErrors(state) {
      state.error = null;
      state.fieldErrors = null;
    },
    clearTestimonialSuccess(state) {
      state.successMessage = null;
    },
    clearCurrentTestimonial(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    // fetch all
    builder.addCase(fetchTestimonials.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTestimonials.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload.testimonials;
    });
    builder.addCase(fetchTestimonials.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.error || 'Failed to load testimonials.';
    });

    // fetch single one
    builder.addCase(fetchTestimonialById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTestimonialById.fulfilled, (state, action) => {
      state.loading = false;
      state.current = action.payload.testimonial;
    });
    builder.addCase(fetchTestimonialById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.error || 'Failed to load testimonial.';
    });

    // create new
    builder.addCase(createTestimonial.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.fieldErrors = null;
    });
    builder.addCase(createTestimonial.fulfilled, (state, action) => {
      state.loading = false;
      state.list.unshift(action.payload.testimonial);
      state.successMessage = action.payload.message;
    });
    builder.addCase(createTestimonial.rejected, (state, action) => {
      state.loading = false;
      if (action.payload?.errors) {
        state.fieldErrors = action.payload.errors;
      } else {
        state.error = action.payload?.error || 'Failed to create testimonial.';
      }
    });

    // update existing
    builder.addCase(updateTestimonial.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.fieldErrors = null;
    });
    builder.addCase(updateTestimonial.fulfilled, (state, action) => {
      state.loading = false;
      const idx = state.list.findIndex(t => t.id === action.payload.testimonial.id);
      if (idx !== -1) state.list[idx] = action.payload.testimonial;
      state.successMessage = action.payload.message;
    });
    builder.addCase(updateTestimonial.rejected, (state, action) => {
      state.loading = false;
      if (action.payload?.errors) {
        state.fieldErrors = action.payload.errors;
      } else {
        state.error = action.payload?.error || 'Failed to update testimonial.';
      }
    });

    // delete
    builder.addCase(deleteTestimonial.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteTestimonial.fulfilled, (state, action) => {
      state.loading = false;
      state.list = state.list.filter(t => t.id !== action.payload.id);
      state.successMessage = 'Testimonial deleted.';
    });
    builder.addCase(deleteTestimonial.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.error || 'Failed to delete testimonial.';
    });
  },
});

export const { clearTestimonialErrors, clearTestimonialSuccess, clearCurrentTestimonial } = testimonialsSlice.actions;
export default testimonialsSlice.reducer;
