import axios from 'axios';
import {
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
} from '../constants/users-constants';

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
    } catch (error) {
      dispatch({
        type: CREATE_USER_FAIL,
        payload: error,
      });
    }
  };
