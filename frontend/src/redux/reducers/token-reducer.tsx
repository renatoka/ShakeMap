import { createSlice } from '@reduxjs/toolkit';
import {
  MAPBOX_TOKEN_REQUEST,
  MAPBOX_TOKEN_SUCCESS,
  MAPBOX_TOKEN_FAIL,
} from '../constants/token-constants';

// extend the Action interface to include a payload property
declare module 'redux' {
  interface Action<T = any> {
    payload?: T;
  }
}

const initialState: any = {
  mapboxToken: null,
  loading: false,
  error: null,
};

const mapboxTokenSlice = createSlice({
  name: 'mapboxToken',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(MAPBOX_TOKEN_REQUEST, (state) => {
      state.loading = true;
    });
    builder.addCase(MAPBOX_TOKEN_SUCCESS, (state, action) => {
      state.loading = false;
      state.mapboxToken = action.payload;
    });
    builder.addCase(MAPBOX_TOKEN_FAIL, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const mapboxTokenReducer = mapboxTokenSlice.reducer;
