import { configureStore } from '@reduxjs/toolkit';
import authReducuer from '../features/auth/authSlice'

export const store = configureStore({
  reducer: {
    auth:authReducuer,
  },
});
