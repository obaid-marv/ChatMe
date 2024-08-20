import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

interface convState {
  convs: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: convState = {
  convs: null,
  status: 'idle',
  error: null,
};

// Initialize auth async thunk


// Signup async thunk
export const getConvs = createAsyncThunk<any>(
  'conversations/get',
  async (_, { rejectWithValue }) => {
    try {
        const token = Cookies.get('authToken');
        if (token) {
          const response = await axios.get('/api/messages/conversations', {
            headers: { Authorization: `Bearer ${token}` }
          });
          return response.data;
    }
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message || 'An error occurred');
    }
  }
);


const convSlice = createSlice({
  name: 'conv',
  initialState,
  reducers : {},
  extraReducers: (builder) => {
    builder
      .addCase(getConvs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getConvs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log(action.payload)
        state.convs = action.payload;
      })
      .addCase(getConvs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default convSlice.reducer;
