import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

interface AuthState {
  user: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

// Initialize auth async thunk
export const initializeAuth = createAsyncThunk<any>(
  'auth/initializeAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
  
      if (token) {
        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message || 'An error occurred');
    }
  }
);

// Signup async thunk
export const signup = createAsyncThunk<any, { username: string; email: string; password: string }>(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message || 'An error occurred');
    }
  }
);

// Login async thunk
export const login = createAsyncThunk<any, { email: string; password: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      // Set token in cookies
      Cookies.set('authToken', response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message || 'An error occurred');
    }
  }
);

// Logout reducer function
const logoutReducer = (state: AuthState) => {
  state.user = null;
  state.status = 'idle';
  state.error = null;
  Cookies.remove('authToken');
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: logoutReducer, // Use a different name for the reducer function
  },
  extraReducers: (builder) => {
    builder
      // Handle initializeAuth actions
      .addCase(initializeAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.status = 'idle';
        state.user = null;
        state.error = null;
        Cookies.remove('authToken');
      })
      // Handle signup actions
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Handle login actions
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export the logout action
export const { logout } = authSlice.actions;
export default authSlice.reducer;
