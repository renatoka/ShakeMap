import { configureStore } from '@reduxjs/toolkit';
import { earthquakesDataReducer } from './reducers/earthquakes-reducer';
import { mapboxTokenReducer } from './reducers/token-reducer';
import { settingsReducer } from './reducers/settings-reducer';
import { userReducer } from './reducers/users-reducer';

export const store = configureStore({
  reducer: {
    mapboxToken: mapboxTokenReducer,
    earthquakesData: earthquakesDataReducer,
    settings: settingsReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
