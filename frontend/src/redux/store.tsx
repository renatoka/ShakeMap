import { earthquakesDataReducer } from './reducers/earthquakes-reducer';
import { settingsReducer } from './reducers/settings-reducer';
import { mapboxTokenReducer } from './reducers/token-reducer';
import { userReducer } from './reducers/users-reducer';
import { configureStore } from '@reduxjs/toolkit';

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
