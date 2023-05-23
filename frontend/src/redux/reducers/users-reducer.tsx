import { createSlice } from '@reduxjs/toolkit';
import {
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
} from '../constants/users-constants';

// extend the Action interface to include a payload property
declare module 'redux' {
  interface Action<T = any> {
    payload?: T;
  }
}

const initialState: any = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(CREATE_USER_REQUEST, (state) => {
      state.loading = true;
    });
    builder.addCase(CREATE_USER_SUCCESS, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(CREATE_USER_FAIL, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const userReducer = userSlice.reducer;
