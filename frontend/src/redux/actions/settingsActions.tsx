import {
  setDisablePulsing,
  setLimit,
  setProjection,
  setRotating,
  setSelectedDate,
  setShowSubscribeModal,
} from '../reducers/settingsReducer';
import { AppDispatch } from '../store';

export const setRotatingAction =
  (rotating: boolean) => (dispatch: AppDispatch) => {
    dispatch(setRotating(rotating));
  };

export const setProjectionAction =
  (projection: string) => (dispatch: AppDispatch) => {
    dispatch(setProjection(projection));
  };

export const setDisablePulsingAction =
  (disablePulsing: boolean) => (dispatch: AppDispatch) => {
    dispatch(setDisablePulsing(disablePulsing));
  };

export const setLimitAction = (limit: number) => (dispatch: AppDispatch) => {
  dispatch(setLimit(limit));
};

export const setSelectedDateAction =
  (date: string) => (dispatch: AppDispatch) => {
    dispatch(setSelectedDate(date));
  };

export const setShowSubscribeModalAction =
  (showSubscribeModal: boolean) => (dispatch: AppDispatch) => {
    dispatch(setShowSubscribeModal(showSubscribeModal));
  };
