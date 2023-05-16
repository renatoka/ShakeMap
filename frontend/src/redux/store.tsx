import { configureStore } from '@reduxjs/toolkit';
import { earthquakesDataReducer } from './reducers/earthquakesDataReducer';
import { mapboxTokenReducer } from './reducers/mapboxTokenReducer';
import { settingsReducer } from './reducers/settingsReducer';

export const store = configureStore({
  reducer: {
    mapboxToken: mapboxTokenReducer,
    earthquakesData: earthquakesDataReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
