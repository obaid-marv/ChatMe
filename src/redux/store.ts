
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Auth/authSlice'
import convSlice from './Conversation/convSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    convs: convSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
