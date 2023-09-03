import {
  GET_EARTHQUAKES_FAIL,
  GET_EARTHQUAKES_REQUEST,
  GET_EARTHQUAKES_SUCCESS,
} from '../constants/earthquakes-constants';
import axios from 'axios';

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
