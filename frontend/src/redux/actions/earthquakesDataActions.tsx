import axios from 'axios';
import {
  GET_EARTHQUAKES_DIFFERENT_DATE_FAIL,
  GET_EARTHQUAKES_DIFFERENT_DATE_REQUEST,
  GET_EARTHQUAKES_DIFFERENT_DATE_SUCCESS,
  GET_EARTHQUAKES_FAIL,
  GET_EARTHQUAKES_REQUEST,
  GET_EARTHQUAKES_SUCCESS,
} from '../constants/earthquakesDataConstants';

export const fetchAndGetEarthquakesByDate =
  ({ limit, end, start }: { end?: string; start?: string; limit?: number }) =>
  async (dispatch: any) => {
    try {
      dispatch({ type: GET_EARTHQUAKES_DIFFERENT_DATE_REQUEST });
      const { data } = await axios.get(`/api/earthquakes/by-date`, {
        params: { limit, end, start },
      });
      dispatch({
        type: GET_EARTHQUAKES_DIFFERENT_DATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_EARTHQUAKES_DIFFERENT_DATE_FAIL,
        payload: error,
      });
    }
  };

export const getEarthquakes =
  ({ limit, start, end }: { limit: number; start?: string; end?: string }) =>
  async (dispatch: any) => {
    try {
      dispatch({ type: GET_EARTHQUAKES_REQUEST });
      const { data } = await axios.get(`/api/earthquakes`, {
        params: { limit, start, end },
      });
      dispatch({
        type: GET_EARTHQUAKES_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_EARTHQUAKES_FAIL,
        payload: error,
      });
    }
  };
