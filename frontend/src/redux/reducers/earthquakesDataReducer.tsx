import { createSlice } from '@reduxjs/toolkit';
import {
  GET_EARTHQUAKES_FAIL,
  GET_EARTHQUAKES_REQUEST,
  GET_EARTHQUAKES_SUCCESS,
  GET_EARTHQUAKES_DIFFERENT_DATE_FAIL,
  GET_EARTHQUAKES_DIFFERENT_DATE_REQUEST,
  GET_EARTHQUAKES_DIFFERENT_DATE_SUCCESS,
} from '../constants/earthquakesDataConstants';

// extend the Action interface to include a payload property
declare module 'redux' {
  interface Action<T = any> {
    payload?: T;
  }
}

const initialState: any = {
  earthquakesData: null,
  loading: false,
  done_initial_fetch: false,
  error: null,
  limit: null,
};

const earthquakesDataSlice = createSlice({
  name: 'earthquakesData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GET_EARTHQUAKES_REQUEST, (state) => {
      state.loading = true;
    });
    builder.addCase(GET_EARTHQUAKES_SUCCESS, (state, action) => {
      state.loading = false;
      state.earthquakesData = action.payload;
      state.limit = action.payload?.length;
    });
    builder.addCase(GET_EARTHQUAKES_FAIL, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(GET_EARTHQUAKES_DIFFERENT_DATE_REQUEST, (state) => {
      state.loading = true;
    });
    builder.addCase(GET_EARTHQUAKES_DIFFERENT_DATE_SUCCESS, (state, action) => {
      state.loading = false;
      state.earthquakesData = action.payload;
      state.limit = action.payload?.length;
    });
    builder.addCase(GET_EARTHQUAKES_DIFFERENT_DATE_FAIL, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const earthquakesDataReducer = earthquakesDataSlice.reducer;
