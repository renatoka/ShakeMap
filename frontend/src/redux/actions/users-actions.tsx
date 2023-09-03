import {
  CREATE_USER_FAIL,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
} from '../constants/users-constants';
import axios from 'axios';

export const createUser =
  (inputs: { firstName: string; lastName: string; email: string }) =>
  async (dispatch: any) => {
    try {
      dispatch({ type: CREATE_USER_REQUEST });
      const { data } = await axios.post('/api/users', inputs);
      dispatch({
        type: CREATE_USER_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: CREATE_USER_FAIL,
        payload: error.response.data.message,
      });
    }
  };
