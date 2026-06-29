import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type TAuthState = {
  isAuthChecked: boolean;
  isLoggedIn: boolean;
};

const initialState: TAuthState = {
  isAuthChecked: false,
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthStatus: (
      state,
      action: PayloadAction<{ isAuthChecked: boolean; isLoggedIn: boolean }>
    ) => {
      state.isAuthChecked = action.payload.isAuthChecked;
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});

export const { setAuthStatus } = authSlice.actions;
