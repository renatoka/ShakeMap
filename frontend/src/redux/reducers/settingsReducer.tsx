import { createSlice } from '@reduxjs/toolkit';

declare module 'redux' {
  interface Action<T = any> {
    payload?: T;
  }
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    rotating: false,
    pulsing: true,
    projection: 'globe',
    limit: 20,
    selectedDate: new Date().toISOString(),
  },
  reducers: {
    setRotating(state, action) {
      state.rotating = action.payload;
    },
    setProjection(state, action) {
      state.projection = action.payload;
    },
    setDisablePulsing(state, action) {
      state.pulsing = action.payload;
    },
    setLimit(state, action) {
      state.limit = action.payload;
    },
    setSelectedDate(state, action) {
      state.selectedDate = action.payload;
    },
  },
});

export const {
  setRotating,
  setProjection,
  setDisablePulsing,
  setLimit,
  setSelectedDate,
} = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
