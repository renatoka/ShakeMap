import {
  MAPBOX_TOKEN_FAIL,
  MAPBOX_TOKEN_REQUEST,
  MAPBOX_TOKEN_SUCCESS,
} from '../constants/token-constants';
import axios from 'axios';

export const getMapboxToken = () => async (dispatch: any) => {
  try {
    dispatch({ type: MAPBOX_TOKEN_REQUEST });
    const { data } = await axios.get('/api/token');
    dispatch({
      type: MAPBOX_TOKEN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MAPBOX_TOKEN_FAIL,
      payload: error,
    });
  }
};
